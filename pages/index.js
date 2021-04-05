import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import { initializeApollo } from '../apollo/client';
import ErrorMessage from '../components/ErrorMessage';

const GetAllProjects = gql`
  query GetAllProjects($cid: ID!) {
    projects(cid: $cid) {
      id
      name
      client
      program
      expireDate
      tasks {
        id
        role
        roleID
        projectID
        hoursScoped
      }
      hours {
        id
        role
        roleID
        hoursLogged
      }
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GetAllProjects, {
    variables: { cid: process.env.NEXT_PUBLIC_WF_CID },
  });

  if (loading) return <span>loading...</span>;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <Head>
        <title>WF Project Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// TODO: figure out why query fails
// ApolloError: Cannot destructure property 'dataSources' of 'undefined' as it is undefined.

// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   await apolloClient.query({
//     query: GetAllProjects,
//     variables: { cid: process.env.NEXT_PUBLIC_WF_CID },
//   });

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }
