// import { dirname, join } from "path";
// import { fileURLToPath } from "url";
import { Data } from "../models/images";
import { getImagesFromPublic } from "./getImagesFromPublic";
import { v4 as uuidv4 } from "uuid";
import { Low, JSONFile } from "lowdb";

// const __dirname = dirname(fileURLToPath(import.meta.url));

async function initializeDbWithImagesFromPublic(db: Low<Data>) {
  db.data ||= { images: [] };

  const images = await getImagesFromPublic();
  console.log(images);

  images.forEach((name) => {
    const imgExists = db.data?.images.find((img) => img.name === name);

    if (!imgExists) {
      db.data?.images.push({ enabled: true, name, id: uuidv4() });
    }
  });

  await db.write();
}

class DB {
  // @ts-ignore
  db: Low<Data>;

  constructor() {
    this.getDb.bind(this);
    this.init.bind(this);

    this.init().then(() => console.log("DB loaded"));
  }

  getDb() {
    return this.db;
  }

  async init() {
    if (this.db) {
      return;
    }

    const adapter = new JSONFile<Data>("./services/db.json");
    const db = new Low(adapter);
    await db.read();

    if (!db.data?.images || db.data!.images.length === 0) {
      await initializeDbWithImagesFromPublic(db);
    }

    this.db = db;
  }
}

export default new DB();
