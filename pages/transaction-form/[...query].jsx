import React, { useEffect, useState } from "react";
import { Input, Select, Button, Checkbox } from "@components/FormComponents";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useSession } from "next-auth/client";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import { categories } from "@components/TransactionCard";

const UPDATE_TRANSACTION = gql`
  mutation updateTransaction($id: String!, $transaction: TransactionInput!) {
    update_transaction(id: $id, transaction: $transaction) {
      id
    }
  }
`;

const CREATE_TRANSACTION = gql`
  mutation createTransaction(
    $client_id: String!
    $transaction: TransactionInput!
  ) {
    create_transaction(client_id: $client_id, transaction: $transaction) {
      id
    }
  }
`;

const GET_TRANSACTION = gql`
  query getTransaction($id: String!) {
    get_transaction(id: $id) {
      id
      note
      category
      amount
      created_at
      taxable
      type
    }
  }
`;

export default function TransactionForm({ id = "", method }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const [getTransaction, { data }] = useLazyQuery(GET_TRANSACTION);
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);
  const [createTransaction] = useMutation(CREATE_TRANSACTION);
  const [form, setForm] = useState({
    note: "",
    amount: "",
    category: "",
    type: "",
    created_at: new Date().toISOString().slice(0, 10),
    taxable: false,
  });

  useEffect(() => {
    if (method === "edit") getTransaction({ variables: { id: id } });
  }, []);

  useEffect(() => {
    if (data) {
      setForm({
        ...data?.get_transaction,
        created_at: data?.get_transaction.created_at.slice(0, 10),
      });
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const transaction = {
      category: form.category,
      note: form.note,
      taxable: form.taxable,
      amount: +form.amount,
      type: form.category === "revenue" ? "revenue" : "expense",
      created_at: new Date(...form.created_at.split("-")),
    };

    try {
      if (method === "new") {
        createTransaction({
          variables: {
            client_id: session.user.id,
            transaction,
          },
        });
      } else if (method === "edit") {
        updateTransaction({
          variables: {
            id,
            transaction,
          },
        });
      }

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, type = "text", value } = e.target;
    setForm({
      ...form,
      [name]:
        type === "tel"
          ? value
              .split("")
              .filter((e) => !isNaN(e))
              .join("")
          : value,
    });
  };

  if (loading) return <Loading />;
  if (method === "edit" && !data) return <Loading />;

  if (!loading && !session) router.push("/");
  return (
    <div className="bg-gray-900 flex justify-center items-center flex-1">
      <form
        className="w-full md:w-1/2 md:mx-auto md:rounded-lg md:shadow-md bg-gray-800 flex flex-col gap-4 p-5"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Amount"
          type="tel"
          name="amount"
          step=".01"
          onChange={handleChange}
          value={form.amount}
        />
        <Select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="bg-white capitalize"
        >
          <option value="" disabled>
            Choose a category
          </option>

          {Object.keys(categories).map((e, index) => (
            <option className="capitalize" key={`${e}-${index}`} value={e}>
              {e}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Note"
          type="text"
          name="note"
          onChange={handleChange}
          value={form.note}
        />
        <Input
          type="date"
          name="created_at"
          onChange={handleChange}
          value={form.created_at}
        />
        <div className="flex flex-col items-center text-white">
          <p>Taxable?</p>
          <Checkbox
            className="w-7 h-7 bg-white"
            name="taxable"
            value={form.taxable}
            onClick={() => setForm({ ...form, taxable: !form.taxable })}
          />
        </div>
        <div className="flex justify-center text-white">
          <Button
            type="Submit"
            className="bg-gray-600 hover:bg-gray-300 hover:text-gray-800 transition"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps = async (req, res) => {
  const {
    query: [method, id],
  } = req.query;

  return { props: { method, id: id ?? "" } };
};
