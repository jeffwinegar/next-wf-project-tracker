import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import { initializeApollo } from '@/apollo/client';
import styled from 'styled-components';

import ErrorMessage from '@/components/ErrorMessage';
import Project from '@/components/Project';

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
        assignedTo {
          firstName
          lastName
        }
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
  const {
    data: { projects },
    loading,
    error,
  } = useQuery(GetAllProjects, {
    variables: { cid: process.env.NEXT_PUBLIC_WF_CID },
    pollInterval: 60000, // 1 minute
  });

  if (loading) return <span>loading...</span>;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <Head>
        <title>+WTOC Project Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <StyledListingContainer>
          {projects.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </StyledListingContainer>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: GetAllProjects,
    variables: { cid: process.env.NEXT_PUBLIC_WF_CID },
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
}

const StyledListingContainer = styled.div`
  width: 100%;
  padding: 1.5em;

  > * + * {
    margin-top: 1.5em;
  }
`;
