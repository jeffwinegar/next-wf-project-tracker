import { ApolloServer } from 'apollo-server-micro';
import { schema } from '../../apollo/schema';
import WorkfrontAPI from '../../apollo/datasources/workfront';

const API_KEY = process.env.WF_API_KEY;

const apolloServer = new ApolloServer({
  schema,
  dataSources: () => ({
    workfrontAPI: new WorkfrontAPI(),
  }),
  context: () => ({
    token: API_KEY,
  }),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
