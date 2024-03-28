import { getServerSession } from "next-auth";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from 'next-auth/providers/google'
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from "./actions";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  // jwt:{
  //   encode: ({ token }) => {
  //     const encodedToken = jsonwebtoken.sign({
  //       ...token,
  //       iss: 'http://localhost:3000',
  //       exp: Math.floor(Date.now() / 1000) + 60 *60
  //     }, process.env.NEXTAUTH_SECRET as string)
  //     console.log(token)
  //     return encodedToken
  //   },
  //   decode: async({ token }) => {
  //     const decodedToken = jsonwebtoken.verify(token!, process.env.NEXTAUTH_SECRET as string) as JWT

  //     return decodedToken
  //   }
  // },
  theme: {
    colorScheme: 'light',
    logo: '/logo.png'
  },
  callbacks: {
    async session({session}) {
      const email = session?.user?.email as string
      try {
        const data = await getUser(email)
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data?.rows[0],
            id: data?.rows[0]?.user_id
          }
        }
        return newSession
      } catch (error) {
        console.log('Error retrieving user data', error)
        return session
      }
    },
    async signIn({ user }: {user: AdapterUser | User}) {
      try {
        const userExists = await getUser(user?.email as string)
        if(userExists.user === undefined) {
          await createUser(
            user.name as string,
            user.email as string,
            user.image as string
          )
        }
        return true
      } catch (error) {
       console.log(error)
       return false 
      }
    },
    async jwt({ token }) {
      return token
    }
  }
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions) as SessionInterface
  return session
}