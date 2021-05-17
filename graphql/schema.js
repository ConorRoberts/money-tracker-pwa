import { gql } from "apollo-server-micro";

const schema = gql`

    # Models
    type User{
        id:ID!
        name:String!
        created_at:String!
        transactions:[Transaction!]!
        auth:Auth!
    }

    type Auth{
        id: ID!
        name: String!
        email: String!
        image: String!
        createdAt: String!
        updatedAt: String!
    }

    type Transaction {
        id:ID!
        note: String!
        category:String!
        amount:Float!
        creator: User!
        created_at:String!
    }

    # Input
    input UserInput{
        name:String!
        created_at:String
    }
    input TransactionInput {
        note: String!
        type:String!
        category:String!
        amount:Float!
        created_at:String
        creator:String!
    }

    type Query {
        get_user(user_id:String!): User
        get_transaction(transaction_id:String!): Transaction
        get_all_users:[User]
    }
    type Mutation{
        create_user(user:UserInput): User
        update_user(user_id:String!,user:UserInput!): User
        delete_user(user_id:String!): User

        create_transaction(transaction:TransactionInput!): Transaction
        update_transaction(user_id:String!,transaction_id:String!,transaction:TransactionInput!): Transaction
        delete_transaction(user_id:String!,transaction_id:TransactionInput!): Transaction
    }
`;

export default schema;
