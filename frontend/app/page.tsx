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
import { LayoutComponentMap } from "../remotion/Video/utils/mappings";
import StyleOptions from "./components/StyleOptions";
import { ChartType, LayoutType } from "../remotion/Video/utils/mappings";

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultVideoProps.title.text);
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
          text: text,
          animation: "slide-up",
          color: styles.titleColor,
          font: styles.titleFont,
        },
        backgroundColor: styles.backgroundColor,
        chart: {
          data: [
            { key: "A", data: 10 },
            { key: "B", data: 25 },
            { key: "C", data: 15 },
          ],
          color: styles.chartColor,
          backgroundColor: styles.chartBackground,
          chartType: ChartType.BAR,
        },
        asset: "rocket.svg",
        arrangement: LayoutType.TOP_TITLE_BOTTOM_CONTENT,
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
        animation: apiResponse.title_animation, 
        color: styles.titleColor,
        font: styles.titleFont,
      },
      backgroundColor: styles.backgroundColor,
      chart: {
        data: apiResponse.data,
        color: styles.chartColor,
        backgroundColor: styles.chartBackground,
        chartType: apiResponse.chart_type,
      },
      asset: apiResponse.asset,
      arrangement: apiResponse.arrangement,
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
              component={LayoutComponentMap[inputProps.arrangement]}
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
