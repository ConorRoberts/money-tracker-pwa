import Transaction from "@models/Transaction";
import Client from "@models/Client";
import User from "@models/User";

/**
 * Formats mongoose transaction document into something GQL can use
 * @param {*} transactionDocument 
 * @returns 
 */
const formatTransaction = (transactionDocument: any) => {
    const transaction = transactionDocument._doc;
    return {
        ...transaction,
        id: transactionDocument.id,
        created_at: new Date(transaction.created_at).toISOString()
    };
}

const sortTransactions = (array: any) => array.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

const resolvers = {
    Query: {
        get_client: async (_parent: any, { id, first, last }: any) => {

            const sliceTransactions = (arr: any[]) => {
                if (last === -1) {
                    return arr;
                }

                return arr.slice(first, last);
            }

            try {
                const client = await Client.findOne({ auth: id }).populate("transactions");

                // for (const i of client.transactions) {
                //     // console.log(client.id);
                //     await Transaction.findOneAndUpdate({ _id: i._id }, { author: client.id });
                // }

                return {
                    ...client._doc,
                    id: client.id,
                    transactions: sortTransactions(sliceTransactions(client._doc.transactions.map((e: any) => formatTransaction(e)))),
                    // auth: {
                    //     ...client._doc.auth._doc,
                    //     created_at: new Date(client._doc.auth.createdAt).toISOString(),
                    //     updated_at: new Date(client._doc.auth.updatedAt).toISOString()
                    // }
                }
            } catch (e) {
                console.error(e);
                return null;
            }
        },
        get_transaction: async (_parent: any, { id }: any) => {
            try {
                const transaction = await Transaction.findOne({ _id: id });

                return formatTransaction(transaction);
            } catch (e) {
                return null;
            }
        },
        get_client_categories: async (_parent: any, { id }: any) => {
            try {
                const client = await Client.findOne({ auth: id }).populate("transactions");


                let subcategories = [];
                client.transactions.map((e: any) => e.subcategory).forEach((e: string) => !subcategories.includes(e) && subcategories.push(e));

                return subcategories.filter((e: any) => e);
            } catch (e) {
                return null;
            }
        },
        get_transactions_between: async (_parent: any, { id, start, end }) => {
            let client = null;
            try {
                client = await Client.findOne({ auth: id });
            } catch (e) {
                return null;
            }

            if (!client) return null;

            try {

                let transactions: any;
                if (start && end) {
                    transactions = await Transaction.find({
                        created_at: {
                            $gte: Date.parse(start),
                            $lte: Date.parse(end),
                        },
                        author: client.id
                    });
                } else if (start) {
                    transactions = await Transaction.find({
                        created_at: {
                            $gte: Date.parse(start),
                        },
                        author: client.id
                    });
                } else if (end) {
                    transactions = await Transaction.find({
                        created_at: {
                            $lte: Date.parse(end),
                        },
                        author: client.id
                    });
                }

                return transactions?.length ? sortTransactions(transactions.map((e: any) => formatTransaction(e))) : [];
            } catch (e) {
                console.error(e);
                return null;
            }
        }
    },
    Mutation: {
        create_transaction: async (_parent: any, { client_id, transaction }) => {
            try {
                const client = await Client.findOne({ auth: client_id });

                const newTransaction = new Transaction({ ...transaction, author: client.id });
                await newTransaction.save();

                client.transactions.push(newTransaction.id)
                await client.save();

                return formatTransaction(newTransaction);
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        update_transaction: async (_parent: any, { id, transaction }: any) => {
            try {
                const updatedTransaction = await Transaction.findOneAndUpdate({ _id: id }, { ...transaction });
                await updatedTransaction.save();

                return formatTransaction(updatedTransaction);
            } catch (error) {
                console.error(error);
            }

            return null;
        },
        delete_transaction: async (_parent: any, { id }: any) => {
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