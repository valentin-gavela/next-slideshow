import { NextApiRequest, NextApiResponse } from "next";
import { update } from "../../services/db.services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    body,
    method,
  } = req;

  switch (method) {
    // case "GET":
    //   // Get data from your database
    //   res.status(200).json({ id, name: `User ${id}` });
    //   break;
    case "PUT":
      // Update or create data in your database
      const result = await update(id as string, body);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json("not found");
      }
      break;
    // case "DELETE":
    // await deleteItems(id as string);

    // res.status(200).json({ ok: "ok" });
    // default:
    //   res.setHeader("Allow", ["GET", "PUT"]);
    //   res.status(405).end(`Method ${method} Not Allowed`);
  }
}
