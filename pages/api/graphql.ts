import { ApolloServer } from "apollo-server-micro";
import dbConnect from "@utils/dbConnect";
import typeDefs from "@graphql/schema";
import resolvers from "@graphql/resolvers";

const apolloServer = new ApolloServer({ typeDefs, resolvers, uploads: false, context: async () => await dbConnect() });

export const config = {
    api: {
        bodyParser: false
    }
};

export default apolloServer.createHandler({ path: "/api/graphql" });