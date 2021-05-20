import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { Input } from "@components/FormComponents";
import { Button } from "@components/FormComponents";
import { Select } from "@components/FormComponents";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

const CREATE_TRANSACTION = gql`
  mutation createTransaction($transaction: TransactionInput!) {
    create_transaction(transaction:$transaction) {
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
      });

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div>
      <form className="lg:w-1/2 lg:mx-auto" onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <Select name="type" onChange={handleChange} className="flex-1">
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
          </Select>
          <Input
            className="flex-1"
            placeholder="Amount"
            type="number"
            name="amount"
            onChange={handleChange}
            value={form.amount}
          />
        </div>
        <div className="flex flex-col gap-5">
          <Input
            placeholder="Note"
            type="text"
            name="note"
            onChange={handleChange}
            value={form.note}
          />
          <Input
            placeholder="Category"
            type="text"
            name="category"
            onChange={handleChange}
            value={form.category}
          />
          <div className="flex justify-center">
            <h2>Is this taxable?</h2>
            <Input
              className="w-10 h-10"
              type="checkbox"
              name="taxable"
              value={form.taxable}
              onChange={() => setForm({ ...form, taxable: !form.taxable })}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Form;
