import { Composition } from "remotion";
import {
  COMP_NAME,
  defaultVideoProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { Sequence } from "./Video/sequence/Sequence";

export const RemotionRoot: React.FC = () => {
  const sequences = [{
    ...defaultVideoProps
  }];

  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Sequence}
        durationInFrames={sequences.length * DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={{
          sequences
        }}
      />
    </>
  );
};
