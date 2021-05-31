import Transaction from "@models/Transaction";
import Client from "@models/Client";
import User from "@models/User";

import fs from "fs-extra";

/**
 * Formats mongoose transaction document into something GQL can use
 * @param {*} transactionDocument 
 * @returns 
 */
const formatTransaction = (transactionDocument) => {
    const transaction = transactionDocument._doc;
    return {
        ...transaction,
        id: transactionDocument.id,
        created_at: new Date(transaction.created_at).toISOString()
    };
}

const getClient = async (id) => {
    try {
        const client = await Client.findOne({ auth: id }).populate("auth").populate("transactions");

        return {
            ...client._doc,
            id: client.id,
            transactions: client._doc.transactions.map(e => formatTransaction(e)),
            auth: {
                ...client._doc.auth._doc,
                created_at: new Date(client._doc.auth.createdAt).toISOString(),
                updated_at: new Date(client._doc.auth.updatedAt).toISOString()
            }
        }
    } catch (e) {
        return null;
    }
}

const resolvers = {
    Query: {
        get_client: async (_, { id }) => {
            return await getClient(id);
        },
        get_transaction: async (_, { id }) => {
            try {
                const transaction = await Transaction.findOne({ _id: id });

                return formatTransaction(transaction);
            } catch (e) {
                return null;
            }
        }
    },
    Mutation: {
        create_transaction: async (_, { client_id, transaction }) => {
            try {
                const client = await Client.findOne({ auth: client_id });

                const newTransaction = new Transaction({ ...transaction });
                await newTransaction.save();

                client.transactions.push(newTransaction.id)
                await client.save();

                return formatTransaction(newTransaction);
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        update_transaction: async (_, { id, transaction }) => {
            try {
                const updatedTransaction = await Transaction.findOneAndUpdate({ _id: id }, { ...transaction });
                await updatedTransaction.save();

                return formatTransaction(updatedTransaction);
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        delete_transaction: async (_, { id }) => {
            try {
                const deletedTransaction = await Transaction.findOneAndDelete({ _id: id });

                return formatTransaction(deletedTransaction);
            } catch (error) {
                console.error(error);
            }

            return null;
        },
    },
};

export default resolvers;