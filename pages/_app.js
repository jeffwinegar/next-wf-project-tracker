import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
