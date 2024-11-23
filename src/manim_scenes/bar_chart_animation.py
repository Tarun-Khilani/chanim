from manim import *

config.background_color = BLUE


class BarChartAnimation(Scene):
    def __init__(
        self,
        data,
        labels,
        x_axis_title,
        y_axis_title,
        title="Bar Chart Animation",
        **kwargs,
    ):
        super().__init__(**kwargs)
        # Default values if none provided
        self.data = data
        self.labels = labels
        self.x_axis_title = x_axis_title
        self.y_axis_title = y_axis_title
        self.title_text = title

    def construct(self):
        # Create empty bar chart
        chart = BarChart(
            values=[0] * len(self.data),
            bar_names=self.labels,
            y_range=[0, max(self.data), max(self.data) // 5],
            y_length=6,
            x_length=10,
            bar_width=0.5,
            bar_fill_opacity=0.8,
        ).scale(0.7)

        # Add title
        title = MarkupText(self.title_text).scale(0.8)
        title.to_edge(UP)

        # Create x-axis label
        x_label = MarkupText(self.x_axis_title).scale(0.6)
        x_label.next_to(chart.x_axis, DOWN, 0.5)

        # Create y-axis label
        y_label = MarkupText(self.y_axis_title).scale(0.6)
        y_label.next_to(chart.y_axis, LEFT, 0.5).rotate(90 * DEGREES)

        # Initial animation
        self.play(Write(title), run_time=0.5)
        self.play(Create(chart), Create(y_label), run_time=0.75)

        # Animate each bar growing
        for i, value in enumerate(self.data):
            new_chart = BarChart(
                values=self.data[: i + 1] + [0] * (len(self.data) - i - 1),
                bar_names=self.labels,
                y_range=[0, max(self.data), max(self.data) // 5],
                y_length=6,
                x_length=10,
                bar_width=0.5,
                bar_fill_opacity=0.8,
            ).scale(0.7)

            self.play(Transform(chart, new_chart), run_time=0.75)

        self.wait()
