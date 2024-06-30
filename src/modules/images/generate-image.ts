import "dotenv/config";
import { writeFile } from "fs/promises";
import OpenAI from "openai";
import path from "path";

// Analyze the given image of an album cover and provide a detailed description. Describe the visual elements, colors, and overall design. Include any text present on the cover, such as the artist's name and album title. Mention any specific themes, symbols, or artistic styles used. Provide enough detail so that the description can be used to recreate a similar album cover.

// Analyze the given image of an album cover and provide a detailed description. Describe the visual elements, colors, and overall design. Mention any specific themes, symbols, or artistic styles used. Provide enough detail so that the description can be used to recreate a similar album cover.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// {
//   "prompt": "Create an album cover for the artist XXXTENTACION. The cover should reflect the rap genre and include elements that represent the artist's style and persona. Incorporate [specific elements, colors, or symbols] that are associated with the artist. The overall design should be [mood or atmosphere, e.g., vibrant, dark, nostalgic]. Include the album title '[Album Title]' prominently. Ensure that the design is eye-catching and visually appealing to fans of [Artist Name].",
//   "size": "1024x1024"
// }
// {
//   "prompt": "Create an album cover for the artist XXXTENTACION. The cover should reflect the rap genre and include elements that represent the artist's style and persona. Incorporate specific elements, colors, or symbols that are associated with the artist. Include the album title '?' prominently. Ensure that the design is eye-catching and visually appealing to fans of XXXTENTACION.",
//   "size": "1024x1024"
// }

// const imageDescription = `White background featuring a large, central question mark ("?") filled with a collage of black-and-white images. Add a thick black border around the edges, also filled with black-and-white collage images. Place small text above the question mark reading "?" in quotation marks. Include a parental advisory label at the bottom in black and white. The overall color scheme should be black and white, with a minimalist but detailed artistic style.`

// const imageDescription = `white background featuring a large, central question mark ("?") filled with a collage of black-and-white images. The images inside the question mark should be detailed and varied, depicting different scenes, people, and possibly candid shots or concert footage. Surround the white background with a thick black border, also filled with a series of black-and-white collage images. Above the question mark, include small text that reads "?" in quotation marks. The overall design should be minimalist in terms of color, using only black and white, but intricate and detailed in the collage elements.`

// const imageDescription = `white background featuring a large, central question mark ("?") filled with a collage of black-and-white images. The images inside the question mark should be detailed and varied, depicting different scenes, people, and possibly candid shots or concert footage. Surround the white background with a thick black border, also filled with a series of black-and-white collage images. Above the question mark, include small text that reads "?" in quotation marks. The overall design should be minimalist in terms of color, using only black and white, but intricate and detailed in the collage elements.`;

const imageDescription = `White background with a large, central question mark ("?") filled with a collage of black-and-white images. The images inside the question mark should be detailed and varied, depicting different scenes, people, and possibly candid shots or concert footage. The white background should be surrounded by a thick black border, also filled with a series of black-and-white collage images. Above the question mark, include small text that reads "?" in quotation marks. The overall design should be minimalist in terms of color, using only black and white, but intricate and detailed in the collage elements.`;

// Ensure the album title '?' and the main track title "SAD" are clearly visible and stand out on the main stage of the poster

// Create an album poster for the artist XXXTENTACION. The poster should capture the essence of the artist's style and persona by incorporating elements, colors, and symbols associated with him. The poster must prominently feature the album title '?' and the main track title "SAD" in bold font. Follow the original album poster description below:

const main = async () => {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt:
      // "I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\nCreate an album cover for the artist XXXTENTACION. The cover should reflect the rap genre and include elements that represent the artist's style and persona. Incorporate specific elements, colors, or symbols that are associated with the artist. Include the album title '?' prominently. Ensure that the design is eye-catching and visually appealing to fans of XXXTENTACION.",
      // `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\nCreate an album cover for the artist XXXTENTACION. The cover should reflect the rap genre and include elements that represent the artist's style and persona. Incorporate specific elements, colors, or symbols that are associated with the artist. Include the album title '?' prominently. Ensure that the design is eye-catching and visually appealing to fans of XXXTENTACION. There is a original album cover description:\n${imageDescription}\nGenerate ONLY IMAGE, don't add any disc packaging etc.`,
      // `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\nCreate an album poster for the artist XXXTENTACION. The poster should include elements that represent the artist's style and persona. Incorporate specific elements, colors, or symbols that are associated with the artist. Include the album title '?' prominently and main track "SAD". Ensure that the design is eye-catching and visually appealing to fans of XXXTENTACION. There is a original album poster description:\n${imageDescription}\n`,
			
			// // GOOD
      // `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\nCreate an album poster for the artist XXXTENTACION. The poster should capture the essence of the artist's style and persona by incorporating elements, colors, and symbols associated with him. The poster must prominently feature the album title '?' and the main track title "SAD" in bold font. Don't include any Parental Advisory sign. Follow the original album poster description below:\n${imageDescription}\n`,

			// GOOD
      `I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:\nCreate an album poster for the artist XXXTENTACION. The poster should capture the essence of the artist's style and persona by incorporating elements, colors, and symbols associated with him. At the top of the poster, place the album title '?' in bold, eye-catching font and below album title, also place track title 'SAD' inm the same style. Don't include any Parental Advisory sign. Follow the original album poster description below:\n${imageDescription}\n`,
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

  process.exit(0);
};

main()
  .then()
  .catch((err) => console.log(err));