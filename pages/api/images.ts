// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

function getFiles(): Promise<string[]> {
  const fs = require("fs");

  // directory path
  const dir = "./public";

  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err: any, files: string[]) => {
      if (err) {
        reject(err);
      }

      // files object contains all files names
      // log them on console
      resolve(files);
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
