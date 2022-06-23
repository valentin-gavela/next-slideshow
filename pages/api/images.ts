// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import glob from "glob";

function getFiles() {
  const root_folder = "public";

  return new Promise<string[]>((resolve, reject) => {
    glob(root_folder + "/**", (err, files) => {
      if (err) {
        reject(err);
      } else {
        const filesToSend = files.map((file) => file.replace("public/", ""));
        console.log(filesToSend);
        resolve(filesToSend);
      }
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const images = await getFiles();
  res.status(200).json(images);
}
