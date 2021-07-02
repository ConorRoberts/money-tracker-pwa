import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Button,
  Checkbox,
  Label,
} from "@components/FormComponents";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useSession } from "next-auth/client";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import categories from "@utils/categories";
import capitalize from "@utils/capitalize";
import dateConvert from "@utils/dateConvert";
import Transaction from "@typedefs/transaction";
import { FaTrashAlt as TrashIcon } from "react-icons/fa";
import numberFilter from "@utils/numberFilter";

const UPDATE_TRANSACTION = gql`
  mutation updateTransaction($id: String!, $transaction: TransactionInput!) {
    update_transaction(id: $id, transaction: $transaction) {
      id
    }
  }
`;
const DELETE_TRANSACTION = gql`
  mutation deleteTransaction($id: String!) {
    delete_transaction(id: $id) {
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
      category
      amount
      created_at
      taxable
      type
      description
    }
  }
`;

const defaultDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${(new Date().getDate()).toString().padStart(2, "0")}`;

export default function TransactionForm({ id = "", method }) {
  const [session, loading] = useSession();
  const router = useRouter();
  const [getTransaction, { data, loading: transactionLoading }] = useLazyQuery(GET_TRANSACTION);
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    onCompleted: () => router.push("/"),
  });
  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    onCompleted: () => router.push("/"),
  });
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    onCompleted: () => router.push("/"),
  });
  const [errors, setErrors] = useState(null);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    type: "",
    created_at: defaultDate,
    taxable: false,
  });

  const errorRef: any = useRef();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { description, category, amount, type, taxable, created_at } = form;

    if (type === "") {
      return setErrors("Error - Type missing.");
    } else if (category === "") {
      return setErrors("Error - Category missing.");
    } else if (description === "") {
      return setErrors("Error - Description missing.");
    } else if (amount === "") {
      return setErrors("Error - Amount missing.");
    }

    const transaction: Transaction = {
      category: category.toLowerCase(),
      amount: +amount,
      type: type.toLowerCase(),
      taxable,
      description,
      created_at: created_at === defaultDate
        ? new Date()
        : dateConvert(created_at),
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type = "text" } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? numberFilter(value) : value,
    });
  };

  useEffect(() => {
    if (method === "edit") getTransaction({ variables: { id: id } });
  }, []);

  useEffect(() => {
    if (transactionLoading === false && data) {

      const filteredData: any = Object.fromEntries(Object.entries(data?.get_transaction).filter(([key]) => Object.keys(form).includes(key)));

      setForm({
        ...filteredData,
        created_at: data?.get_transaction.created_at.slice(0, 10),
        description: data?.get_transaction.description ?? ""
      });
    }
  }, [data]);

  useEffect(() => { errorRef?.current?.scrollIntoView({ behavior: "smooth" }) }, [errors]);

  if (loading) return <Loading />;
  if (method === "edit" && !data) return <Loading />;

  if (!loading && !session) router.push("/");

  return (
    <div className="bg-gray-900 flex-1 p-2 pb-24">
      {errors && <div ref={errorRef} className="bg-red-300 rounded-md text-center py-2 mb-3 font-semibold">
        {errors}
      </div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 bg-gray-800 md:rounded-lg shadow-md max-w-2xl mx-auto mt-2 sm:mt-16">
        {method === "edit" && (
          <div className="flex justify-center items-center">
            <p className="text-white font-thin text-xl">Edit Transaction</p>
            <div className="flex justify-end flex-1">
              <div
                className="rounded-md hover:bg-gray-700 transition p-3 flex items-center cursor-pointer"
                onClick={() => deleteTransaction({ variables: { id } })}
              >
                <TrashIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}
        <div>
          <Label>Transaction Type</Label>
          <div className="flex justify-start gap-4">
            {["revenue", "expense"].map((e, typeIndex) => <Button
              onClick={() => setForm({ ...form, type: e })}
              type="button"
              key={`type-${typeIndex}`}
              className={`${form.type === e
                ? "bg-green-700 text-gray-100"
                : "bg-white hover:bg-green-100 transition"
                } p-2 rounded-md shadow-md whitespace-nowrap transition flex-1 `}
            >
              {capitalize(e)}
            </Button>)}
          </div>
        </div>
        <div>
          <Label>Category</Label>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 grid-flow-row">
            {Object.entries(categories).filter(([_key, val]) => val.type === form.type).map(([key], categoryIdx) => (
              <Button
                key={`category-${categoryIdx}`}
                onClick={() => setForm({ ...form, category: key })}
                type="button"
                className={`${form.category === key
                  ? "bg-green-700 text-gray-100"
                  : "bg-white hover:bg-green-100 transition"
                  } p-2 rounded-md shadow-md whitespace-nowrap transition text-sm ${key.length > 12 ? "col-span-2" : "col-span-1"} row-span-1`}
              >
                {capitalize(key)}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Input onChange={handleChange} name="description" value={form.description} type="text" placeholder="Description" />
        </div>
        <div>
          <Label>Amount</Label>
          <Input
            placeholder="Amount"
            type="number"
            name="amount"
            step=".01"
            onChange={handleChange}
            value={form.amount}
          />
        </div>
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            name="created_at"
            onChange={handleChange}
            value={form.created_at}
          />
        </div>
        <div className="flex gap-3 justify-start items-center">
          <Checkbox
            className="w-6 h-6"
            name="taxable"
            value={form.taxable}
            onClick={() => setForm({ ...form, taxable: !form.taxable })}
          />
          <Label>Flag as Taxable</Label>
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            className="rounded-md bg-green-700 transition text-gray-100 px-5 py-2 hover:bg-green-900"
          >
            Submit
          </Button>
        </div>
      </form>
    </div >
  );
}

export const getServerSideProps = async (req, res) => {
  const {
    query: [method, id],
  } = req.query;

  return { props: { method, id: id ?? "" } };
};
