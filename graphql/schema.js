import { gql } from "apollo-server-micro";

const schema = gql`

    type Transaction {
        id:ID!
        note: String!
        category:String!
        amount:Float!
        creator: String!
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
        creator:String!
    }

    type Query {
        get_transaction(id:String!): Transaction
        get_user_transactions(id:String!): [Transaction!]
    }
    type Mutation {
        create_transaction(transaction:TransactionInput!): Transaction
        update_transaction(id:String!,transaction:TransactionInput!): Transaction
        delete_transaction(id:String!): Transaction
    }
`;

export default schema;
