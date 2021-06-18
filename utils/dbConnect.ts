import mongoose from 'mongoose'
import {userSchema} from "@models/User";
import {transactionSchema} from "@models/Transaction";
import {clientSchema} from "@models/Client";

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  // mongoose.model("User",userSchema);
  // mongoose.model("Transaction",transactionSchema);
  // mongoose.model("Client",clientSchema);

  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

export default dbConnect;
