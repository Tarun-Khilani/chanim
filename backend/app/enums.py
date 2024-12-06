from enum import Enum


class LLMType(str, Enum):
    OPENAI = "openai"
    GROQ = "groq"
    GITHUB = "github"


class OpenaiModel(str, Enum):
    GPT4O = "gpt-4o-2024-11-20"
    GPT4O_MINI = "gpt-4o-mini-2024-07-18"


class GroqModel(str, Enum):
    LLAMA3_8B = "llama-3.1-8b-instant"
    LLAMA3_70B = "llama-3.1-70b-versatile"
    LLAMA3_11B = "llama-3.2-11b-vision-preview"
    LLAMA3_90B = "llama-3.2-90b-vision-preview"
    LLAMA3_70B_TOOL = "llama3-groq-70b-8192-tool-use-preview"


class GithubModel(str, Enum):
    GPT4O = "gpt-4o"
    GPT4O_MINI = "gpt-4o-mini"


class DataType(str, Enum):
    TEXT = "text"
    CSV = "csv"


class VideoQuality(str, Enum):
    LOW = "low_quality"
    MEDIUM = "medium_quality"


class ChartType(str, Enum):
    BAR = "bar"
    COLUMN = "column"
    PIE = "pie"
    STACKED_BAR = "stacked_bar"
    STACKED_COLUMN = "stacked_column"
    GROUPED_COLUMN = "grouped_column"
    GROUPED_BAR = "grouped_bar"
    HEATMAP = "heatmap"


class ManimChartType(str, Enum):
    BAR = "bar"
    LINE = "line"
    PIE = "pie"


class RemotionChartType(str, Enum):
    BAR = "bar"
    LINE = "line"
    PIE = "pie"
    STACKED_BAR = "stacked_bar"
    GROUPED_BAR = "grouped_bar"


class SVGAssets(str, Enum):
    BUSINESS_PERSON = "business-person.svg"
    CAR = "car.svg"
    DUMBBELL = "dumbbell.svg"
    HOUSE_PRICE = "house-price.svg"
    LEAVES_2 = "leaves-2.svg"
    LEAVES_5 = "leaves-5.svg"
    ROCKET = "rocket.svg"
    SALE = "sale.svg"
    SNEAKERS = "sneakers.svg"
    SUPPORTING = "supporting.svg"
    TREE_2 = "tree-2.svg"
    WINNER_CUP = "winner-cup.svg"


class Arrangement(str, Enum):
    LEFT_CHART_RIGHT_TEXT = "LEFT_CHART_RIGHT_TEXT"
    RIGHT_CHART_LEFT_TEXT = "RIGHT_CHART_LEFT_TEXT"
    TOP_TITLE_BOTTOM_CONTENT = "TOP_TITLE_BOTTOM_CONTENT"
    CHART_CENTER_TEXT_BELOW = "CHART_CENTER_TEXT_BELOW"


class TitleAnimationType(str, Enum):
    FADE = "fade"
    SLIDE_LEFT = "slide-left"
    SLIDE_RIGHT = "slide-right"
    SLIDE_UP = "slide-up"
    SLIDE_DOWN = "slide-down"

class RendererType(str, Enum):
    MANIM = "manim"
    REMOTION = "remotion"