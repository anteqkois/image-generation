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

  const bufferOtyginalImage: Buffer = await readFile(inputFilePath);

  await sharp(bufferOtyginalImage).resize({ height: 1024, width: 1024 }).toFile(outputFilePath);

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

// const main = async () => {
//   // This is the Buffer object that contains your image data
//   const bufferImage: Buffer = await readFile(path.join(__dirname, "../../images/XXXTENTACION.jpg"));

//   // Resize the image to reduce file size
//   const compressedImage = await sharp(bufferImage)
//     .resize(1024, 1024, {
//       fit: sharp.fit.inside,
//       withoutEnlargement: true,
//     })
//     .png()
//     .toBuffer();

//   // Check the file size
//   console.log(`Compressed image size: ${(compressedImage.length / 1024).toFixed(2)} KB`);

//   // Cast the buffer to `any` so that we can set the `name` property
//   const file: any = compressedImage;

//   // Set a `name` that ends with .png so that the API knows it's a PNG image
//   file.name = "oryginal.png";

//   const response = await openai.images.createVariation({
//     image: file,
//     n: 1,
//     model: "dall-e-2",
//     response_format: "url",
//     size: "1024x1024",
//   });
//   console.log(response.data);
//   console.dir(response, { depth: null });

//   process.exit(0);
// };

main()
  .then()
  .catch((err) => console.log(err));
