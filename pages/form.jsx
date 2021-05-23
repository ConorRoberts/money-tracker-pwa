import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { Input, Select, Button, Checkbox } from "@components/FormComponents";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { categories } from "@components/TransactionCard";
import { useSession } from "next-auth/client";

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
        className="lg:w-1/3 lg:mx-auto bg-gray-800 flex flex-col gap-4 p-5"
        onSubmit={handleSubmit}
      >
        <Select
          value={form.type}
          name="type"
          onChange={handleChange}
          className="bg-white"
        >
          <option value="" disabled>
            Choose a type
          </option>
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
        </Select>
        <Input
          placeholder="Amount"
          type="number"
          name="amount"
          onChange={handleChange}
          value={form.amount}
        />
        <Input
          placeholder="Note"
          type="text"
          name="note"
          onChange={handleChange}
          value={form.note}
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
        <div className="flex flex-col items-center text-white">
          <h2>Is this taxable?</h2>
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
