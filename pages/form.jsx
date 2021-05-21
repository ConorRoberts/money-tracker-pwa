import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Input } from "@components/FormComponents";
import { Button } from "@components/FormComponents";
import { Select } from "@components/FormComponents";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { Checkbox } from "@components/FormComponents";

const CREATE_TRANSACTION = gql`
  mutation createTransaction($transaction: TransactionInput!) {
    create_transaction(transaction: $transaction) {
      id
    }
  }
`;

const Form = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [createTransaction] = useMutation(CREATE_TRANSACTION);
  const [form, setForm] = useState({
    note: "",
    amount: "",
    category: "",
    type: "",
    taxable: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      createTransaction({
        variables: {
          transaction: {
            ...form,
            amount: +form.amount,
            creator: user.sub,
          },
        },
      }).then(() => router.push("/"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  if (isLoading) return <Loading />;

  if (!isLoading && !user) router.push("/");

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center">
      <form
        className="lg:w-1/3 lg:mx-auto bg-gray-800 flex flex-col gap-4 p-5"
        onSubmit={handleSubmit}
      >
        <Select name="type" onChange={handleChange} className="bg-white">
          <option value="" disabled>Choose a type</option>
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
        <Select name="category" onChange={handleChange} className="bg-white">
          <option value="" disabled>Choose a category</option>
          <option value="groceries">Groceries</option>
          <option value="clothing">Clothing</option>
          <option value="office_expense">Office Expense</option>
          <option value="maintenance_and_repairs">Maintenance and Repairs</option>
          <option value="revenue">Revenue</option>
          <option value="travel">Travel</option>
          <option value="technology">Technology</option>
          <option value="rent">Rent</option>
          <option value="meals">Meals</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
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
          <Button type="Submit" className="bg-gray-600">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
