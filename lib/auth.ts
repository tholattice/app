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
    async session({ session, user }) {
      if (session.user && user?.id) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});