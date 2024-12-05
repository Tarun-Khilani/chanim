import { z } from "zod";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CompositionProps } from "../../../types/constants";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import React from "react";
import { TextFade } from "../text/TextFade";
import { TextSlide } from "../text/TextSlide";
import { Chart } from "../chart/Chart";
import { TextLetter } from "../text/TextLetter";

loadFont();

export const LayoutOne = ({
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

      {/* Chart Section */}
      <AbsoluteFill style={{ top: '30%' }}>
        <div className="flex justify-between items-start px-12">
          {/* Left side - Chart */}
          <div className="w-1/2">
            <Chart data={chart.data} color={chart.color} backgroundColor={chart.backgroundColor} />
          </div>
        </div>
      </AbsoluteFill>

      {/* Right side - Insights */}
      <TextLetter 
          insights={insights} 
          color={title.color}
          font={fontFamily}
        />
    </AbsoluteFill>
  );
};
