import { ImageType } from "../models/images";
import { getImagesFromPublic } from "./getImagesFromPublic";
import { v4 as uuidv4 } from "uuid";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";

async function initializeDbWithImagesFromPublic(db: JsonDB) {
  const imagesFromPublicFolder = await getImagesFromPublic();

  try {
    // Adding existing items in public folder that not exists in DB
    const images: ImageType[] = db.getData("/images");
    imagesFromPublicFolder.forEach((name) => {
      if (!images.some((image) => image.name === name)) {
        console.log("pushing", name);
        db.push("/images[]", { enabled: true, name, id: uuidv4() }, true);
      }
    });
  } catch (error) {
    imagesFromPublicFolder.forEach((name) => {
      db.push("/images[]", { enabled: true, name, id: uuidv4() }, true);
    });
  }

  // // Remove existing items in DB that not exists in public folder
  const images: ImageType[] = db.getData("/images");
  images.forEach((image, i) => {
    if (!imagesFromPublicFolder.includes(image.name)) {
      console.log("deleting", image, "at index", i);
      db.delete(`/images[${i}]`);
    }
  });
}

class DB {
  // @ts-ignore
  db: JsonDB;

  constructor() {
    this.getDb.bind(this);
    this.init.bind(this);

    this.init().then(() => null);
  }

  getDb() {
    return this.db;
  }

  async init() {
    if (this.db) {
      return;
    }

    const db = new JsonDB(new Config("db", true, false, "/"));
    await initializeDbWithImagesFromPublic(db);
    this.db = db;
  }
}

export default new DB();
