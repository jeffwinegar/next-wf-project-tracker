import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import { initializeApollo } from '@/apollo/client';
import styled from 'styled-components';
import Downshift from 'downshift';

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
        <Downshift itemToString={(proj) => (proj ? proj.name : '')}>
          {({
            getInputProps,
            getItemProps,
            getLabelProps,
            getMenuProps,
            getToggleButtonProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem,
            clearSelection,
            getRootProps,
          }) => (
            <div>
              <label {...getLabelProps()}>Search project name:</label>
              <div {...getRootProps({}, { suppressRefError: true })}>
                <input
                  {...getInputProps({ placeholder: 'Search project name' })}
                />
                {selectedItem ? (
                  <button onClick={clearSelection} aria-label="clear selection">
                    x
                  </button>
                ) : (
                  <button
                    {...getToggleButtonProps({ 'aria-label': 'toggle menu' })}
                  >
                    &#8595;
                  </button>
                )}
              </div>
              <StyledDropdown {...getMenuProps()}>
                {isOpen
                  ? projects
                      .filter(
                        (proj) =>
                          !inputValue ||
                          proj.name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                      )
                      .map((proj, idx) => (
                        <li
                          {...getItemProps({
                            key: proj.id,
                            index: idx,
                            item: proj,
                            style: {
                              backgroundColor:
                                highlightedIndex === idx
                                  ? 'var(--offWhite)'
                                  : 'var(--white)',
                              fontWeight:
                                selectedItem === proj ? '600' : 'normal',
                            },
                          })}
                        >
                          {proj.name}
                        </li>
                      ))
                  : null}
              </StyledDropdown>
            </div>
          )}
        </Downshift>
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
  padding: 1.5em;
  width: 100%;

  > * + * {
    margin-top: 1.5em;
  }
`;

const StyledDropdown = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
