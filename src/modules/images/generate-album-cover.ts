import path from "path";
import { retriveFileInfo } from "../helpers/retrive-file-info";
import { generateDescription } from "./generate-description";
import { generateMusicImage } from "./generate-music-image";
import { saveArtifacts } from "./save-artifacts";

export const generateAlbumCover = async ({
  artistName,
  imageFilePath,
}: {
  artistName?: string;
  imageFilePath: string;
}) => {
  const { extension, filename } = retriveFileInfo(imageFilePath);

  const { imageDescription } = await generateDescription({
    artistName,
    imageFilePath: imageFilePath,
  });
	console.log(`#generateAlbumCover generate description`);

  if (!imageDescription) throw new Error(`Can not generate image description`);

  const { bufferBase64 } = await generateMusicImage({
    artistName,
    imageDescription,
  });
	console.log(`#generateAlbumCover generate image`);

  const { outputDirectoryPath } = await saveArtifacts({
    mainName: filename,
    description: imageDescription,
    image: bufferBase64,
  });

  return {
    outputDirectoryPath,
  };
};

const main = async () => {
  // const imageName = "sad";
  // const artistName = "XXXTENTACION";
  // const imageFilePath = path.join(__dirname, `../../images/originals/${imageName}.png`);
	
  // const imageName = "look_at_me";
  // const artistName = "XXXTENTACION";
  // const imageFilePath = path.join(__dirname, `../../images/originals/${imageName}.jpg`);
	
  const imageName = "austin";
  const artistName = "Post Malone";
  const imageFilePath = path.join(__dirname, `../../images/originals/${imageName}.png`);

  const { outputDirectoryPath } = await generateAlbumCover({
    imageFilePath,
    artistName,
  });
  console.log(`outputDirectoryPath=${outputDirectoryPath}`);

  process.exit(0);
};

main()
  .then()
  .catch((err) => console.log(err));
