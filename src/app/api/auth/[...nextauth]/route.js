import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET_KEY,

  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = (req, res) => {
  return NextAuth(req, res, {
    ...authOptions,

    basePath: "/api/auth",
    trustHost: true, // localhost/test deploy host trusted
    callbacks: {
      async redirect({ url, baseUrl }) {
        return url.startsWith("/")
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${url}`
          : url;
      },
    },
  });
};

export { handler as GET, handler as POST };
