"use client";

import { HttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  ApolloNextAppProvider,
  NextSSRApolloClient,
  NextSSRInMemoryCache,
} from "@apollo/experimental-nextjs-app-support/ssr";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3001/graphql";
const WEBSOCKET_ENDPOINT =
  process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT || "ws://localhost:3001/graphql";

function makeClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: "include",
  });

  const authLink = setContext((_, { headers }) => {
    // 👇 browser me hi chalega
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: WEBSOCKET_ENDPOINT,
            connectionParams: () => {
              const token = localStorage.getItem("accessToken");
              return { authorization: token ? `Bearer ${token}` : "" };
            },
          }),
        )
      : null;

  const splitLink =
    typeof window !== "undefined" && wsLink
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          wsLink, // Agar subscription hai toh yahan bhejo
          authLink.concat(httpLink), // Warna yahan
        )
      : authLink.concat(httpLink);

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: splitLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
