import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface FBQLResponse<T> {
  data: T;
  paging: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

export interface FacebookGroup {
  id: string;
  name: string;
  icon: string;
  administrator: boolean;
}

export interface FromUser {
  id: string;
  name: string;
}

export interface FacebookPostComment {
  id: string;
  user_likes: boolean;
  message: string;
  from: FromUser;
}

export interface FacebookPostReaction {
  id: string;
  name: string;
  type: "LIKE";
}

export interface FacebookGroupPost {
  id: string;
  message: string;
  from: FromUser;
  comments: FBQLResponse<FacebookPostComment[]>;
  reactions: FBQLResponse<FacebookPostReaction[]>;
}

export interface RaffleSession extends Session {
  accessToken?: string;
}

export interface RaffleToken extends JWT {
  accessToken?: string;
}
