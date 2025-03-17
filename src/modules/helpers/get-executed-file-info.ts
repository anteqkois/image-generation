export const getExecutedFileInfo = () => {
  // Get the main module (the file that was called first)
  const mainModule = require.main;

  // Check if the script is run directly
  if (mainModule) {
    console.log(`Directly executed file: ${mainModule.filename}`);
  }

  // Get the file path using process.argv
  const executedFilePath = process.argv[1];
  console.log(`Executed file path: ${executedFilePath}`);

  // Extract filename and extension
  const path = require("path");
  const filename = path.basename(executedFilePath);
  const extension = path.extname(executedFilePath);

  console.log(`Filename: ${filename}`);
  console.log(`Extension: ${extension}`);
	console.log(__filename);
};

export const isExecutedFile = ()=>{
	const mainModule = require.main;
	return process.argv[1] === mainModule?.filename
} 
