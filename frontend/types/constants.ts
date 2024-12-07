import { z } from "zod";
import { ChartType } from "../remotion/Video/utils/mappings";

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
    data: z.array(z.object({
      key: z.string(),
      data: z.number()
    })),
    colors: z.array(z.string()),
    backgroundColor: z.string(),
    chartType: z.nativeEnum(ChartType).nullable(),
  }),
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
  chart: {
    data: [
      { key: "2023", data: 100 },
      { key: "2024", data: 120 },
    ],
    colors: ["#10B981", "#72bc4e", "#b8b712", "#ff9800"],
    backgroundColor: "#111827",
    chartType: ChartType.LINE,
  },
  asset: "car.svg",
  arrangement: "LEFT_CHART_RIGHT_TEXT",
  insights: [
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
  ],
};

export const DURATION_IN_FRAMES = 210;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
