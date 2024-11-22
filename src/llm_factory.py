from abc import ABC, abstractmethod

from dotenv import load_dotenv
from groq import Groq
from openai import OpenAI

from src.config import Config
from src.enums import LLMType

load_dotenv()


class LLM(ABC):
    @abstractmethod
    def __init__(self) -> None:
        super().__init__()

    @abstractmethod
    def get_response(
        self, prompt: list[dict], model: str, json_mode: bool = False
    ) -> str:
        pass


class OpenaiLLM(LLM):
    def __init__(self) -> None:
        self.client = OpenAI()
        self._temperature = Config.DEFAULT_TEMPERATURE

    def get_response(
        self, prompt: list[dict], model: str, json_mode: bool = False
    ) -> str:
        response_format = None
        if json_mode:
            response_format = {"type": "json_object"}
        response = self.client.chat.completions.create(
            model=model,
            messages=prompt,
            temperature=self._temperature,
            response_format=response_format,
        )
        return response.choices[0].message.content


class GroqLLM(LLM):
    def __init__(self) -> None:
        self.client = Groq()
        self._temperature = Config.DEFAULT_TEMPERATURE

    def get_response(
        self, prompt: list[dict], model: str, json_mode: bool = False
    ) -> str:
        response_format = None
        if json_mode:
            response_format = {"type": "json_object"}
        response = self.client.chat.completions.create(
            model=model,
            messages=prompt,
            temperature=self._temperature,
            response_format=response_format,
        )
        return response.choices[0].message.content


class LLMFactory:
    @staticmethod
    def get_llm(llm_type: str) -> LLM:
        if llm_type == LLMType.OPENAI:
            return OpenaiLLM()
        elif llm_type == LLMType.GROQ:
            return GroqLLM()
        else:
            raise ValueError(f"Unknown LLM type: {llm_type}")
