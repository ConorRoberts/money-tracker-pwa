import User from "@models/User";
import Transaction from "@models/transaction";

/**
 * Formats mongoose user document into something GQL can use
 * @param {*} userDocument 
 * @returns 
 */
const formatUser = (userDocument) => {
    const user = userDocument._doc;
    return {
        ...user,
        id: userDocument.id,
        created_at: new Date(user.created_at).toISOString()
    };
}

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
        get_user: async (_, { user_id }) => {
            try {
                const user = await User.findOne({ _id: user_id })
                return user;
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        get_transaction: async (_, { transaction_id }) => {
            try {
                const transaction = await Transaction.findOne({ _id: transaction_id })
                return transaction;
            } catch (error) {
                console.error(error);
            }
            return null;
        },
        get_all_users: async () => {
            try {
                const users = await User.find({});
                return users.map(e => formatUser(e));
            } catch (error) {
                console.log(error);
            }

            return null;
        }
    },
    Mutation: {
        create_user: async (_, { user }) => {
            try {
                const newUser = new User({ ...user });
                await newUser.save();
                return formatUser(newUser);
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        update_user: () => {
            return null;
        },
        delete_user: () => {
            return null;
        },
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