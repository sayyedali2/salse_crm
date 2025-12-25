"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context"; // ✅ Import this
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

// Backend URL
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql';

function makeClient() {
  // 1. HTTP Link
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
  });

  // 2. Auth Link (Token Injector)
  // Ye har request se pehle chalega aur LocalStorage se token nikalega
  const authLink = setContext((_, { headers }) => {
    // Check karein ki hum Browser me hain ya nahi (Server pe localStorage nahi hota)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    }
    return { headers };
  });

  // 3. Client Create with Link Chaining
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            // Server Side
            new SSRMultipartLink({
              stripDefer: true,
            }),
            authLink, // Server pe token usually null hoga (unless cookies use karein), but link chain me rakhna safe hai
            httpLink,
          ])
        : ApolloLink.from([
            // Client Side
            authLink, // ✅ Pehle Auth Link chalega
            httpLink, // ✅ Fir HTTP Request jayegi
          ]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}