from manim import *
from src.enums import Arrangement, SVGAssets
from src.manim_scenes.bar_chart_animation import BarChartAnimation
from src.manim_scenes.line_chart_animation import LineChartAnimation
from src.manim_scenes.pie_chart_animation import PieChartAnimation
from src.manim_scenes.scene_builder import InfographicBuilder


def test_bar_chart():
    # Example 1: Monthly Sales Data
    monthly_data = [120, 150, 180, 140, 200]
    monthly_labels = ["Jan", "Feb", "Mar", "Apr", "May"]
    with tempconfig(
        {"preview": False, "quality": "medium_quality", "output_file": "monthly_sales"}
    ):
        scene = BarChartAnimation(
            data=monthly_data, labels=monthly_labels, title="Monthly Sales 2023"
        )
        scene.render()

    # Example 2: Student Scores
    score_data = [85, 92, 78, 95, 88]
    score_labels = ["Math", "Science", "History", "English", "Art"]
    with tempconfig(
        {"preview": False, "quality": "medium_quality", "output_file": "student_scores"}
    ):
        scene = BarChartAnimation(
            data=score_data, labels=score_labels, title="Student Performance"
        )
        scene.render()


def test_line_chart():
    # Example 1: Temperature Over Time
    temperature_data = [25, 28, 30, 27, 29]
    temperature_labels = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    with tempconfig(
        {
            "preview": False,
            "quality": "medium_quality",
            "output_file": "temperature_over_time",
        }
    ):
        scene = LineChartAnimation(
            data=temperature_data,
            labels=temperature_labels,
            title="Temperature Over Time",
        )
        scene.render()


def test_pie_chart():
    # Example 1: Budget Distribution
    budget_data = [40, 30, 15, 15]
    budget_labels = ["Housing", "Food", "Transport", "Savings"]
    budget_colors = [ORANGE, GREEN, RED, YELLOW]
    with tempconfig(
        {
            "preview": False,
            "quality": "medium_quality",
            "output_file": "budget_distribution",
        }
    ):
        scene = PieChartAnimation(
            data=budget_data,
            labels=budget_labels,
            colors=budget_colors,
            title="Monthly Budget Distribution",
        )
        scene.render()

    # Example 2: Market Share
    market_data = [45, 25, 20, 10]
    market_labels = ["Product A", "Product B", "Product C", "Others"]
    market_colors = [ORANGE, RED, GREEN, PURPLE]
    with tempconfig(
        {"preview": False, "quality": "medium_quality", "output_file": "market_share"}
    ):
        scene = PieChartAnimation(
            data=market_data,
            labels=market_labels,
            colors=market_colors,
            title="Market Share Analysis",
        )
        scene.render()


def test_infographic():
    # Example 1: Market Share Distribution
    with tempconfig(
        {
            "preview": False,
            "quality": "medium_quality",
            "output_file": "market_share_infographic",
        }
    ):
        scene = InfographicBuilder(
            title="Market Share Distribution",
            chart_type="bar",
            insights=[
                "Company A has the largest market share.",
                "Company B is growing steadily.",
                "Company C has seen a decline.",
            ],
            data={"Company A": 45, "Company B": 25, "Company C": 10},
            asset=SVGAssets.BUSINESS_PERSON,
            arrangement=Arrangement.LEFT_CHART_RIGHT_TEXT,
        )
        scene.render()


if __name__ == "__main__":
    # print("Testing Bar Chart Animations...")
    # test_bar_chart()

    # print("Testing Line Chart Animations...")
    # test_line_chart()

    # print("Testing Pie Chart Animations...")
    # test_pie_chart()

    print("Testing Infographic Builder...")
    test_infographic()