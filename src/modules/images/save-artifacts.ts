import dayjs from "dayjs";
import "dotenv/config";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const saveArtifacts = async ({
  mainName,
  description,
  image,
  imageFormat = "png",
}: {
  mainName: string;
  description?: string | null;
  image?: string;
  imageFormat?: "png";
}) => {
  const outputDirectory = `${mainName}_${dayjs().format("YYYY-MM-DD_HH:mm:ss")}`;
  const outputDirectoryPath = path.join(__dirname, `../../images/artifacts/${outputDirectory}`);
	console.log(existsSync(outputDirectoryPath), outputDirectoryPath);
  if (!existsSync(outputDirectoryPath)) await mkdir(outputDirectoryPath, { recursive: true });

  if (description) {
    const filePath = path.join(outputDirectoryPath, `description.md`);
    await writeFile(filePath, description);
    console.log(`#saveArtifacts save ${filePath}`);
  }

  if (image) {
    const filePath = path.join(outputDirectoryPath, `generated_image.${imageFormat}`);
    await writeFile(filePath, Buffer.from(image, "base64"));
    console.log(`#saveArtifacts save ${filePath}`);
  }

  process.exit(0);
};