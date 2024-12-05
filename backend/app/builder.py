import json
import re
from uuid import uuid4

import pandas as pd
from manim import tempconfig
from openai.lib._parsing import (
    type_to_response_format_param as _type_to_response_format,
)

from app.config import (
    CHART_SCENE_MAPPING,
    CHART_TEMPLATE_MAPPING,
    CHART_TYPE_MAPPING,
    CHART_TYPE_MAPPING_MANIM,
    Config,
)
from app.enums import (
    ChartType,
    DataType,
    ManimChartType,
    SVGAssets,
    VideoQuality,
    RendererType,
)
from app.llm_factory import LLMFactory
from app.logger import setup_logger
from app.manim_scenes.scene_builder import InfographicBuilder
from app.models import (
    ChartSelectorResponse,
    HCResponse,
    InfographicAPIResponse,
    InfographicRemotionResponse,
    InfographicResponse,
    ManimChartResponse,
    StoryResponse,
)
from app.prompts.crafter import CRAFTER_SYS_PROMPT, CRAFTER_USER_PROMPT
from app.prompts.highchart import HC_GEN_SYSTEM_PROMPT, HC_GEN_USER_PROMPT
from app.prompts.infographics import (
    INFOGRAPHICS_SYSTEM_PROMPT,
    INFOGRAPHICS_USER_PROMPT,
)
from app.prompts.manim_coder import M_CODER_SYS_PROMPT, M_CODER_USER_PROMPT
from app.prompts.remotion_coder import R_CODER_SYS_PROMPT, R_CODER_USER_PROMPT
from app.prompts.selection import (
    CHART_SELECTOR_SYSTEM_PROMPT,
    CHART_SELECTOR_USER_PROMPT,
)
from app.prompts.txt_extraction import (
    TXT_EXTRACT_SYSTEM_PROMPT,
    TXT_EXTRACT_USER_PROMPT,
)
from app.utils import timeit


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
    def _gen_chart(self, data: str, chart_type: str) -> HCResponse:
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
        return response

    @timeit
    def _gen_chart_template(self, data: str, chart_type: str) -> str:
        response = self._gen_chart(data, chart_type)
        template = CHART_TEMPLATE_MAPPING.get(chart_type)
        template = (
            template.replace("{title}", response.title)
            .replace("{data}", json.dumps(response.data))
            .replace("{choiceColors}", json.dumps(response.choiceColors))
            .replace("{xAxisTitle}", response.xAxisTitle)
            .replace("{yAxisTitle}", response.yAxisTitle)
        )
        return template

    @timeit
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

    @timeit
    def _gen_infographic(
        self, data: str, renderer_type: RendererType
    ) -> InfographicResponse | InfographicRemotionResponse:
        schema = json.dumps(
            _type_to_response_format(
                InfographicResponse
                if renderer_type == RendererType.MANIM
                else InfographicRemotionResponse
            ),
            indent=2,
        )
        prompt = [
            {
                "role": "system",
                "content": INFOGRAPHICS_SYSTEM_PROMPT.format(schema=schema),
            },
            {"role": "user", "content": INFOGRAPHICS_USER_PROMPT.format(data=data)},
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM, json_mode=True)
        self.logger.info(f"Generated infographic response: {response}")
        response = (
            InfographicResponse(**json.loads(response))
            if renderer_type == RendererType.MANIM
            else InfographicRemotionResponse(**json.loads(response))
        )
        self.logger.info(
            f"Generated infographic configuration: {response.model_dump_json(indent=2)}"
        )
        return response

    @timeit
    def _gen_video(self, data: str, video_quality: VideoQuality) -> str:
        response = self._gen_infographic(data, RendererType.MANIM)
        outfile_name = uuid4().hex
        with tempconfig(
            {
                "preview": False,
                "quality": video_quality.value,
                "output_file": outfile_name,
            }
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
    def _craft_story(self, data: str) -> StoryResponse:
        prompt = [
            {"role": "system", "content": CRAFTER_SYS_PROMPT},
            {"role": "user", "content": CRAFTER_USER_PROMPT.format(data=data)},
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM, json_mode=True)
        self.logger.info(f"Crafted story response: {response}")
        response = StoryResponse(**json.loads(response))
        return response

    @timeit
    def _gen_code_manim(self, data: str) -> str:
        assets = [asset.value for asset in SVGAssets]
        prompt = [
            {"role": "system", "content": M_CODER_SYS_PROMPT},
            {
                "role": "user",
                "content": M_CODER_USER_PROMPT.format(data=data, assets=str(assets)),
            },
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM)
        self.logger.info(f"Generated code response: {response}")
        return response

    @timeit
    def _gen_code_remotion(self, data: str) -> str:
        assets = [asset.value for asset in SVGAssets]
        prompt = [
            {"role": "system", "content": R_CODER_SYS_PROMPT},
            {
                "role": "user",
                "content": R_CODER_USER_PROMPT.format(
                    data=data,
                    asset_path=Config.DEFAULT_FE_ASSET_PATH,
                    assets=str(assets),
                ),
            },
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM)
        self.logger.info(f"Generated code response: {response}")
        resp_code = re.findall(r"```typescript(.*?)```", response, re.DOTALL)[-1]
        return resp_code

    @timeit
    def run(
        self,
        data: str | pd.DataFrame,
        data_type: DataType,
        video_quality: VideoQuality,
    ) -> str:
        data_md = data if data_type == DataType.TEXT else data.to_markdown(index=False)
        outfile_name = self._gen_video(data_md, video_quality)
        return outfile_name

    @timeit
    def run_infographic(
        self, data: str | pd.DataFrame, data_type: DataType
    ) -> InfographicAPIResponse:
        data_md = data if data_type == DataType.TEXT else data.to_markdown(index=False)
        response = self._gen_infographic(data_md, RendererType.REMOTION)
        return InfographicAPIResponse(
            title=response.title,
            chart_type=response.chart_type.value,
            insights=response.insights,
            data=[d.model_dump() for d in response.data],
            asset=response.asset.value,
            arrangement=response.arrangement.value,
        )

    @timeit
    def run_code_remotion(self, data: str | pd.DataFrame, data_type: DataType) -> str:
        data_md = data if data_type == DataType.TEXT else data.to_markdown(index=False)
        return self._gen_code_remotion(data_md)
