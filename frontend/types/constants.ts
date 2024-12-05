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
  chart: z.object({
    data: z.array(
      z.object({
        key: z.string(),
        data: z.number(),
      })
    ),
    color: z.string(),
    backgroundColor: z.string(),
  }),
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
  chart: {
    data: [
      { key: "A", data: 10 },
      { key: "B", data: 25 },
      { key: "C", data: 15 },
    ],
    color: "#10B981",
    backgroundColor: "#1F2937",
  },
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
