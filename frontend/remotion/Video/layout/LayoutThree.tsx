import { z } from "zod";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CompositionProps } from "../../../types/constants";
import React from "react";
import { TextFade } from "../text/TextFade";
import { TextSlide } from "../text/TextSlide";
import { Chart } from "../chart/Chart";
import { TextLetter } from "../text/TextLetter";
import { fonts } from "../utils/fonts";


export const LayoutThree = ({
  title,
  backgroundColor,
  chart,
  insights,
}: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TextComponent = title.animation === "fade" ? TextFade : TextSlide;
  const fontFamily = fonts[title.font as keyof typeof fonts] || fonts.Inter;

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
      {/* Title at the top */}
      <div className="pt-8">
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
      </div>

      {/* Chart in the middle */}
      <AbsoluteFill style={{ top: '20%' }}>
        <div className="flex justify-center items-center">
          <div className="w-1/3">
            <Chart 
              data={chart.data} 
              color={chart.color} 
              backgroundColor={chart.backgroundColor}
              chartType={chart.chartType}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Insights at the bottom */}
      <TextLetter 
        insights={insights} 
        color={title.color}
        font={fontFamily}
        style={{ top: '60%', width: '100%' }}
      />
      <AbsoluteFill>
        <Audio src={staticFile("audio/sunset.mp3")} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};