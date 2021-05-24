import _ from "lodash";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Loading from "@components/Loading";
import TransactionCard from "@components/TransactionCard";
import { useSession } from "next-auth/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useRouter } from "next/router";
import Header from "@components/Header";
import { Select } from "@components/FormComponents";

const GET_USER_DATA = gql`
  query getUserData($id: String!) {
    get_client(id: $id) {
      transactions {
        id
        note
        category
        amount
        created_at
        taxable
        type
      }
    }
  }
`;

const CustomTooltip = ({ p: { payload } = {} }) => {
  return (
    <div className="bg-white bg-opacity-90 p-3 shadow-md rounded-sm border-indigo-200 border">
      <p>
        <span className="mr-2 font-semibold">Category:</span> {payload?.key}
      </p>
      <p>
        <span className="mr-2 font-semibold">Value:</span> ${payload?.value}
      </p>
    </div>
  );
};

const Chart = (props) => {
  return (
    <BarChart {...props}>
      <Bar barSize={15} dataKey="value" fill="#ffffff" />
      <YAxis dataKey="value" />
      <XAxis dataKey="key" />
      <Tooltip
        cursor={{ fill: "transparent" }}
        content={({ payload: [p] }) => <CustomTooltip p={p} />}
      />
    </BarChart>
  );
};

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();

  const [timePeriod, setTimePeriod] = useState("week");

  const { data } = useQuery(GET_USER_DATA, {
    variables: { id: session?.user.id ?? " " },
  });

  if (!loading && !session) router.push("/login");
  if (loading || !data || !session) return <Loading />;

  const revenue_total = data?.get_client?.transactions
    .filter((e) => e?.category?.toLowerCase() == "revenue")
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);

  const expense_total = data?.get_client?.transactions
    .filter((e) => e?.category?.toLowerCase() !== "revenue")
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);

  const grouped_transactions = Object.entries(
    _.groupBy(data?.get_client?.transactions, "category")
  ).map(([key, val]) => ({
    key,
    value: val.map((e) => e.amount).reduce((a, b) => a + b, 0),
  }));

  return (
    <div className="bg-gray-900 flex items-center min-h-screen flex-col p-1 pb-20 sm:pb-0">
      <Header title="Home" />
      <p className="text-4xl text-white font-sans">
        ${(revenue_total - expense_total).toLocaleString()}
      </p>
      <div className="flex flex-row gap-x-5">
        <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
          <p className="text-gray-500">Inc:</p>
          <p className="text-green-500">${revenue_total?.toLocaleString()}</p>
        </div>
        <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
          <p className="text-gray-500">Exp:</p>
          <p className="text-red-500">${expense_total?.toLocaleString()}</p>
        </div>
      </div>

      <div className="block md:hidden">
        <Chart width={400} height={400} data={grouped_transactions} />
      </div>
      <div className="hidden md:block">
        <Chart width={600} height={400} data={grouped_transactions} />
      </div>

      {/* <div className="flex justify-center items-center w-full">
        <Select className="w-3/4 sm:w-1/4">
          {["day", "week", "month", "year"].map((e, index) => (
            <option
              key={`${e}-${index}`}
              value={e}
              onChange={(e) => setTimePeriod(e.target.value)}
            >
              {e}
            </option>
          ))}
        </Select>
      </div> */}

      <div
        name="transactions"
        className="flex flex-wrap flex-col sm:flex-row gap-4 sm:gap-10 justify-center mt-5 w-full"
      >
        {data?.get_client?.transactions?.map((e, index) => (
          <TransactionCard
            {...e}
            key={`transaction-card-${index}`}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  );
}
