import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Loading from "@components/Loading";

const UPDATE_TRANSACTION = gql`
  mutation updateTransaction(
    $client_id: String!
    $transaction: TransactionInput!
  ) {
    update_transaction(client_id: $client_id, transaction: $transaction) {
      id
    }
  }
`;

export default function EditTransactionPopup({
  amount,
  note,
  created_at,
  category,
  type,
}) {
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);
  const router = useRouter();
  const [session, loading] = useSession();
  const [form, setForm] = useState({
    note: "",
    amount: "",
    category: "",
    type: "",
    taxable: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      updateTransaction({
        variables: {
          client_id: session.user.id,
          transaction: { ...form, amount: +form.amount },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Loading />;

  if (!session) {
    router.push("/");
    return <Loading />;
  }
  return (
    <div className="absolute bg-gray-900 bg-opacity-50 top-0 bottom-0 left-0 right-0 flex justify-center items-center">
      <div className="bg-gray-700 rounded-lg p-5 flex items-center gap-5 shadow-md flex-auto sm:flex-none sm:w-96">
        Edit Transaction
        <form onSubmit={handleSubmit}></form>
      </div>
    </div>
  );
}
