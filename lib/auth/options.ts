import prisma from '@/lib/prisma'
// import { isBlacklistedEmail } from "@/lib/edge-config";
// TODO: You'll need to implemented a blacklisted email configuration, for safety requirements.

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { sendEmail } from "@/emails";
import WelcomeEmail from '@/emails/welcome-email';
import LoginLink from "@/emails/login-link";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const authOptions: NextAuthOptions = {
    providers: [
        EmailProvider({
            sendVerificationRequest({ identifier, url }) {
              if (process.env.NODE_ENV === "development") {
                console.log(`Login link: ${url}`);
                return;
              } else {
                sendEmail({
                  email: identifier,
                  subject: "Your Tholattice Login Link",
                  react: LoginLink({ url, email: identifier }),
                });
              }
            },
          }),
        //   In Steven's code, he has a custom SSO SAML Provider with BoxyHQ. Why does he have this?
    ],
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    cookies: {
      sessionToken: {
        name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
          domain: VERCEL_DEPLOYMENT ? ".tholattice.com" : undefined,
          secure: VERCEL_DEPLOYMENT,
        },
      },
    },
    pages: {
        error: "/login",
    },
    callbacks: {
        signIn: async ({user, account, profile}) => {
            console.log({user, account, profile});
            if (!user.email) {
                // TODO: this had an async call to isBlacklistedEmail. Make sure to refer to Steven's code to implement tbis.
                return false;
        }
          return true;
    },
    jwt: async ({token, account, user, trigger}) => {
        // force log out banned users
        if (!token.email) {
            // TODO: this also had isBlacklistedEmail
            return {}
        }

        if (user) {
            token.user = user;
        }

        // refresh the user's data if they update their name/email
        if (trigger === "update") {
            const refreshedUser = await prisma.user.findUnique({
                where: {id: token.sub},
            });
            if (refreshedUser) {
                token.user = refreshedUser;
            } else {
                return {}
            }
        }

        return token
    },
    session: async ({session, token}) => {
        session.user = {
            id: token.sub,
            // @ts-ignore
            ...(token || session).user,
        };
        return session
    },
},
events: {
    async signIn(message) {
        if (message.isNewUser) {
            const email = message.user.email as string;
            const user = await prisma.user.findUnique({
                where: {email},
                select: {
                    name: true,
                    createdAt: true
                },
            });
            // only send the welcome email is the user was created in the last 10s
            // (this is a workaround because the 'isNewUser' flag is triggered when a user does 'dangerousEmailAccountLinking')
            if (user?.createdAt && new Date(user.createdAt).getTime() > Date.now() - 1000) {
                sendEmail({
                    subject: "Welcome to Tholattice!",
                    email,
                    react: WelcomeEmail({
                        email,
                        name: user.name || null,
                    }),
                    marketing: true
                })
            }
        }
    }
}
}