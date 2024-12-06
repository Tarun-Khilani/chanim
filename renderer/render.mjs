import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path';
import { enableTailwind } from "@remotion/tailwind";
 
// The composition you want to render
const compositionId = 'Video';
 
// You only have to create a bundle once, and you may reuse it
// for multiple renders that you can parametrize using input props.
const bundleLocation = await bundle({
  entryPoint: path.resolve('../frontend/remotion/index.ts'),
  // If you have a webpack override in remotion.config.ts, pass it here as well.
  webpackOverride: (config) => {
    return enableTailwind(config);
  },
});
 
// Parametrize the video by passing props to your component.
const inputProps ={
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
      color: "#E5E7EB",
      backgroundColor: "#111827",
      chartType: "line",
    },
    asset: "car.svg",
    arrangement: "LEFT_CHART_RIGHT_TEXT",
    insights: [
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    ],
  };
 
// Get the composition you want to render. Pass `inputProps` if you
// want to customize the duration or other metadata.
const composition = await selectComposition({
  serveUrl: bundleLocation,
  id: compositionId,
  inputProps,
});
 
// Render the video. Pass the same `inputProps` again
// if your video is parametrized with data.
await renderMedia({
  composition,
  serveUrl: bundleLocation,
  codec: 'h264',
  outputLocation: `out/${compositionId}.mp4`,
  inputProps,
});
 
console.log('Render done!');