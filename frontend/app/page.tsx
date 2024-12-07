"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState, useEffect } from "react";
import {
  defaultVideoProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import InfographicsGenerator from "./components/InfographicsGenerator";
import { Sequence } from "../remotion/Video/sequence/Sequence";
import StyleOptions from "./components/StyleOptions";
import StoryModeToggle from "./components/StoryModeToggle";
import { ChartType, LayoutType } from "../remotion/Video/utils/mappings";

const Home: NextPage = () => {
  const [text] = useState<string>(defaultVideoProps.title.text);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [styles, setStyles] = useState({
    titleColor: "#E5E7EB",
    titleFont: "Inter",
    backgroundColor: "#111827",
    chartColor: "#10B981",
    chartBackground: "#1F2937",
  });

  const sequences = useMemo(() => {
    if (!apiResponse) {
      return [{
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
          chartType: ChartType.LINE,
        },
        asset: "rocket.svg",
        arrangement: LayoutType.TITLE_CENTER,
        insights: [
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        ],
      }];
    }

    // API response will always return an array of sequences
    return apiResponse.map((sequence: any) => ({
      title: { 
        text: sequence.title, 
        animation: sequence.title_animation, 
        color: styles.titleColor,
        font: styles.titleFont,
      },
      backgroundColor: styles.backgroundColor,
      chart: {
        data: sequence.data,
        color: styles.chartColor,
        backgroundColor: styles.chartBackground,
        chartType: sequence.chart_type,
      },
      asset: sequence.asset,
      arrangement: sequence.arrangement,
      insights: sequence.insights,
    }));
  }, [text, styles, apiResponse]);

  // Reset API response when toggling story mode to prevent stale data
  useEffect(() => {
    setApiResponse(null);
  }, [isStoryMode]);

  const handleStyleChange = (newStyles: typeof styles) => {
    setStyles(newStyles);
  };

  return (
    <div className="fixed inset-0 flex bg-[#0F1218]">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
          <div className="h-full overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)]">
            <Player
              component={Sequence}
              inputProps={{ sequences }}
              durationInFrames={sequences.length * DURATION_IN_FRAMES}
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
          <InfographicsGenerator 
            onApiResponse={setApiResponse} 
            inputProps={{ sequences }}
            isStoryMode={isStoryMode}
          />
        </div>
      </div>
      <div className="flex flex-col flex-none">
        <StoryModeToggle onChange={setIsStoryMode} />
        <StyleOptions onStyleChange={handleStyleChange} />
      </div>
    </div>
  );
};

export default Home;
