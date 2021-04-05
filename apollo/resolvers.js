export const resolvers = {
  Query: {
    projects: async (_, { cid }, { dataSources }) =>
      await dataSources.workfrontAPI.getAllProjects({ companyID: cid }),
    project: async (_, { id }, { dataSources }) =>
      await dataSources.workfrontAPI.getProjectByID({ projID: id }),
  },
};
