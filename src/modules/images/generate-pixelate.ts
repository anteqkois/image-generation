import "dotenv/config";
import Jimp from "jimp";
import path from "path";
import { isExecutedFile } from "../helpers/get-executed-file-info";
import { saveArtifacts } from "./save-artifacts";

export const generatePixels = async ({ imageFilePath }: { artistName?: string; imageFilePath: string }) => {
  const image = await Jimp.read(imageFilePath);

  image.pixelate(20);

  const imageBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
  return { imageBuffer };
};

const main = async () => {
  // const imageName = "sad";
  // const imageFilePath = path.join(__dirname, `../../images/originals/${imageName}.png`);
  const imageName = "austin";
  const imageFilePath = path.join(__dirname, `../../images/originals/${imageName}.png`);

  const { imageBuffer } = await generatePixels({ imageFilePath });

  await saveArtifacts({
    mainName: imageName,
    image: imageBuffer,
  });

  process.exit(0);
};

isExecutedFile() &&
  main()
    .then()
    .catch((err) => console.log(err));
