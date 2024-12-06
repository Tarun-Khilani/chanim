import { z } from "zod";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CompositionProps } from "../../../types/constants";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React from "react";
import { TextFade } from "../text/TextFade";
import { TextSlide } from "../text/TextSlide";
import { Chart } from "../chart/Chart";
import { TextLetter } from "../text/TextLetter";

loadFont();

export const LayoutTwo = ({
  title,
  backgroundColor,
  chart,
  insights,
}: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TextComponent = title.animation === "fade" ? TextFade : TextSlide;

  const getSlideDirection = () => {
    switch (title.animation) {
      case "slide-left":
        return "right";
      case "slide-right":
        return "left";
      case "slide-up":
        return "down";
      case "slide-down":
        return "up";
      default:
        return "left";
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <TextComponent
        direction={title.animation !== "fade" ? getSlideDirection() : "left"}
      >
        <h1
          className="text-[70px] font-bold"
          style={{
            fontFamily,
            color: title.color,
          }}
        >
          {title.text}
        </h1>
      </TextComponent>

      {/* Left side - Insights */}
      <TextLetter 
        insights={insights} 
        color={title.color}
        font={fontFamily}
        style={{ left: '0%', top: '30%', width: '50%' }}
      />

      {/* Right side - Chart */}
      <AbsoluteFill style={{ left: '50%', top: '30%', width: '50%' }}>
        <div className="flex justify-center items-start px-12">
          <div className="w-full">
            <Chart 
              data={chart.data} 
              color={chart.color} 
              backgroundColor={chart.backgroundColor}
              chartType={chart.chartType}
            />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill>
        <Audio src={staticFile("audio/sunset.mp3")} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};