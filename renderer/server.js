import express from 'express';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'path';
import { enableTailwind } from "@remotion/tailwind";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize bundle once when server starts
const bundleLocation = await bundle({
  entryPoint: path.resolve(__dirname, '../frontend/remotion/index.ts'),
  webpackOverride: (config) => {
    return enableTailwind(config);
  },
});

app.post('/render', async (req, res) => {
  try {
    const inputProps = req.body;
    const compositionId = 'Video';
    const outputFileName = `video_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, 'out', outputFileName);

    // Select composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps,
    });

    // Render video
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps,
    });

    // Send file as download
    res.download(outputPath, outputFileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Optionally delete the file after sending
      // fs.unlinkSync(outputPath);
    });

  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
