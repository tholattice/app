import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// Custom WeChat OAuth provider
const WeChatProvider = {
  id: "wechat",
  name: "WeChat",
  type: "oauth" as const,
  authorization: {
    url: "https://open.weixin.qq.com/connect/qrconnect",
    params: {
      scope: "snsapi_login",
      response_type: "code",
    },
  },
  token: "https://api.weixin.qq.com/sns/oauth2/access_token",
  userinfo: "https://api.weixin.qq.com/sns/userinfo",
  profile(profile: any) {
    return {
      id: profile.openid,
      name: profile.nickname,
      email: null, // WeChat doesn't provide email
      image: profile.headimgurl,
    };
  },
  clientId: process.env.WECHAT_CLIENT_ID!,
  clientSecret: process.env.WECHAT_CLIENT_SECRET!,
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: false,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          response_type: "code"
        }
      }
    }),
    WeChatProvider as any,
  ],
  callbacks: {
    async session({ session, token }) {
      // For JWT sessions, get user id from token
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user, account, trigger }) {
      // On sign in, add user id to token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});