// pages/api/auth/[...nextauth].js
import CredentialsProvider from "next-auth/providers/credentials";
import getConfig from 'next/config';
import NextAuth from "next-auth"

const { serverRuntimeConfig } = getConfig();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Custom",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@test.pl" },
                password: { label: "Password", type: "password" },
            },
            session: {
              jwt: true,
              maxAge: 30 * 24 * 60 * 60 // the session will last 30 days
            },
            async authorize(credentials, req) {
              
                const payload = {
                  email: credentials.email,
                  password: credentials.password,
                };

                console.log({payload})
        
                const res = await fetch(`${process.env.NEXT_BASE_URL}/auth/login`, {
                  method: 'POST',
                  body: JSON.stringify(payload),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
        

                const user = await res.json();

                console.log({user: JSON.stringify(user)})
                if (!res.ok) {
                  throw new Error(user.message);
                }
                // If no error and we have user data, return it
                if (res.ok && user) {
                  return user.data;
                }
        
                // Return null if user data could not be retrieved
                return null;
            },
        }),
    ],
    secret: "hello",
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user, account }) {
            
       
          console.log({token, user, account})
        // if (account && user) {
        //     //console.log({account, user})
        //     token._id = user?.user?._id;
        //     token.role = user?.user?.role
        //     token.name = user?.user?.name;
        //     token.email = user?.user?.email;
        //     token.accessToken = user.accessToken;
        //     return {
        //         ...token,
        //         accessToken: user.accessToken,
        //         refreshToken: user.refreshToken,
        //     };
        // }

        //console.log({token})

        return token;
        },

        async session({ session, token }) {

            //console.log({session, token})
            // session.user.accessToken = token.accessToken;
            // session.user.refreshToken = token.refreshToken;
            // session.user.accessTokenExpires = token.accessTokenExpires;
            // session.user._id = token?._id
            // session.user.role = token?.role

            //console.log({session})

            return session;
        },
    },
}

export default NextAuth(authOptions)