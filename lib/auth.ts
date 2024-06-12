import prisma from "@/lib/prisma";
// import bcrypt from "bcrypt"

import { getServerSession, type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import LoginLink from "@/emails/login-link";
import { sendEmail } from "@/emails";
// Implement email provider later

// import CredentialsProvider from "next-auth/providers/credentials";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    // CredentialsProvider({
    //     name: "credentials",
    //     credentials: {
    //         username: {label: "Username", type: "text", placeholder: "jsmith"},
    //         password: { label: "Password", type: "password"}
    //     },
    //     async authorize(credentials) {

    //     }
    // }),
    EmailProvider({
      sendVerificationRequest({identifier, url}) {
        // if (process.env.NODE_ENV === 'development') {
        //   console.log(`Login link: ${url}`);
        //   return;
        // } else {
          sendEmail({
            email: identifier,
            subject: "Your Tholattice Login Link",
            react: LoginLink({url, email: identifier}),
          })
        // }
      }
    })
  ],
  pages: {
    // signIn: `/login`,
    // verifyRequest: `/login`,
    error: "/login", // Error code passed in query string as ?error=
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        domain: VERCEL_DEPLOYMENT
          ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
          : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    signIn: async ({user, account, profile}) => {
      // console.log({user, account, profile});
      // if (!user.email || (await isBlacklistedEmail(user.email))) {
      //   return false;
      // }
      if (!user.email) {
        return false;
      } 
    // console.log('yes, indeed')
    return true
    },
    jwt: async ({ token, user, session }) => {
      // console.log(`This is the token, ${JSON.stringify(token)}`)
      console.log("jwt callback", {token, user, session})
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      console.log("session callback", {token, session, user})

      session.user = {
        ...session.user,
        // @ts-expect-error
        id: token.sub,
        // @ts-expect-error
        username: token?.user?.username || token?.user?.gh_username,
      };

      console.log("new session callback", {token, session, user})

      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions) as Promise<{
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      image: string;
    };
  } | null>;
}

export function withSiteAuth(action: any) {
  return async (
    formData: FormData | null,
    siteId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session) {
      return {
        error: "Not authenticated",
      };
    }
    const site = await prisma.site.findUnique({
      where: {
        id: siteId,
      },
    });
    if (!site || site.userId !== session.user.id) {
      return {
        error: "Not authorized",
      };
    }

    return action(formData, site, key);
  };
}

export function withPostAuth(action: any) {
  return async (
    formData: FormData | null,
    postId: string,
    key: string | null,
  ) => {
    const session = await getSession();
    if (!session?.user.id) {
      return {
        error: "Not authenticated",
      };
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        site: true,
      },
    });
    if (!post || post.userId !== session.user.id) {
      return {
        error: "Post not found",
      };
    }

    return action(formData, post, key);
  };
}