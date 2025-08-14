import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

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

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  debug: false, // Set to true only when debugging auth issues
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    WeChatProvider,
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: {
      name: `${process.env.VERCEL_DEPLOYMENT === "1" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.VERCEL_DEPLOYMENT === "1",
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Temporarily disable database operations
      // if (account?.provider === "google" && profile?.email) {
      //   // Check if user already exists
      //   const existingUser = await prisma.user.findUnique({
      //     where: { email: profile.email }
      //   });

      //   if (existingUser) {
      //     // Update user info from Google profile
      //     await prisma.user.update({
      //       where: { email: profile.email },
      //       data: {
      //         name: profile.name || existingUser.name,
      //         image: profile.picture || existingUser.image,
      //       }
      //     });
      //   }
      // }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as any;
      }
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      // Always redirect to dashboard after successful authentication
      return `${baseUrl}/dashboard`;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});