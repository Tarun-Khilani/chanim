import { z } from "zod";
export const COMP_NAME = "Video";

export const CompositionProps = z.object({
  title: z.object({
    text: z.string(),
    color: z.string().default("#000000").optional(),
    animation: z.enum(["fade", "slide-left", "slide-right", "slide-up", "slide-down"]).default("fade").optional(),
  }),
  backgroundColor: z.string().default("#ffffff").optional(),
  chart: z.object({
    data: z.any()
  }),
  insights: z.array(z.string()).default([])
});

export const defaultVideoProps: z.infer<typeof CompositionProps> = {
  title: {
    text: "Remotion",
  },
  chart: {
    data: [{ key: 'DLP', data: 13 },
    { key: 'SIEM', data: 2 },
    { key: 'Endpoint', data: 7 }]
  },
  insights: []
};

export const DURATION_IN_FRAMES = 300;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
