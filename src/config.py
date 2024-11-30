from src.chart_schemas import HCHTMLTemplate, HCSchemas, ManimChartSchemas
from src.enums import (
    ChartType,
    GroqModel,
    LLMType,
    ManimChartType,
    OpenaiModel,
    VideoQuality,
)
from src.manim_scenes.bar_chart_animation import BarChartAnimation
from src.manim_scenes.line_chart_animation import LineChartAnimation
from src.manim_scenes.pie_chart_animation import PieChartAnimation


class Config:
    LOG_LEVEL: str = "INFO"

    DEFAULT_TEMPERATURE: float = 0.0
    DEFAULT_LLM_PROVIDER = LLMType.GROQ
    DEFAULT_LLM = GroqModel.LLAMA3_70B


QUALITY_MAPPING = {
    VideoQuality.LOW: "480p15",
    VideoQuality.MEDIUM: "720p30",
}

CHART_TYPE_MAPPING = {
    ChartType.BAR: HCSchemas.BAR_SCHEMA,
    ChartType.COLUMN: HCSchemas.COLUMN_SCHEMA,
    ChartType.PIE: HCSchemas.PIE_SCHEMA,
    ChartType.STACKED_BAR: HCSchemas.STACKED_BAR_SCHEMA,
    ChartType.STACKED_COLUMN: HCSchemas.STACKED_COLUMN_SCHEMA,
    ChartType.GROUPED_COLUMN: HCSchemas.GROUPED_COLUMN_SCHEMA,
    ChartType.GROUPED_BAR: HCSchemas.GROUPED_BAR_SCHEMA,
    ChartType.HEATMAP: HCSchemas.HEATMAP_SCHEMA,
}

CHART_TEMPLATE_MAPPING = {
    ChartType.BAR: HCHTMLTemplate.BAR_HTML_TEMPLATE,
    ChartType.COLUMN: HCHTMLTemplate.COLUMN_HTML_TEMPLATE,
    ChartType.HEATMAP: HCHTMLTemplate.HEATMAP_HTML_TEMPLATE,
    ChartType.PIE: HCHTMLTemplate.PIE_HTML_TEMPLATE,
    ChartType.STACKED_BAR: HCHTMLTemplate.STACKED_BAR_HTML_TEMPLATE,
    ChartType.STACKED_COLUMN: HCHTMLTemplate.STACKED_COLUMN_HTML_TEMPLATE,
    ChartType.GROUPED_COLUMN: HCHTMLTemplate.GROUPED_COLUMN_HTML_TEMPLATE,
    ChartType.GROUPED_BAR: HCHTMLTemplate.GROUPED_BAR_HTML_TEMPLATE,
}

CHART_TYPE_MAPPING_MANIM = {
    ManimChartType.LINE: ManimChartSchemas.LINE_SCHEMA,
    ManimChartType.BAR: ManimChartSchemas.BAR_SCHEMA,
    ManimChartType.PIE: ManimChartSchemas.PIE_SCHEMA,
}

CHART_SCENE_MAPPING = {
    ManimChartType.LINE: LineChartAnimation,
    ManimChartType.BAR: BarChartAnimation,
    ManimChartType.PIE: PieChartAnimation,
}
