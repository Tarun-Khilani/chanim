"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { LayoutOne } from "../remotion/Video/layout/LayoutOne";
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

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultVideoProps.title.text);

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: { text: text, animation: "slide-up", color: "#E5E7EB" },
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
  }, [text]);

  return (
    <div className="fixed inset-0 flex bg-[#0F1218]">
      <div className="flex-1 h-full overflow-hidden p-8 flex flex-col">
        <div className="flex-1 overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)]">
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
        <div className="mt-2">
          <RenderControls
            text={text}
            setText={setText}
            inputProps={inputProps}
          />
        </div>
      </div>
      <div className="w-[400px] border-l border-gray-800 h-full overflow-hidden">
        <InfographicsGenerator />
      </div>
    </div>
  );
};

export default Home;
