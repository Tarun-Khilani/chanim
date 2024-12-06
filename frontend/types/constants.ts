import { z } from "zod";

export const COMP_NAME = "Video";

export const CompositionProps = z.object({
  title: z.object({
    text: z.string(),
    animation: z.string(),
    color: z.string(),
    font: z.string(),
  }),
  backgroundColor: z.string(),
  chart_type: z.string(),
  data: z.array(z.any()),
  asset: z.string(),
  arrangement: z.string(),
  insights: z.array(z.string()),
});

export const defaultVideoProps: z.infer<typeof CompositionProps> = {
  title: {
    text: "Welcome to Chanim",
    animation: "slide-up",
    color: "#E5E7EB",
    font: "Inter",
  },
  backgroundColor: "#111827",
  chart_type: "line",
  data: [
    { x: "2023", y: 100 },
    { x: "2024", y: 120 },
  ],
  asset: "image",
  arrangement: "horizontal",
  insights: [
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  ],
};

export const DURATION_IN_FRAMES = 300;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
