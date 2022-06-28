import { useDebugValue } from "react";
import { ImageType } from "../models/images";
import DB from "./Db";

function create() {}

function getAll() {}

export async function update(id: string, updatedImage: Partial<ImageType>) {
  await DB.init();
  const db = DB.getDb();

  try {
    const images = db.getData("/images") as ImageType[];
    const index = images.findIndex((item) => item.id === id);
    const image = images[index];

    console.log("getting image", image, "index", index);

    if (image) {
      console.log("updating image", image, "index", index);

      db.push(`/images[${index}]`, { ...image, ...updatedImage }, true);

      return db.getData(`/images[${index}]`);
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}
