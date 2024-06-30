export const retriveFileInfo = (filePath: string): { filename: string, extension: string } => {
	// Use a regular expression to extract the filename and extension
	const regex = /([^/\\]+)\.([^.]+)$/;
	const match = filePath.match(regex);
	
	if (!match) {
			throw new Error("Invalid file path");
	}
	
	const filename = match[1];
	const extension = match[2];
	
	return { filename, extension };
}