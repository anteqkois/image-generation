import "dotenv/config";
import { readFile } from "fs/promises";
import OpenAI from "openai";
import path from "path";
import { isExecutedFile } from "../helpers/get-executed-file-info";
import { retriveFileInfo } from "../helpers/retrive-file-info";
import { saveArtifacts } from "./save-artifacts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const descriptionPromptWithArtist = ({ artistName }: { artistName: string }) =>
  `Create a detailed description of a music album cover of \`${artistName}\` album/track. Describe the \`visual elements\`, colors\`, and \`overall design\`. Mention any \`specific themes\`, \`symbols\`, or \`artistic styles used\`. Provide enough detail so that the description can be used to recreate a similar album cover. Don't include any parental advisory elements. Answer in an easy-to-understand format for the image AI model`;
const descriptionPrompt = () =>
  `Create a detailed description of a music album cover of album/track. Describe the \`visual elements\`, vcolors\`, and \`overall design\`. Mention any \`specific themes\`, \`symbols\`, or \`artistic styles used\`. Provide enough detail so that the description can be used to recreate a similar album cover. Don't include any parental advisory elements. Answer in an easy-to-understand format for the image AI model`;

export const generateDescription = async ({
  artistName,
  imageFilePath,
}: {
  artistName?: string;
  imageFilePath: string;
}) => {
  const { extension } = retriveFileInfo(imageFilePath);
  const originalImageBuffer: Buffer = await readFile(imageFilePath);
  const originalImageBase64String = originalImageBuffer.toString("base64");

  const response = await openai.chat.completions.create({
    model: "gpt-4o-2024-05-13",
    max_tokens: 1_000,
    response_format: {
      // type: "json_object",
      type: "text",
    },
    messages: [
      {
        role: "system",
        content:
          "You are trained to create mo mosaic image in clear way. Response with sentences, not structures like lists etc. Don't include any 'Parental Advisory' sign/information",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: artistName ? descriptionPromptWithArtist({ artistName }) : descriptionPrompt(),
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/${extension};base64,${originalImageBase64String}`,
              detail: "auto",
            },
          },
        ],
      },
    ],
  });

  return { imageDescription: response.choices[0].message.content };
};

const main = async () => {
  const imageName = "sad";
  const imageFilePath = path.join(__dirname, `../../images/originals/${imageName}.png`);

  // const { imageDescription } = await generateDescription({
  //   artistName: "XXXTENTACION",
  //   imageFilePath: imageFilePath,
  //   imageFormat: imageFormat,
  // });
  const imageDescription = `The album cover of XXXTENTACION’s track is visually striking and minimalist, yet rich with texture and detail. It predominantly employs a monochromatic color scheme of black and white, which adds to its stark and somber aesthetic.

### Visual Elements:
- **Central Focus:** The focal point of the album cover is a large, bold question mark ("?") located in the middle. This question mark dominates the otherwise clean white background.
- **Embedded Imagery:** Within the question mark, there are various black-and-white images and sketches. These visual elements are somewhat abstract and collage-like, including human faces, possibly self-portraits, and other miscellaneous illustrations. The mixed media approach creates a layered texture within the question mark.
- **Outer Border:** Surrounding the central white space, there is a thick black border. This border is also filled with collage-style black-and-white images. The images in the border appear to be chaotic and random, contributing to the overall theme of confusion and introspection.

### Colors:
- The color palette is strictly black and white, providing high contrast which enhances the dramatic and raw emotion conveyed through the imagery.
- The absence of color focuses the viewer's attention on the details and emotions embedded within the black-and-white images.

### Overall Design:
- **Minimalist Layout:** The design uses a minimalist approach with a large amount of negative space, drawing attention to the detailed collage within the question mark and the border.
- **Handwritten Text:** Above the central question mark is a small line of handwritten text reading "XXX", placed delicately to not distract from the main visual elements. This text adds a personal, intimate touch to the design.
- **Parental Advisory:** At the bottom center of the cover, there is a "Parental Advisory" label, indicating explicit content within the album. This label is a standard addition to many music albums.

### Themes and Symbols:
- **Question Mark:** The prominent use of a question mark suggests themes of uncertainty, curiosity, and introspection. It invites the listener to ponder the deeper meanings and emotions expressed through the music.
- **Collage Imagery:** The eclectic mix of faces and abstract shapes within the question mark and border symbolizes complexity and fragmented thoughts, possibly alluding to the artist’s inner turmoil and the multifaceted nature of his experiences.

### Artistic Styles:
- **Collage:** The use of a collage technique for the imagery within the question mark and border adds depth and a sense of chaos.
- **Monochromatic:** The black-and-white color scheme creates a timeless, classic look and emphasizes contrast and emotion.

In recreating a similar album cover, one would need to focus on maintaining the balance between minimalism and detailed collage work, using the monochromatic color scheme to evoke a strong emotional response while incorporating personal and abstract imagery within the focal symbol and its surrounding areas.`;

  await saveArtifacts({
    mainName: imageName,
    description: imageDescription,
  });
  console.log(imageDescription);

  process.exit(0);
};

isExecutedFile() &&
  main()
    .then()
    .catch((err) => console.log(err));
