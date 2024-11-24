from manim import *
import random
from enum import Enum
import pathlib


config.background_color = DARK_BLUE


class Arrangement(Enum):
    LEFT_CHART_RIGHT_TEXT = 1
    TOP_TITLE_BOTTOM_CONTENT = 2
    CHART_CENTER_TEXT_BELOW = 3


class CustomPieChart(VGroup):
    def __init__(
        self,
        values,
        labels=None,
        colors=None,
        inner_radius=0.3,
        outer_radius=2,
        **kwargs,
    ):
        super().__init__(**kwargs)

        # Calculate total value
        total = sum(values)

        # Default colors
        if colors is None:
            colors = [RED, GREEN, BLUE, YELLOW, ORANGE, PURPLE]

        # Angles for the pie chart sectors
        start_angle = 0
        for i, value in enumerate(values):
            angle = value / total * TAU  # Proportion of TAU (2π)
            sector = AnnularSector(
                inner_radius=inner_radius,
                outer_radius=outer_radius,
                angle=angle,
                start_angle=start_angle,
                color=colors[i % len(colors)],
            )
            self.add(sector)
            start_angle += angle

        # Add labels
        if labels:
            start_angle = 0
            for i, value in enumerate(values):
                angle = value / total * TAU
                mid_angle = start_angle + angle / 2
                label_pos = np.array([np.cos(mid_angle), np.sin(mid_angle), 0]) * (
                    outer_radius + 0.3
                )
                label = Text(labels[i], font_size=24).move_to(label_pos)
                self.add(label)
                start_angle += angle


class InfographicBuilder(Scene):
    def __init__(
        self,
        chart_type=None,
        title=None,
        insights=None,
        data=None,
        arrangement=Arrangement.LEFT_CHART_RIGHT_TEXT,
        **kwargs,
    ):
        super().__init__(**kwargs)
        self.chart_type = chart_type
        self.title = title
        self.insights = insights
        self.data = data
        self.arrangement = arrangement

    def construct(self):
        # Step 1: Add Title
        if self.title:
            self.add_title()

        # Step 2: Arrange Content Based on Arrangement
        if self.arrangement == Arrangement.LEFT_CHART_RIGHT_TEXT:
            self.add_chart_left_text_right()
        elif self.arrangement == Arrangement.TOP_TITLE_BOTTOM_CONTENT:
            self.add_title_top_content_bottom()
        elif self.arrangement == Arrangement.CHART_CENTER_TEXT_BELOW:
            self.add_chart_center_text_below()

        # Wait for a moment before finishing
        self.wait(2)

    def add_title(self):
        """Add a title to the slide, centered at the top."""
        title_mobj = Text(self.title).scale(1.2).to_edge(UP)
        self.play(Write(title_mobj))
        self.wait(0.5)

    def add_chart(self):
        """Add the specified chart."""
        if self.chart_type == "bar":
            return self.add_bar_chart()
        elif self.chart_type == "pie":
            return self.add_pie_chart()
        elif self.chart_type == "line":
            return self.add_line_graph()

    def add_bar_chart(self):
        """Return a bar chart."""
        values = list(self.data.values())
        labels = list(self.data.keys())
        chart = BarChart(
            values, bar_names=labels, x_length=7, y_length=6, bar_width=0.5
        )
        chart.scale(0.7)
        return chart

    def add_pie_chart(self):
        """Return a pie chart."""
        values = list(self.data.values())
        labels = list(self.data.keys())
        pie_chart = CustomPieChart(values, labels=labels)
        pie_chart.scale(0.7)
        return pie_chart

    def add_line_graph(self):
        """Return a line graph."""
        x_values = range(1, len(self.data) + 1)
        y_values = list(self.data.values())
        axes = Axes(
            x_range=[0, len(self.data) + 1, 1],
            y_range=[0, max(y_values) + 10, 10],
            axis_config={"include_numbers": True},
        )
        graph = axes.plot_line_graph(
            x_values=x_values, y_values=y_values, line_color=BLUE, add_vertex_dots=True
        )
        return VGroup(axes, graph)

    def add_chart_left_text_right(self):
        """Add chart on the left and text on the right."""
        chart = self.add_chart()
        chart.to_edge(LEFT)
        self.play(Create(chart))

        if self.insights:
            self.add_insights(position=RIGHT * 3)

    def add_title_top_content_bottom(self):
        """Add title at the top and chart + text below."""
        chart = self.add_chart()
        chart.move_to(DOWN * 1.5)
        self.play(Create(chart))

        if self.insights:
            self.add_insights(DOWN * -1)

    def add_chart_center_text_below(self):
        """Add chart in the center and text below it."""
        chart = self.add_chart()
        chart.move_to(UP)
        self.play(Create(chart))

        if self.insights:
            self.add_insights(position=DOWN * 2.5)

    def add_insights(self, position=RIGHT):
        """Add insights text with animations, aligned to specified position and introduced line by line."""
        if isinstance(self.insights, list):
            self.add_svg(
                svg_file_path=pathlib.Path(__file__).parent.parent.parent
                / "assets/business-person.svg"
            )
            for i, insight in enumerate(self.insights):
                font_size = 20  # Slightly larger for better readability
                color = WHITE
                insight_mobj = (
                    Text(insight, font_size=font_size)
                    .set_color(color)
                    .move_to(position)
                    .shift(UP * (1 - i * 0.5))
                )
                self.play(
                    Write(insight_mobj), run_time=1.5
                )  # Animate writing line by line
                self.wait(0.5)
        else:
            insights_mobj = (
                Text(self.insights, font_size=28).move_to(position).align_to(LEFT, LEFT)
            )
            self.play(Write(insights_mobj), run_time=1.5)
            self.wait(0.5)

    def add_svg(self, svg_file_path, position=ORIGIN, animation=DrawBorderThenFill):
        """Add an SVG to the scene with animation."""
        svg_mobject = SVGMobject(svg_file_path)
        if self.arrangement == Arrangement.LEFT_CHART_RIGHT_TEXT:
            svg_mobject.move_to(DOWN * 1.5)
        elif self.arrangement == Arrangement.TOP_TITLE_BOTTOM_CONTENT:
            svg_mobject.move_to(LEFT)
        elif self.arrangement == Arrangement.CHART_CENTER_TEXT_BELOW:
            svg_mobject.move_to(UP)
        self.play(animation(svg_mobject))
        self.wait(0.5)


class DemoInfographic(InfographicBuilder):
    def __init__(self, **kwargs):
        super().__init__(
            chart_type="bar",  # Change to "pie", "bar", or "line"
            title="Market Share Distribution",
            insights=[
                "Company A has the largest market share.",
                "Company B is growing steadily.",
                "Company C has seen a decline.",
            ],
            data={"Company A": 45, "Company B": 25, "Company C": 30},
            arrangement=Arrangement.LEFT_CHART_RIGHT_TEXT,  # Choose an arrangement
            **kwargs,
        )
