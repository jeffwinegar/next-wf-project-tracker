import { getAllProjects, getProjectByID } from './workfront-connector';

export const resolvers = {
  Query: {
    projects: (_, { cid }) => getAllProjects(cid),
    project: (_, { id }) => getProjectByID(id),
  },
};
