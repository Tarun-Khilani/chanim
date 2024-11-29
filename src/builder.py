import json
import re
from uuid import uuid4

import pandas as pd
from manim import tempconfig
from openai.lib._parsing import (
    type_to_response_format_param as _type_to_response_format,
)

from src.config import (
    CHART_SCENE_MAPPING,
    CHART_TEMPLATE_MAPPING,
    CHART_TYPE_MAPPING,
    CHART_TYPE_MAPPING_MANIM,
    Config,
)
from src.enums import ChartType, ManimChartType
from src.llm_factory import LLMFactory
from src.logger import setup_logger
from src.manim_scenes.scene_builder import InfographicBuilder
from src.models import (
    ChartSelectorResponse,
    HCResponse,
    InfographicResponse,
    ManimChartResponse,
)
from src.prompts.highchart import HC_GEN_SYSTEM_PROMPT, HC_GEN_USER_PROMPT
from src.prompts.infographics import (
    INFOGRAPHICS_SYSTEM_PROMPT,
    INFOGRAPHICS_USER_PROMPT,
)
from src.prompts.selection import (
    CHART_SELECTOR_SYSTEM_PROMPT,
    CHART_SELECTOR_USER_PROMPT,
)
from src.prompts.txt_extraction import (
    TXT_EXTRACT_SYSTEM_PROMPT,
    TXT_EXTRACT_USER_PROMPT,
)
from src.utils import timeit


class Builder:
    def __init__(self) -> None:
        self.llm = LLMFactory.get_llm(Config.DEFAULT_LLM_PROVIDER)
        self.logger = setup_logger(__name__)

    @timeit
    def _process_text(self, data: str) -> str:
        prompt = [
            {"role": "system", "content": TXT_EXTRACT_SYSTEM_PROMPT},
            {"role": "user", "content": TXT_EXTRACT_USER_PROMPT.format(data=data)},
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM)
        # Extract markdown table from response
        response = re.findall(r"```markdown(.*?)```", response, re.DOTALL)[-1]
        self.logger.info(f"Processed text data - {response}")
        return response

    @timeit
    def _select_chart_type(self, data: str, advanced_mode: bool) -> str:
        chart_type = ManimChartType if advanced_mode else ChartType
        chart_options = [chart.value for chart in chart_type]
        prompt = [
            {
                "role": "system",
                "content": CHART_SELECTOR_SYSTEM_PROMPT.format(
                    chart_options=json.dumps(chart_options)
                ),
            },
            {"role": "user", "content": CHART_SELECTOR_USER_PROMPT.format(data=data)},
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM, json_mode=True)
        response = ChartSelectorResponse(**json.loads(response))
        self.logger.info(f"Selected chart type: {response.chart_type}")
        return response.chart_type

    @timeit
    def _gen_chart(self, data: str, chart_type: str) -> str:
        prompt = [
            {"role": "system", "content": HC_GEN_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": HC_GEN_USER_PROMPT.format(
                    data=data,
                    chart_type=chart_type,
                    chart_schema=json.dumps(CHART_TYPE_MAPPING.get(chart_type)),
                ),
            },
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM, json_mode=True)
        response = HCResponse(**json.loads(response))
        self.logger.info(
            f"Generated chart configuration: {response.model_dump_json(indent=2)}"
        )
        template = CHART_TEMPLATE_MAPPING.get(chart_type)
        template = (
            template.replace("{title}", response.title)
            .replace("{data}", json.dumps(response.data))
            .replace("{choiceColors}", json.dumps(response.choiceColors))
            .replace("{xAxisTitle}", response.xAxisTitle)
            .replace("{yAxisTitle}", response.yAxisTitle)
        )
        return template

    def _gen_chart_manim(self, data: str, chart_type: str) -> str:
        prompt = [
            {"role": "system", "content": HC_GEN_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": HC_GEN_USER_PROMPT.format(
                    data=data,
                    chart_type=chart_type,
                    chart_schema=json.dumps(CHART_TYPE_MAPPING_MANIM.get(chart_type)),
                ),
            },
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM, json_mode=True)
        response = ManimChartResponse(**json.loads(response))
        self.logger.info(
            f"Generated Manim chart configuration: {response.model_dump_json(indent=2)}"
        )
        outfile_name = uuid4().hex
        with tempconfig(
            {"preview": False, "quality": "medium_quality", "output_file": outfile_name}
        ):
            if chart_type == ManimChartType.PIE:
                scene = CHART_SCENE_MAPPING.get(chart_type)(
                    data=response.data,
                    labels=response.labels,
                    title=response.title,
                    colors=response.colors,
                )
            else:
                scene = CHART_SCENE_MAPPING.get(chart_type)(
                    data=response.data,
                    labels=response.labels,
                    title=response.title,
                    x_axis_title=response.xAxisTitle,
                    y_axis_title=response.yAxisTitle,
                )
            scene.render()
        return outfile_name

    def _gen_infographic(self, data: str) -> str:
        schema = json.dumps(_type_to_response_format(InfographicResponse), indent=2)
        prompt = [
            {
                "role": "system",
                "content": INFOGRAPHICS_SYSTEM_PROMPT.format(schema=schema),
            },
            {"role": "user", "content": INFOGRAPHICS_USER_PROMPT.format(data=data)},
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM, json_mode=True)
        self.logger.info(f"Generated infographic response: {response}")
        response = InfographicResponse(**json.loads(response))
        self.logger.info(
            f"Generated infographic configuration: {response.model_dump_json(indent=2)}"
        )
        outfile_name = uuid4().hex
        with tempconfig(
            {"preview": False, "quality": "medium_quality", "output_file": outfile_name}
        ):
            scene = InfographicBuilder(
                title=response.title,
                chart_type=response.chart_type.value if response.chart_type else None,
                insights=response.insights,
                data=response.data,
                arrangement=response.arrangement,
                asset=response.asset.value,
            )
            scene.render()
        return outfile_name

    @timeit
    def run(
        self,
        data: str | pd.DataFrame,
        data_type: str,
        chart_type: str | None,
        advanced_mode: bool,
    ) -> str:
        if data_type == "text":
            data_md = self._process_text(data)
            if advanced_mode:
                data_md = data
        else:
            data_md = data.to_markdown(index=False)

        if chart_type is None and not advanced_mode:
            chart_type = self._select_chart_type(data_md, advanced_mode)
        if advanced_mode:
            # outfile_name = self._gen_chart_manim(data_md, chart_type)
            outfile_name = self._gen_infographic(data_md)
            return outfile_name

        chart = self._gen_chart(data_md, chart_type)
        return chart
