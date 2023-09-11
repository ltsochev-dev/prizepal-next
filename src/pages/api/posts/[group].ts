import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { RaffleSession } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as RaffleSession;

  if (!session) {
    return res.status(401).json({ error: "Invalid session", session });
  }

  const { group: groupId } = req.query;
  const { accessToken } = session;

  const fbRes = await (
    await fetch(
      `https://graph.facebook.com/v17.0/${groupId}/feed?fields=id,comments{id,user_likes,message,from},reactions,from,message&access_token=${accessToken}`
    )
  ).json();

  if (fbRes.error) {
    return res.status(403).json(fbRes);
  }

  return res.json(fbRes.data);
}
