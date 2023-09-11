import { RaffleSession, RaffleToken } from "@/types";
import NextAuth, { AuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      authorization: {
        params: {
          scope: "email,public_profile,groups_access_member_info",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        (token as RaffleToken).accessToken = account.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      (session as RaffleSession).accessToken = (
        token as RaffleToken
      ).accessToken;
      return session;
    },
  },
};

export default NextAuth(authOptions);
