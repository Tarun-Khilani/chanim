from pydantic import BaseModel

from src.enums import Arrangement, ChartType, ManimChartType, SVGAssets


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


class InfographicResponse(BaseModel):
    reasoning: list[str]
    title: str
    chart_type: ManimChartType | None
    insights: list[str]
    data: dict[str, int | float]
    asset: SVGAssets
    arrangement: Arrangement


class StoryResponse(BaseModel):
    class Scene(BaseModel):
        title: str
        visuals: str
        animations: str
        key_text: str
        transitions: str
    scenes: list[Scene]


class InfographicAPIResponse(BaseModel):
    title: str
    chart_type: ManimChartType | None = None
    insights: list[str]
    data: dict[str, int | float]
    asset: SVGAssets
    highchart: HCResponse | None = None