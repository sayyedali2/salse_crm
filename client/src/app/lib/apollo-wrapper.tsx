"use client";

import { ApolloLink, HttpLink, split } from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const GRAPHQL_ENDPOINT = "https://salsecrm-production.up.railway.app/graphql";
const WEBSOCKET_ENDPOINT = "wss://salsecrm-production.up.railway.app/graphql";

function makeClient() {
  // 1. Normal rasta (HTTP) - Queries ke liye
  const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

  let link: ApolloLink;

  // Next.js check karta hai: Kya hum server par hain?
  if (typeof window === "undefined") {
    link = ApolloLink.from([
      new SSRMultipartLink({ stripDefer: true }),
      httpLink, // <--- Ye zaroori hai server par data dikhane ke liye
    ]);
  } else {
    // 2. Live rasta (WebSocket) - Subscriptions ke liye
    const wsLink = new GraphQLWsLink(
      createClient({
        url: WEBSOCKET_ENDPOINT,
      })
    );

    // 3. Traffic Policeman (Split)
    // Agar subscription hai to wsLink use karo, nahi to httpLink
    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,   // Subscription ke liye path
      httpLink  // Baaki sab ke liye path (Query/Mutation)
    );
  }

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: link,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}