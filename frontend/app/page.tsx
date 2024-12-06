"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import {
  CompositionProps,
  defaultVideoProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { z } from "zod";
import { RenderControls } from "../components/RenderControls";
import InfographicsGenerator from "./components/InfographicsGenerator";
import { LayoutOne } from "../remotion/Video/layout/LayoutOne";
import { LayoutTwo } from "../remotion/Video/layout/LayoutTwo";
import { LayoutThree } from "../remotion/Video/layout/LayoutThree";
import { LayoutFour } from "../remotion/Video/layout/LayoutFour";
import StyleOptions from "./components/StyleOptions";

const Home: NextPage = () => {
  const [text, setText] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [styles, setStyles] = useState({
    titleColor: "#E5E7EB",
    titleFont: "Inter",
    backgroundColor: "#111827",
    chartColor: "#10B981",
    chartBackground: "#1F2937",
  });

  const inputProps: z.infer<typeof CompositionProps> | undefined = useMemo(() => {
    if (!apiResponse) {
      return {
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
    }

    return {
      title: { 
        text: apiResponse.title, 
        animation: "slide-up", 
        color: styles.titleColor,
        font: styles.titleFont,
      },
      backgroundColor: styles.backgroundColor,
      chart: {
        data: apiResponse.data.map((item: any) => ({
          key: item.key,
          data: item.value
        })),
        color: styles.chartColor,
        backgroundColor: styles.chartBackground,
      },
      insights: apiResponse.insights,
    };
  }, [text, styles, apiResponse]);

  const handleStyleChange = (newStyles: typeof styles) => {
    setStyles(newStyles);
  };

  return (
    <div className="fixed inset-0 flex bg-[#0F1218]">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
          <div className="h-full overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)]">
            <Player
              component={LayoutOne}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{
                width: "100%",
                height: "100%",
              }}
              controls
              autoPlay
              loop
            />
          </div>
        </div>
        <div className="w-full border-t border-gray-800 p-4">
          <InfographicsGenerator onApiResponse={setApiResponse} />
        </div>
      </div>
      <StyleOptions onStyleChange={handleStyleChange} />
    </div>
  );
};

export default Home;
