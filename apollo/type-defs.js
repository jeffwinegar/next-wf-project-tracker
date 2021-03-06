import { gql } from '@apollo/client';

export const typeDefs = gql`
  type Query {
    projects(cid: ID!): [Project!]!
    project(id: ID!): Project
  }

  type Project {
    id: ID!
    name: String!
    client: String!
    program: String!
    expireDate: String!
    tasks: [Task!]!
    hours: [Hours!]!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    title: String
    email: String!
  }

  type Task {
    id: ID!
    role: String!
    roleID: String
    projectID: String!
    hoursScoped: Int!
    assignedTo: User!
  }

  type Hours {
    id: ID!
    role: String!
    roleID: String
    hoursLogged: Int!
  }
`;
