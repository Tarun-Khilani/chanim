from enum import Enum


class LLMType(str, Enum):
    OPENAI = "openai"
    GROQ = "groq"


class OpenaiModel(str, Enum):
    GPT4O = "gpt-4o-2024-08-06"
    GPT4O_MINI = "gpt-4o-mini-2024-07-18"


class GroqModel(str, Enum):
    LLAMA3_8B = "llama-3.1-8b-instant"
    LLAMA3_70B = "llama-3.1-70b-versatile"
    LLAMA3_11B = "llama-3.2-11b-vision-preview"
    LLAMA3_90B = "llama-3.2-90b-vision-preview"


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
