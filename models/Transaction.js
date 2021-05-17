import mongoose from "mongoose";
import { Schema } from "mongoose";

const paymentSchema = new Schema({
    note: {
        type: String,
        default: "Payment"
    },
    type: {
        type: String,
        enum: ["revenue", "expense"],
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
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.models.Payment ?? mongoose.model("Payment", paymentSchema);