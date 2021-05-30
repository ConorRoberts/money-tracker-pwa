import formidable from "formidable";
import fs from "fs-extra";

export const config = {
    api: {
        bodyParser: false
    }
};

const post = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        const data = await fs.readFile(files.file.path, 'utf8');
        console.log(data);
    });
};
export default (req, res) => {
    post(req, res)
    return res.status(200).send("");
};
