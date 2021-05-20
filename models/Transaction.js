import mongoose from "mongoose";
import { Schema } from "mongoose";

const transactionSchema = new Schema({
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
    amount: {
        type: Number,
        default: 0
    },
    creator: {
        type: String,
        default: "Unknown"
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    taxable: {
        type: Boolean,
        default: false
    }
})

export default mongoose.models.Transaction ?? mongoose.model("Transaction", transactionSchema);