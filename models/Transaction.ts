import mongoose from "mongoose";
import { Schema } from "mongoose";

export const transactionSchema = new Schema({
    note: {
        type: String,
        default: "Payment"
    },
    type: {
        type: String,
        default: "revenue"
    },
    category: {
        type: String,
        default: "other"
    },
    subcategory: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    taxable: {
        type: Boolean,
        default: false
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "Client"
    }
})

export default mongoose.models.Transaction ?? mongoose.model("Transaction", transactionSchema);