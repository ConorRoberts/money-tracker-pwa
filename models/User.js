import mongoose from "mongoose";
import { Schema } from "mongoose";


const userSchema = new Schema({
    name: {
        type: String,
        default: "John Doe"
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    payments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Payment"
        }],
        default: []
    }
})

export default mongoose.models.User ?? mongoose.model("User", userSchema);