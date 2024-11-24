from manim import *
config.background_color = DARK_BLUE

class PieChartAnimation(Scene):
    def __init__(self, data, labels, colors, title="Pie Chart Animation", **kwargs):
        super().__init__(**kwargs)
        self.data = data
        self.labels = labels
        self.colors = colors
        self.title_text = title
        
    def construct(self):
        # Create title
        title = MarkupText(self.title_text).scale(0.8)
        title.to_edge(UP)
        self.play(Write(title), run_time=0.5)

        # Initialize empty pie chart
        total = sum(self.data)
        start_angle = 0
        pie = VGroup()
        
        # Animate each sector
        for value, color, label in zip(self.data, self.colors, self.labels):
            angle = (value / total) * 360 * DEGREES
            sector = Sector(
                outer_radius=2,
                angle=angle,
                start_angle=start_angle,
                color=color,
                fill_opacity=0.8
            )
            
            percentage = f"{label}\n{value}%"
            label_pos = sector.point_from_proportion(0.7)
            percentage_text = MarkupText(percentage, font_size=24)
            percentage_text.move_to(label_pos)
            
            # Animate sector and label appearing
            self.play(
                Create(sector),
                Write(percentage_text),
                run_time=0.75
            )
            
            pie.add(sector)
            start_angle += angle
        
        self.wait()
