import "dotenv/config";

import { writeFile } from "fs/promises";
import OpenAI from "openai";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const promptWithArtist = ({
  artistName,
  imageDescription,
}: {
  artistName: string;
  imageDescription: string;
}) =>
  `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\nCreate an album poster for the artist ${artistName}. The poster should capture the essence of the artist's style and persona by incorporating elements, colors, and symbols associated with him. Don't include any \`Parental Advisory\` sign. Follow the original album poster description:\n${imageDescription}\n`;

const promptBase = ({ imageDescription }: { imageDescription: string }) =>
  `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\nCreate an album poster for the artist. The poster should capture the essence of the artist's style and persona by incorporating elements, colors, and symbols associated with him. Don't include any \`Parental Advisory\` sign. Follow the original album poster description:\n${imageDescription}\n`;

export const generateMusicImage = async ({
  artistName,
  imageDescription,
}: {
  artistName?: string;
  imageDescription: string;
}) => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: artistName
      ? promptWithArtist({ artistName, imageDescription })
      : promptBase({ imageDescription }),
    n: 1,
    size: "1024x1024",
    style: "vivid",
    quality: "hd",
    response_format: "b64_json",
  });

  await writeFile(
    path.join(__dirname, `../../images/generated/generated_${new Date().toISOString()}.png`),
    Buffer.from(response.data[0].b64_json!, "base64")
  );

  return {
    bufferBase64: Buffer.from(response.data[0].b64_json!, "base64"),
  };
};