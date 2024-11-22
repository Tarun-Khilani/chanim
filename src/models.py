from pydantic import BaseModel

from src.enums import ChartType


class ChartSelectorResponse(BaseModel):
    reasoning: str
    chart_type: ChartType

class HCResponse(BaseModel):
    data: list[dict]
    title: str
    choiceColors: list[str] | None = None
