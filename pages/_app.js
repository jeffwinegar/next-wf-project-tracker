import { ApolloProvider } from '@apollo/client';
import { useApollo } from '@/apollo/client';

import 'modern-css-reset';
import { GlobalStyle } from '@/styles/GlobalStyles';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
