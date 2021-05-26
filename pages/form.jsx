import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { Input, Select, Button, Checkbox } from "@components/FormComponents";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useSession } from "next-auth/client";
import { categories } from "@components/TransactionCard";

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

const Form = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const [createTransaction, { data }] = useMutation(CREATE_TRANSACTION);
  const [form, setForm] = useState({
    note: "",
    amount: "",
    category: "",
    type: "",
    taxable: false,
  });

  useEffect(() => {
    if (data) router.push("/");
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      createTransaction({
        variables: {
          client_id: session.user.id,
          transaction: {
            ...form,
            amount: +form.amount,
            type: form.category === "revenue" ? "revenue" : "expense",
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  if (loading) return <Loading />;

  if (!loading && !session) router.push("/");

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center">
      <form
        className="w-full md:w-1/2 md:mx-auto md:rounded-lg md:shadow-md bg-gray-800 flex flex-col gap-4 p-5"
        onSubmit={handleSubmit}
      >
        <Input
          placeholder="Amount"
          type="number"
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
          <Button type="Submit" className="bg-gray-600">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
