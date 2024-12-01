from manim import *


class OpportunitiesAhead(Scene):
    def construct(self):
        # Title Text
        title = Text("Opportunities Ahead", font_size=48, color=YELLOW).to_edge(UP)
        self.play(Write(title))
        
        # Glowing Globe
        globe = Sphere(radius=2, resolution=(32, 32))
        globe.set_color(BLUE_E)
        glow_effect = always_redraw(lambda: Circle(radius=2.2, color=BLUE, stroke_width=4).set_opacity(0.4))
        
        self.play(FadeIn(globe), Create(glow_effect))
        self.wait(1)

        # Energy Lines Radiating
        energy_lines = VGroup()
        for angle in range(0, 360, 45):  # Create lines at intervals of 45 degrees
            line = Line(start=ORIGIN, end=3 * RIGHT)
            line.rotate(angle * DEGREES, about_point=ORIGIN)
            line.set_color(YELLOW)
            energy_lines.add(line)
        
        self.play(
            LaggedStartMap(GrowFromCenter, energy_lines, lag_ratio=0.2),
            run_time=2
        )

        # Pulsing Effect on Lines
        for _ in range(3):  # Pulse the lines 3 times
            self.play(energy_lines.animate.set_opacity(0.2), run_time=0.5)
            self.play(energy_lines.animate.set_opacity(1), run_time=0.5)

        self.wait(1)

        # Timeline Graph
        graph_axes = Axes(
            x_range=[0, 5, 1], 
            y_range=[0, 100, 10], 
            axis_config={"include_numbers": True, "color": GREY_A}
        ).to_edge(DOWN)
        
        graph_labels = graph_axes.get_axis_labels(x_label="Years", y_label="Adoption (%)")
        self.play(Create(graph_axes), Write(graph_labels))

        graph = graph_axes.plot(
            lambda x: 90 * (1 - 2**(-x)),  # Growth curve approaching 90%
            x_range=[0, 5], color=YELLOW
        )
        self.play(Create(graph), run_time=3)

        # Add "Future Growth: 90% Adoption by 2030"
        future_growth_text = Text("Future Growth: 90% Adoption by 2030", font_size=32, color=GREEN)
        future_growth_text.next_to(graph, UP)
        self.play(Write(future_growth_text))

        # # Simulate Zoom Out Effect (Alternative)
        # zoom_out_animation = self.camera.animate.set_zoom(0.75).move_to(globe.get_center())
        # self.play(zoom_out_animation, run_time=2)
        # self.wait(2)


if __name__ == "__main__":
    with tempconfig(
        {
            "preview": False,
            "quality": "medium_quality",
            "output_file": "opportunities_ahead",
        }
    ):
        scene = OpportunitiesAhead()
        scene.render()