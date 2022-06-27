import glob from "glob";
import { join } from "path";

export function getImagesFromPublic() {
  const path = join(__dirname, "../../../../public");

  return new Promise<string[]>((resolve, reject) => {
    glob(path + "/**", (err, files) => {
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
          .map((file) => file.replace(`${path}/`, ""));
        console.log("files", filesToSend);
        resolve(filesToSend);
      }
    });
  });
}
