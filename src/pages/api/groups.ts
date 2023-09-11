import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { RaffleSession } from "@/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as RaffleSession;
  const secret = process.env.FACEBOOK_SECRET;
  const token = getToken({ req, secret });
  const { groupUrl } = req.body;

  if (!session || !groupUrl) {
    return res
      .status(401)
      .json({ error: "Invalid session or no groupUrl passed", session, token });
  }

  const group_id_pattern = /\/groups\/(\d+)\//;
  const feed_id_pattern = /\/permalink\/(\d+)\//;

  const groupId = (groupUrl as string).match(group_id_pattern)?.at(1) ?? null;
  const feedId = (groupUrl as string).match(feed_id_pattern)?.at(1) ?? null;

  if (!groupId || !feedId) {
    return res
      .status(403)
      .json({ error: "unable to extract post id from url", groupId, feedId });
  }

  const { accessToken } = session;

  const fbRes = await (
    await fetch(`
  https://graph.facebook.com/v17.0/${groupId}/feed?fields=id%2Ccomments%7Bid%7D%2Cactions&access_token=${accessToken}`)
  ).json();

  return res.json({ message: "haha", session, token, groupId, feedId, fbRes });
};

export default handler;
