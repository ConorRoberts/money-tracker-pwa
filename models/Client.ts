import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema({
    auth: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    transactions: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Transaction"
        }],
        default: []
    }
})

export default mongoose.models.Client ?? mongoose.model("Client", clientSchema);