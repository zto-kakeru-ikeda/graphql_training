import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { DefaultApolloClient } from '@vue/apollo-composable';
import type { App } from 'vue';

// Apollo Clientの設定
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

// VueアプリにApollo Clientを提供
export function setupApollo(app: App) {
  app.provide(DefaultApolloClient, apolloClient);
}
