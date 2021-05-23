import Transaction from "@models/Transaction";
import Client from "@models/Client";
import User from "@models/User";

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
            auth: {
                ...client._doc.auth._doc,
                created_at: new Date(client._doc.auth.createdAt).toISOString(),
                updated_at: new Date(client._doc.auth.updatedAt).toISOString()
            }
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

const resolvers = {
    Query: {
        get_transaction: async (_, { id }) => {
            try {
                const transaction = await Transaction.findOne({ _id: id })
                return transaction;
            } catch (error) {
                console.error(error);
            }
            return null;
        },
        get_user_transactions: async (_, { id }) => {
            if (!id) return [];
            try {
                const transactions = await Transaction.find({ creator: id });
                return transactions.map(e => formatTransaction(e))
            } catch (error) {
                console.error(error);
            }
            return [];
        },
        get_client: async (_, { id }) => {
            return await getClient(id);
        }
    },
    Mutation: {
        create_transaction: async (_, { client_id, transaction }) => {
            try {

                const client = await getClient(client_id);

                const newTransaction = new Transaction({ ...transaction });
                await newTransaction.save();


                client.transactions.push(newTransaction.id)
                await client.save();

                return null;
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        update_transaction: async (_, { id, transaction }) => {
            try {
                const updatedTransaction = await Transaction.findOneAndUpdate({ _id: id }, { ...transaction });
                await updatedTransaction.save();
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        delete_transaction: async (_, { id }) => {
            try {
                await Transaction.findOneAndDelete({ _id: id });
            } catch (error) {
                console.error(error);
            }

            return null;
        },
    },
};

export default resolvers;