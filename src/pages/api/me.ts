import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { RaffleSession } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as RaffleSession;

  if (!session) {
    return res
      .status(401)
      .json({ error: "Invalid session or no groupUrl passed", session });
  }

  const { accessToken } = session;

  const fbRes = await (
    await fetch(
      `https://graph.facebook.com/v17.0/me/groups?fields=id,name,administrator,cover,icon,link&access_token=${accessToken}`
    )
  ).json();

  return res.json({ ...fbRes });
};

export default handler;
