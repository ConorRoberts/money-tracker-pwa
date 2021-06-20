import React, { useEffect, useRef, useState } from "react";
import {
  Input,
  Select,
  Button,
  Checkbox,
  Label,
} from "@components/FormComponents";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useSession } from "next-auth/client";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import categories from "@utils/categories";
import Image from "next/image";
import capitalize from "@utils/capitalize";
import useClientCategories from "@utils/useClientCategories";
import dateConvert from "@utils/dateConvert";
import Transaction from "@typedefs/transaction";

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
      note
      category
      amount
      created_at
      taxable
      type
      subcategory
    }
  }
`;

const DATE_DEFAULT = new Date().toISOString().slice(0, 10);

const getColumnSpan = (n: number, max: number, cols: number) => {
  const x = Math.floor(n / max) % cols
  if (x == 1) {
    return "col-span-1";
  } else if (x == 2) {
    return "col-span-2";
  } else if (x == 3) {
    return "col-span-3";
  }
};

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
    note: "",
    amount: "",
    category: "",
    subcategory: "custom",
    new_subcategory: "",
    type: "",
    created_at: DATE_DEFAULT,
    taxable: false,
  });
  const errorRef: any = useRef();
  const { data: subcategories } = useClientCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { note, subcategory, category, amount, type, taxable, created_at, new_subcategory } = form;

    if (type === "") {
      return setErrors("Error - Type missing.");
    } else if (category === "") {
      return setErrors("Error - Category missing.");
    } else if (subcategory === "custom" && new_subcategory === "") {
      return setErrors("Error - Description missing.");
    } else if (amount === "") {
      return setErrors("Error - Amount missing.");
    }

    const transaction: Transaction = {
      category: category.toLowerCase(),
      subcategory: subcategory.toLowerCase() === "custom" ? new_subcategory.toLowerCase() : subcategory.toLowerCase(),
      amount: +amount,
      type: type.toLowerCase(),
      taxable,
      note,
      created_at: created_at === DATE_DEFAULT
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
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
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
      });
    }
  }, [data]);

  useEffect(() => { errorRef?.current?.scrollIntoView({ behavior: "smooth" }) }, [errors]);

  if (loading) return <Loading />;
  if (method === "edit" && !data) return <Loading />;

  if (!loading && !session) router.push("/");

  return (
    <div className="bg-gray-900 flex-1 p-2 pb-24">
      <div className="w-full md:w-3/4 xl:w-1/3 mx-auto mt-2 sm:mt-16">
        {errors && <div ref={errorRef} className="bg-red-300 rounded-md text-center py-2 mb-3 font-semibold">
          {errors}
        </div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 bg-gray-800 md:rounded-lg shadow-md">
          {method === "edit" && (
            <div className="flex justify-end">
              <div
                className="rounded-md hover:bg-gray-700 transition p-3 flex items-center cursor-pointer"
                onClick={() => deleteTransaction({ variables: { id } })}
              >
                <Image src="/Trash_White.svg" width={20} height={20} />
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
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 grid-flow-row">
              {Object.keys(categories).map((e, categoryIdx) => (
                <Button
                  key={`category-${categoryIdx}`}
                  onClick={() => setForm({ ...form, category: e })}
                  type="button"
                  className={`${form.category === e
                    ? "bg-green-700 text-gray-100"
                    : "bg-white hover:bg-green-100 transition"
                    } p-2 rounded-md shadow-md whitespace-nowrap transition text-sm ${e.length > 12 && "col-span-2"} row-span-1`}
                >
                  {capitalize(e)}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <div className="flex mb-2">
              {/* <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 grid-flow-row my-1"> */}
              <Select onChange={(e) => setForm({ ...form, subcategory: e.target.value })} value={form.subcategory}>
                {subcategories?.get_client_categories?.sort().map((e: string, subcategoryIndex: number) => (
                  <option
                    key={`subcategory-${subcategoryIndex}`}
                    // onClick={() => setForm({ ...form, subcategory: e })}
                    // type="button"
                    value={e}
                  // className={`${form.subcategory === e
                  //   ? "bg-green-700 text-gray-100"
                  //   : "bg-white hover:bg-green-100 transition"
                  //   } p-2 rounded-md shadow-md whitespace-nowrap transition text-sm ${e.length > 12 && "col-span-2"} row-span-1`}
                  >
                    {capitalize(e)}
                  </option>
                ))}
                <option value="custom">
                  Custom
                </option>
              </Select>
              {/* {subcategories?.get_client_categories?.sort().map((e: string, subcategoryIndex: number) => (
                <Button
                  key={`subcategory-${subcategoryIndex}`}
                  onClick={() => setForm({ ...form, subcategory: e })}
                  type="button"
                  className={`${form.subcategory === e
                    ? "bg-green-700 text-gray-100"
                    : "bg-white hover:bg-green-100 transition"
                    } p-2 rounded-md shadow-md whitespace-nowrap transition text-sm ${e.length > 12 && "col-span-2"} row-span-1`}
                >
                  {capitalize(e)}
                </Button>
              ))} */}
              {/* <Button
                onClick={() => setForm({ ...form, subcategory: "custom" })}
                type="button"
                className={`${form.subcategory === "custom"
                  ? "bg-green-700 text-gray-100"
                  : "bg-white hover:bg-green-100 transition"
                  } p-2 rounded-md shadow-md whitespace-nowrap transition text-sm row-span-1`}
              >
                Custom
              </Button> */}
            </div>
            {form.subcategory === "custom" && <Input onChange={handleChange} placeholder="New subcategory" type="text" name="new_subcategory" />}
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
          {/* <div>
            <Label>Note</Label>
            <Input
              placeholder="Note"
              type="text"
              name="note"
              onChange={handleChange}
              value={form.note}
            />
          </div> */}
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              name="created_at"
              onChange={handleChange}
              value={form.created_at}
            />
          </div>
          <div className="flex flex-col items-center">
            <Label>Taxable?</Label>
            <Checkbox
              className="w-7 h-7"
              name="taxable"
              value={form.taxable}
              onClick={() => setForm({ ...form, taxable: !form.taxable })}
            />
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
      </div>
    </div >
  );
}

export const getServerSideProps = async (req, res) => {
  const {
    query: [method, id],
  } = req.query;

  return { props: { method, id: id ?? "" } };
};
