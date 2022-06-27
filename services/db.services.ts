import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { ImageType } from "../models/images";
import DB from "./Db";

function create() {}

function getAll() {}

export async function update(id: string, updatedImage: Partial<ImageType>) {
  await DB.init();
  const Db = DB.getDb();

  const index = Db.data?.images.findIndex((item) => item.id === id);
  const image = Db.data?.images[index!];

  if (image) {
    Db.data!.images[index!] = { ...image, ...updatedImage };
    await Db.write();
    return Db.data!.images[index!];
  }

  return null;
}
