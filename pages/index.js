import Head from 'next/head';
import { useQuery, gql } from '@apollo/client';
import { initializeApollo } from '@/apollo/client';
import styled from 'styled-components';
import Downshift from 'downshift';
import { useState, useEffect } from 'react';

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
    data: { projects: initialProjects },
    loading,
    error,
  } = useQuery(GetAllProjects, {
    variables: { cid: process.env.NEXT_PUBLIC_WF_CID },
    pollInterval: 60000, // 1 minute
  });

  if (loading) return <span>loading...</span>;
  if (error) return <ErrorMessage error={error} />;

  const [projects, setProjects] = useState(initialProjects);
  const [searchResult, setSearchResult] = useState('');

  useEffect(() => {
    const selectedProject = initialProjects.filter((proj) =>
      proj.name.includes(searchResult)
    );
    setProjects(selectedProject);
  }, [searchResult]);

  return (
    <>
      <Head>
        <title>+WTOC Project Tracker</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Downshift
          onChange={(selection) =>
            setSearchResult(selection ? selection.name : '')
          }
          itemToString={(proj) => (proj ? proj.name : '')}
        >
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
            <StyledSearch>
              <label {...getLabelProps()}>Search projects</label>
              <StyledField
                {...getRootProps({ isOpen }, { suppressRefError: true })}
              >
                <StyledInput
                  {...getInputProps({
                    placeholder: 'Enter name or number',
                  })}
                />
                {selectedItem ? (
                  <StyledControlButton
                    onClick={clearSelection}
                    aria-label="clear selection"
                  >
                    <XIcon />
                  </StyledControlButton>
                ) : (
                  <StyledControlButton
                    {...getToggleButtonProps({ 'aria-label': 'toggle menu' })}
                  >
                    <ArrowIcon isOpen={isOpen} />
                  </StyledControlButton>
                )}
              </StyledField>
              <StyledMenu {...getMenuProps({ isOpen })}>
                {isOpen
                  ? initialProjects
                      .filter(
                        (proj) =>
                          !inputValue ||
                          proj.name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                      )
                      .map((proj, idx) => (
                        <StyledItem
                          {...getItemProps({
                            key: proj.id,
                            index: idx,
                            item: proj,
                            isActive: highlightedIndex === idx,
                            isSelected: selectedItem === proj,
                          })}
                        >
                          {proj.name}
                        </StyledItem>
                      ))
                  : null}
              </StyledMenu>
            </StyledSearch>
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

function ArrowIcon({ isOpen }) {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="var(--black)"
      strokeWidth="1.5px"
      transform={isOpen ? 'rotate(180)' : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="var(--black)"
      strokeWidth="2px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  );
}

const StyledListingContainer = styled.div`
  padding: 1.5em;
  width: 100%;

  > * + * {
    margin-top: 1.5em;
  }
`;

const StyledSearch = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 425px;
  width: 100%;

  label {
    font-size: 85%;
    font-weight: 600;
    line-height: 1;
    margin-bottom: 0.3125rem;
  }
`;

const StyledField = styled.div`
  align-items: center;
  background-color: var(--white);
  border: solid 1px var(--gray);
  border-radius: 5px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  overflow: hidden;
  position: relative;
  padding-right: 0.25em;
  transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:focus-within {
    border-color: var(--darkGray);
  }
  ${(props) =>
    props.isOpen
      ? 'border-bottom-right-radius: 0; border-bottom-left-radius: 0;'
      : null}
`;

const StyledInput = styled.input`
  border: none;
  flex-grow: 1;
  line-height: 1;
  outline: 0;
  padding: 0.625em;
  -moz-appearance: none;
  -webkit-appearance: none;
`;

const StyledControlButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 2em;
  justify-content: center;
  outline: 0;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  width: 2em;

  &:hover {
    background-color: var(--lightGray);
  }
  &:focus {
    background-color: var(--darkGray);
  }
  &:focus:not(:focus-visible) {
    background-color: transparent;
  }
  &:focus-visible {
    background-color: var(--gray);
  }
`;

const StyledMenu = styled.ul`
  border-color: var(--darkGray);
  border-top-width: 0;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border-radius: 0 0 5px 5px;
  display: inline-block;
  list-style: none;
  max-height: 20rem;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  width: 100%;

  ${(props) => (props.isOpen ? null : 'border: none;')}
`;

const StyledItem = styled.li`
  background-color: ${(props) =>
    props.isActive ? 'var(--lightGray)' : 'var(--white)'};
  cursor: pointer;
  display: block;
  font-weight: ${(props) => (props.isSelected ? '600' : 'normal')};
  position: relative;
  line-height: 1;
  padding: 0.625em;
`;
