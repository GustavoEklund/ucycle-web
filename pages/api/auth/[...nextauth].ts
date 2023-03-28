import NextAuth, { AuthOptions } from 'next-auth'
import KeycloakProvider, { KeycloakProfile } from 'next-auth/providers/keycloak'
import { OAuthConfig } from 'next-auth/providers'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    id_token?: string;
    provider?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
      issuer: process.env.KEYCLOAK_ISSUER ?? '',
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token
        token.provider = account.provider
      }
      return token
    },
  },
  events: {
    async signOut({ token }: { token: JWT }): Promise<void> {
      if (token.provider === 'keycloak') {
        const keycloakProvider = authOptions.providers.find(provider => provider.id === 'keycloak') as OAuthConfig<KeycloakProfile>
        const issuerUrl = keycloakProvider.options!.issuer!
        const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`)
        logOutUrl.searchParams.set('id_token_hint', token.id_token!)
        await fetch(logOutUrl)
      }
    },
  },
}
export default NextAuth(authOptions)

