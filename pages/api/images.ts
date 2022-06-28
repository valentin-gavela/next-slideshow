import type { NextApiRequest, NextApiResponse } from "next";
import { ImageType } from "../../models/images";
import DB from "../../services/Db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageType[]>
) {
  await DB.init();
  const db = DB.getDb();

  res.status(200).json(db.getData("/images"));
}
