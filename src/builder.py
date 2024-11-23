import json
import re

import pandas as pd

from src.config import CHART_TEMPLATE_MAPPING, CHART_TYPE_MAPPING, Config
from src.llm_factory import LLMFactory
from src.models import ChartSelectorResponse, HCResponse
from src.prompts.highchart import HC_GEN_SYSTEM_PROMPT, HC_GEN_USER_PROMPT
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

    @timeit
    def _process_text(self, data: str) -> str:
        prompt = [
            {"role": "system", "content": TXT_EXTRACT_SYSTEM_PROMPT},
            {"role": "user", "content": TXT_EXTRACT_USER_PROMPT.format(data=data)},
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM)
        # Extract markdown table from response
        response = re.findall(r"```markdown(.*?)```", response, re.DOTALL)[-1]
        return response

    @timeit
    def _select_chart_type(self, data: str) -> str:
        prompt = [
            {"role": "system", "content": CHART_SELECTOR_SYSTEM_PROMPT},
            {"role": "user", "content": CHART_SELECTOR_USER_PROMPT.format(data=data)},
        ]
        response = self.llm.get_response(prompt, Config.DEFAULT_LLM, json_mode=True)
        response = ChartSelectorResponse(**json.loads(response))
        print(response)
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
        print(response)
        response = HCResponse(**json.loads(response))
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
    def run(
        self, data: str | pd.DataFrame, data_type: str, chart_type: str | None
    ) -> str:
        if data_type == "text":
            data_md = self._process_text(data)
        else:
            data_md = data.to_markdown(index=False)

        if chart_type is None:
            chart_type = self._select_chart_type(data_md)
        chart = self._gen_chart(data_md, chart_type)

        return chart
