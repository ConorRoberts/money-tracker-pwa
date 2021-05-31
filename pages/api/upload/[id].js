import formidable from "formidable";
import fs from "fs-extra";
import csv from "csv-parser";

import Transaction from "@models/Transaction";
import Client from "@models/Client";
import dbConnect from "@utils/dbConnect";

export const config = {
    api: {
        bodyParser: false
    }
};

const formatData = (results) => {
    const formatted = results.map(({ Timestamp, Category, Amount, Note }) => {
        let created_at = new Date(Timestamp);

        let category = Category?.toLowerCase().replace("(tax)", "").trim() ?? "other";

        let type = category?.includes("revenue") ? "revenue" : "expense";

        let amount = +Amount?.replace("$", "").split(",").join("");

        let note = Note?.replace("(Eating)", "").trim();

        return { created_at, category, amount, note, type };
    }).filter(e => e);

    return formatted;
}

const submitData = async (data, user) => {
    try {
        const client = await Client.findOne({ auth: user });

        data.forEach(async (e) => {
            const t = new Transaction({ ...e });

            client.transactions.push(t.id);
            await t.save();
        })

        await client.save();
    } catch (e) {
        console.error(e);
    }
}

export default async (req, res) => {
    await dbConnect();

    const user = req.query.id;

    let result = [];

    let results = [];
    new formidable.IncomingForm().parse(req)
        .on('file', function (name, file) {
            fs.createReadStream(file.path).pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    const formatted = formatData(results);

                    result = formatted;

                    await submitData(formatted, user);
                });
        })


    return res.status(200).send({ data: result.slice(0, 100) });
};
