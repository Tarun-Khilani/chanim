from manim import *

config.background_color = BLUE


class LineChartAnimation(Scene):
    def __init__(
        self,
        data,
        labels,
        x_axis_title,
        y_axis_title,
        title="Line Chart Animation",
        **kwargs,
    ):
        super().__init__(**kwargs)
        self.data = data
        self.labels = labels
        self.x_axis_title = x_axis_title
        self.y_axis_title = y_axis_title
        self.title_text = title

    def construct(self):
        # Create axes
        axes = Axes(
            x_range=[0, len(self.data), 1],
            y_range=[0, max(self.data), max(self.data) // 5],
            y_length=6,
            x_length=10,
            axis_config={"include_tip": False},
        ).scale(0.7)

        # Add labels to x-axis
        x_labels = VGroup()
        for i, label in enumerate(self.labels):
            text = Text(label, font_size=20)
            text.next_to(axes.c2p(i, 0), DOWN)
            x_labels.add(text)

        # Add labels to y-axis
        y_labels = VGroup()
        y_step = max(self.data) // 5
        for i in range(6):
            value = i * y_step
            text = Text(str(value), font_size=20)
            text.next_to(axes.c2p(0, value), LEFT)
            y_labels.add(text)

        # Create title
        title = MarkupText(self.title_text).scale(0.8)
        title.to_edge(UP)

        # Create x-axis label
        x_label = MarkupText(self.x_axis_title).scale(0.6)
        x_label.next_to(axes.x_axis, DOWN, 0.5)

        # Create y-axis label
        y_label = MarkupText(self.y_axis_title).scale(0.6)
        y_label.next_to(axes.y_axis, LEFT, 0.5).rotate(90 * DEGREES)

        # Initial animation
        self.play(Write(title), run_time=0.75)
        self.play(
            Create(axes), Create(y_label), Write(x_labels), Write(y_labels), run_time=1
        )

        # Create points and lines
        points = VGroup()
        lines = VGroup()

        for i, value in enumerate(self.data):
            point = Dot(axes.c2p(i, value), color=WHITE)
            points.add(point)

            if i > 0:
                line = Line(
                    axes.c2p(i - 1, self.data[i - 1]), axes.c2p(i, value), color=WHITE
                )
                lines.add(line)

            # Animate point and line
            self.play(Create(point), run_time=0.4)
            if i > 0:
                self.play(Create(line), run_time=0.4)

        self.wait()
