import Transaction from "@models/transaction";

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
        }
    },
    Mutation: {
        create_transaction: async (_, { transaction }) => {
            try {
                const newTransaction = new Transaction({ ...transaction });
                await newTransaction.save();
                return formatTransaction(newTransaction);
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        update_transaction: () => {
            return null;
        },
        delete_transaction: () => {
            return null;
        },
    },
};

export default resolvers;