import { gql } from "apollo-server-micro";

const schema = gql`

    type Transaction {
        id:ID!
        note: String!
        category:String!
        amount:Float!
        created_at:String!
        taxable:Boolean!
        type:String!
    }

    input TransactionInput {
        note: String!
        type:String!
        category:String!
        amount:Float!
        taxable:Boolean!
        created_at:String
    }
    type Auth {
        id: ID!
        name: String!
        image: String!
        created_at: String!
        updated_at: String!
    }

    type Client{
        id:ID!
        transactions:[Transaction!]
        auth:Auth!
    }

    type Query {
        get_client(id:String!):Client!
        get_transaction(id:String!):Transaction!
    }

    type Mutation {
        create_transaction(client_id:String!,transaction:TransactionInput!):Transaction
        update_transaction(id:String!,transaction:TransactionInput!): Transaction
        delete_transaction(id:String!): Transaction
    }
`;

export default schema;
