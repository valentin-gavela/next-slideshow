import glob from "glob";

export function getImagesFromPublic() {
  const path = "./public/**"

  return new Promise<string[]>((resolve, reject) => {
    glob(path, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const filesToSend = files
          .filter(
            (file) =>
              file.includes(".jpg") ||
              file.includes(".jpeg") ||
              file.includes(".png")
          )
          .map((file) => file.replace('./public/', ""));
        resolve(filesToSend);
      }
    });
  });
}
