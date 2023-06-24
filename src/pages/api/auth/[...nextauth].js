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
			async authorize(credentials, req) {
				// // Add logic here to look up the user from the credentials supplied
				// const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }

				// if (user) {
				//   // Any object returned will be saved in `user` property of the JWT
				//   return user
				// } else {
				//   // If you return null then an error will be displayed advising the user to check their details.
				//   return null

				//   // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
				// }

				const payload = {
					email: credentials.email,
					password: credentials.password,
				};

				//console.log({ payload })

				const res = await fetch(`${process.env.NEXT_BASE_URL}auth/login`, {
					method: 'POST',
					body: JSON.stringify(payload),
					headers: {
						'Content-Type': 'application/json',
					},
				});

				//console.log({res})


				const user = await res.json();

				//console.log({ user: JSON.stringify(user) })
				if (!res.ok) {
					throw new Error(user.message);
				}
				// If no error and we have user data, return it
				if (res.ok && user) {
					return user;
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
			//console.log({ token, user, account })
			if (account && user) {
				//console.log({account, user})
				token._id = user?.user?._id;
				token.role = user?.user?.role
				token.name = user?.user?.name;
				token.email = user?.user?.email;
				token.accessToken = user.access_token;
				token.accessTokenExpires = user.expires_in;
				//console.log({token})
				return {
					...token,
					accessToken: user.access_token,
					refreshToken: user.refreshToken,
				};

			}
			else {
				//console.log({token})
				return token;
			}
			//console.log({token})


		},
		async session({ session, token }) {
			//console.log({session, token})
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.accessTokenExpires = token.accessTokenExpires;
			session.user._id = token?._id
			session.user.role = token?.role
			session.image = null
			//console.log({session})
			return session;
		},
	},
}

export default NextAuth(authOptions)