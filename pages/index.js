import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';

import { initializeApollo } from '@/apollo/client';
import ErrorMessage from '@/components/ErrorMessage';
import Project from '@/components/Project';
import Search from '@/components/Search';

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
    data: { projects: initialProjects },
    loading,
    error,
  } = useQuery(GetAllProjects, {
    variables: { cid: process.env.NEXT_PUBLIC_WF_CID },
    pollInterval: 60000, // 1 minute
  });

  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');

  const updateSearch = (term) => setSearchTerm(term);

  useEffect(() => {
    const selectedProject = initialProjects.filter((proj) =>
      proj.name.includes(searchTerm)
    );
    setProjects(selectedProject);
  }, [searchTerm]);

  if (loading) return <span>loading...</span>;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <Head>
        <title>+WTOC Project Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <StyledNavigation>
          <StyledLink
            href="https://wunderman.my.workfront.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <WFLogo />
          </StyledLink>
          <Search
            label="Find a project"
            placeholder="Enter name or number"
            items={initialProjects}
            onSearch={updateSearch}
            aria-label="My Workfront"
          />
        </StyledNavigation>
      </header>
      <StyledMainContainer>
        <StyledListing>
          {projects.map((project) => (
            <Project key={project.id} project={project} />
          ))}
        </StyledListing>
      </StyledMainContainer>
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
    revalidate: 1, // seconds
  };
}

function WFLogo() {
  return (
    <svg
      data-name="logo-workfront"
      viewBox="0 0 100 100"
      width="32"
      fill="currentColor"
    >
      <path d="M89.4 21.6C82 8.5 76.4 1.3 76.4 1.3S64.9 0.1 50.2 0.1 23.6 1.3 23.6 1.3s-5.7 7.3-13 20.3S0.1 44.7 0.1 44.7s6.2 12.3 23.1 30.8S50 100 50 100s10.1-6.1 26.9-24.5S100 44.7 100 44.7 96.7 34.7 89.4 21.6zM57.4 73.4H42.7l-3.1-7.3L50 64.4l10.5 1.7L57.4 73.4zM61.9 37.7L77.3 27.3 66.8 64l-13.7-2.4 -1.7-5.2 7-5.5H41.6l7 5.5 -1.7 5.2 -13.7 2.4L22.7 27.3l15.4 10.4 -0.3 12.1 6.7-18.4 -22.1-7.6 11.6-6.2L50 23.1l16.1-5.5 11.6 6.2L55.6 31.5l6.7 18.4L61.9 37.7z" />
    </svg>
  );
}

const StyledMainContainer = styled.main``;

const StyledNavigation = styled.nav`
  background-color: var(--white);
  padding: 1em 1.5em 1.5em;
`;

const StyledListing = styled.div`
  padding: 1.5em;
  width: 100%;

  > * + * {
    margin-top: 1.5em;
  }
`;

const StyledLink = styled.a`
  color: var(--gray);
  outline: 0;
  transition: color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover [data-name='logo-workfront'],
  &:focus [data-name='logo-workfront'] {
    color: var(--wfOrange);
  }
`;
