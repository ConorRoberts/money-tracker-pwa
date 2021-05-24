import dbConnect from '@utils/dbConnect';
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Client from "@models/Client";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ],

  callbacks: {
    session: async (session, user) => {
      return { session, user }
    },
  },

  events: {
    async signIn({ user,isNewUser }) {
      await dbConnect();
      if (isNewUser) {
        // Create new client document for this user
        const newClient = new Client({
          auth: user.id,
        });
        await newClient.save();
      }
    },
  },

  // pages: {
  //   signIn: "/login",
  // },

  database: process.env.DATABASE_URL,
})