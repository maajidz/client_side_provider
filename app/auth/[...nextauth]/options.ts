import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { providerLogin } from "@/services/loginServices";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider ({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password"
                }
            },
            async authorize(credentials) {
        

                if(!credentials?.email  || !credentials?.password) {
                    return null;
                } 

                const loginData = await providerLogin({
                    requestData: {
                        email: credentials.email,
                        password: credentials.password
                    }
                })

                if(loginData && loginData.token){
                    return {
                        id: loginData.providerId,
                        email: credentials.email,
                        token: loginData.token
                    }
                }
                return  null;
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin", // Customize sign-in page if needed
        error: "/auth/error", // Customize error page if needed
    },
}