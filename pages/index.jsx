import _ from "lodash";
import { useState, useEffect } from "react";
import Loading from "@components/Loading";
import TransactionCard from "@components/TransactionCard";
import { useSession } from "next-auth/client";
import { PieChart, Pie, Legend, Cell, Tooltip, XAxis, Label } from "recharts";
import { useRouter } from "next/router";
import Header from "@components/Header";
import { Select } from "@components/FormComponents";
import useClient from "@utils/useClient";
import { categories } from "@components/TransactionCard";

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

const renderLegend = ({ payload }) => {
  return (
    <ul className="flex flex-wrap text-gray-200 mt-16 gap-5 justify-center">
      {payload.map(({ payload }, index) => (
        <li key={`item-${index}`} className="flex items-center">
          <div
            className="w-4 h-4 border border-white rounded-full mr-2"
            style={{ backgroundColor: payload.fill }}
          ></div>
          <p className="capitalize">{payload.key}</p>
        </li>
      ))}
    </ul>
  );
};

const capitalize = (str) =>
  str
    .split(" ")
    .map((e) => e[0].toUpperCase() + e.slice(1))
    .join(" ");

const BLUES = ["#03dffc", "#038cfc", "#59b4ff", "#5988ff"];
const REDS = ["#ff597a", "#a6334a"];
const GREENS = ["#47ba79"];
const YELLOWS = ["#fcba03"];
const COLOURS = _.shuffle([...BLUES, ...REDS, ...GREENS, ...YELLOWS]);
const Chart = (props) => {
  return (
    <div>
      <PieChart width={props.width} height={props.height}>
        <Pie
          data={props.data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={props.radius}
          fill="#8884d8"
          label={props.label}
        >
          {props.data.map((_, index) => (
            <Cell
              key={`pie-slice-${index}`}
              fill={COLOURS[index % COLOURS.length]}
            />
          ))}
        </Pie>
      </PieChart>
      {props.legend && <div>Legend</div>}
    </div>
  );
};

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [timePeriod, setTimePeriod] = useState("week");
  const [data, refetch] = useClient();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

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
  )
    .filter(([key]) => Object.keys(categories).includes(key))
    .map(([key, val]) => ({
      key,
      value: +val
        .map((e) => e.amount)
        .reduce((a, b) => a + b, 0)
        .toFixed(2),
    }));

  return (
    <div className="bg-gray-900 flex flex-1 items-center min-h-screen flex-col p-1 pb-20 sm:pb-0">
      <Header title="Home" />
      {data.get_client.transactions.length === 0 && (
        <h2 className="text-4xl text-gray-200 font-semibold mt-6">No Data</h2>
      )}
      {data.get_client.transactions.length > 0 && (
        <>
          <p className="text-4xl text-white font-sans">
            ${(revenue_total - expense_total).toLocaleString()}
          </p>
          <div className="flex flex-row gap-x-5">
            <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
              <p className="text-gray-500">Inc:</p>
              <p className="text-green-500">
                ${revenue_total?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
              <p className="text-gray-500">Exp:</p>
              <p className="text-red-500">${expense_total?.toLocaleString()}</p>
            </div>
          </div>

          <div className="block md:hidden">
            <Chart
              width={350}
              height={400}
              data={grouped_transactions}
              radius={150}
              legend
            />
          </div>
          <div className="hidden md:block">
            <Chart
              width={700}
              height={500}
              data={grouped_transactions}
              radius={175}
              label={(e) =>
                `${capitalize(e.key)} | ${+(e.percent * 100).toFixed(2)}%`
              }
            />
          </div>
        </>
      )}

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
        {/* Sort items in reverse-chronological order */}
        {data?.get_client?.transactions
          ?.slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((e, index) => (
            <div key={`transaction-card-${index}`}>
              <TransactionCard {...e} className="flex-1" />
            </div>
          ))}
      </div>
    </div>
  );
}
