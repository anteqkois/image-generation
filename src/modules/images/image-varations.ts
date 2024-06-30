import "dotenv/config";
import { createReadStream } from "fs";
import { readFile, writeFile } from "fs/promises";
import OpenAI from "openai";
import path from "path";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
  const fileName = "darci";
  const inputFilePath = path.join(__dirname, `../../images/${fileName}.png`);
  const outputFileName = `${fileName}_${new Date().toISOString()}`;
  const outputFilePath = path.join(__dirname, `../../images/${outputFileName}.png`);

  const bufferOriginalImage: Buffer = await readFile(inputFilePath);

  await sharp(bufferOriginalImage).resize({ height: 1024, width: 1024 }).toFile(outputFilePath);

  const response = await openai.images.createVariation({
    image: createReadStream(outputFilePath),
    n: 1,
    model: "dall-e-2",
    response_format: "b64_json",
    size: "1024x1024",
  });

  await writeFile(
    path.join(__dirname, `../../images/generated/${fileName}_${new Date().toISOString()}.png`),
    Buffer.from(response.data[0].b64_json!, "base64")
  );

  process.exit(0);
};

main()
  .then()
  .catch((err) => console.log(err));
