import logging
from datetime import datetime
from pathlib import Path

from manim import *

from src.config import Config
from src.enums import Arrangement

config.background_color = DARK_BLUE
TITLE_TEXT_FONT = "Serif"
TEXT_FONT = "Sans Serif"

# Create and set up file handler
logs_dir = Path("logs")
logs_dir.mkdir(exist_ok=True)

file_formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
file_handler = logging.FileHandler(
    logs_dir / f"chanim_{datetime.now().strftime('%Y%m%d')}.log"
)
file_handler.setLevel(Config.LOG_LEVEL)
file_handler.setFormatter(file_formatter)
logging.getLogger("manim").addHandler(file_handler)
logger = logging.getLogger("manim")


class InfographicBuilder(Scene):
    def __init__(
        self,
        chart_type: str | None,
        title: str,
        insights: list[str],
        data: dict[str, int | float],
        arrangement,
        asset: str,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self.chart_type = chart_type
        self.title = title
        self.insights = insights
        self.data = data
        self.arrangement = arrangement
        self.asset = asset

    def construct(self):
        if self.title:
            self.add_title()

        if self.arrangement == Arrangement.LEFT_CHART_RIGHT_TEXT:
            self.add_chart_left_text_right()
        elif self.arrangement == Arrangement.RIGHT_CHART_LEFT_TEXT:
            self.add_chart_right_text_left()
        elif self.arrangement == Arrangement.TOP_TITLE_BOTTOM_CONTENT:
            self.add_title_top_content_bottom()
        elif self.arrangement == Arrangement.CHART_CENTER_TEXT_BELOW:
            self.add_chart_center_text_below()

    def add_title(self):
        """Add a title to the slide, centered at the top."""
        title_mobj = Text(self.title).scale(1.2).to_edge(UP)
        self.play(Write(title_mobj))
        self.wait(0.5)

    def add_chart(self, position=LEFT):
        """Add the specified chart."""
        if self.chart_type == "bar":
            return self.add_bar_chart(position)
        elif self.chart_type == "pie":
            return self.add_pie_chart(position)
        elif self.chart_type == "line":
            return self.add_line_graph(position)
        else:
            return None

    def add_bar_chart(self, position=LEFT):
        """Return a bar chart."""
        data = list(self.data.values())
        labels = list(self.data.keys())
        chart = BarChart(
            values=[0] * len(data),
            bar_names=labels,
            y_range=[0, max(data), max(data) // 5],
            x_length=7,
            y_length=6,
            bar_width=0.5,
            bar_fill_opacity=0.8,
        ).scale(0.7)
        chart = chart.to_edge(position)
        self.play(Create(chart), run_time=0.75)
        for i, value in enumerate(data):
            new_chart = BarChart(
                values=data[: i + 1] + [0] * (len(data) - i - 1),
                bar_names=labels,
                y_range=[0, max(data), max(data) // 5],
                x_length=7,
                y_length=6,
                bar_width=0.5,
                bar_fill_opacity=0.8,
            ).scale(0.7)
            new_chart = new_chart.to_edge(position)

            self.play(Transform(chart, new_chart), run_time=0.25)

    def add_pie_chart(self, position=LEFT):
        """Return a pie chart."""
        values = list(self.data.values())
        labels = list(self.data.keys())

        total = sum(values)
        start_angle = 0
        pie = VGroup()
        colors = [RED, GREEN, BLUE, YELLOW, ORANGE, PURPLE]

        for i, value in enumerate(values):
            angle = value / total * TAU
            sector = AnnularSector(
                inner_radius=0.3,
                outer_radius=2,
                angle=angle,
                start_angle=start_angle,
                color=colors[i % len(colors)],
            )

            mid_angle = start_angle + angle / 2
            label_pos = np.array([np.cos(mid_angle), np.sin(mid_angle), 0]) * (2 + 0.3)
            label = Text(f"{labels[i]}\n{value}", font_size=24).move_to(label_pos)

            self.play(Create(sector), Write(label), run_time=1)

            pie.add(sector)
            pie.add(label)
            start_angle += angle
        self.play(pie.to_edge(position), run_time=0.5)

    def add_line_graph(self, position=LEFT):
        """Return a line graph."""
        x_values = range(1, len(self.data) + 1)
        y_values = list(self.data.values())
        axes = Axes(
            x_range=[0, len(self.data) + 1, 1],
            y_range=[0, max(y_values), max(y_values) // 5],
            axis_config={"include_numbers": True, "include_tip": False},
        ).scale(0.5)
        graph = axes.plot_line_graph(
            x_values=x_values, y_values=y_values, line_color=RED, add_vertex_dots=True
        )
        group = VGroup(axes, graph)
        group.to_edge(position)
        self.play(Create(group), run_time=0.75)

    def add_chart_left_text_right(self):
        """Add chart on the left and text on the right."""
        self.add_chart(LEFT)
        if self.insights:
            self.add_insights(position=RIGHT * 3)

    def add_chart_right_text_left(self):
        self.add_chart(RIGHT)
        if self.insights:
            self.add_insights(position=LEFT * 3)

    def add_title_top_content_bottom(self):
        """Add title at the top and chart + text below."""
        INSIGHT_POSITION = DOWN
        if self.chart_type:
            self.add_chart(DOWN * 1.5)
            INSIGHT_POSITION = DOWN * -1
        if self.insights:
            self.add_insights(INSIGHT_POSITION)

    def add_chart_center_text_below(self):
        """Add chart in the center and text below it."""
        self.add_chart(UP)
        if self.insights:
            self.add_insights(position=DOWN * 2.5)

    def add_insights(self, position=RIGHT):
        """Add insights text with animations, aligned to specified position and introduced line by line."""
        if len(self.insights) > 1:
            self.add_svg(
                svg_file_path=Path(__file__).parent.parent.parent
                / f"assets/{self.asset}"
            )
            for i, insight in enumerate(self.insights):
                font_size = 20
                color = WHITE
                insight_mobj = (
                    Text(insight, font_size=font_size)
                    .set_color(color)
                    .move_to(position)
                    .shift(UP * (1 - i * 0.5))
                )
                self.play(Write(insight_mobj), run_time=1)
                self.wait(0.5)
        else:
            self.add_svg(
                svg_file_path=Path(__file__).parent.parent.parent
                / f"assets/{self.asset}"
            )
            insights_mobj = Text(self.insights[0], font_size=28).align_to(LEFT, LEFT)
            self.play(Write(insights_mobj), run_time=1)
            self.wait(0.5)

    def add_svg(self, svg_file_path, animation=DrawBorderThenFill):
        """Add an SVG to the scene with animation."""
        svg_mobject = SVGMobject(svg_file_path, use_svg_cache=False)
        if self.arrangement == Arrangement.LEFT_CHART_RIGHT_TEXT:
            svg_mobject.move_to(np.array((3.5, -1.5, 0)))
        elif self.arrangement == Arrangement.TOP_TITLE_BOTTOM_CONTENT:
            svg_mobject.move_to(LEFT * 5)
        elif self.arrangement == Arrangement.CHART_CENTER_TEXT_BELOW:
            svg_mobject.move_to(LEFT * 5)
        self.play(animation(svg_mobject), run_time=0.5)
        self.wait(0.2)
