from pydantic import BaseModel

from src.enums import ChartType, ManimChartType


class ChartSelectorResponse(BaseModel):
    reasoning: str
    chart_type: ChartType | ManimChartType


class HCResponse(BaseModel):
    data: list[dict]
    title: str
    xAxisTitle: str = ""
    yAxisTitle: str = ""
    choiceColors: list[str] = []


class ManimChartResponse(BaseModel):
    data: list[int | float]
    labels: list[str]
    title: str
    xAxisTitle: str = ""
    yAxisTitle: str = ""
    colors: list[str] = []