import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const TextLetter: React.FC<{
  insights: string[];
  color: string;
  font?: string;
  style?: React.CSSProperties;
}> = ({ insights, color, font = "Arial", style = {} }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Keep track of cumulative letter index for animation delay
  let cumulativeLetterIndex = 0;

  return (
    <AbsoluteFill style={style}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          fontFamily: font,
          width: '100%',
          maxWidth: '600px',
        }}
      >
        {insights.map((text, lineIndex) => {
          const words = text.split(" ");
          return (
            <p
              key={lineIndex}
              style={{
                fontSize: "24px",
                marginBottom: "1.5rem",
                lineHeight: 1.4,
                color,
                opacity: 0.9,
              }}
            >
              {words.map((word, wordIndex) => {
                const letters = word.split("");
                return (
                  <React.Fragment key={wordIndex}>
                    {letters.map((letter, letterIndex) => {
                      cumulativeLetterIndex++;
                      const delay = cumulativeLetterIndex * 1.5;
                      const progress = spring({
                        frame: frame - delay,
                        fps,
                        config: {
                          damping: 200,
                        },
                      });

                      const opacity = interpolate(progress, [0, 1], [0, 1]);
                      const translateY = interpolate(
                        progress,
                        [0, 1],
                        [20, 0]
                      );

                      return (
                        <span
                          key={letterIndex}
                          style={{
                            display: "inline-block",
                            opacity,
                            transform: `translateY(${translateY}px)`,
                          }}
                        >
                          {letter}
                        </span>
                      );
                    })}
                    {wordIndex !== words.length - 1 ? " " : ""}
                  </React.Fragment>
                );
              })}
            </p>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
