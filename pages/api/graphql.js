import { ApolloServer } from "apollo-server-micro";
import typeDefs from "@graphql/schema";
import resolvers from "@graphql/resolvers";
import dbConnect from "@utils/dbConnect";

const apolloServer = new ApolloServer({ typeDefs, resolvers, context: async () => await dbConnect() });

export const config = {
    api: {
        bodyParser: false
    }
};

export default apolloServer.createHandler({ path: "/api/graphql" });