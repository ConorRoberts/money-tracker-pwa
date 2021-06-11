import _ from "lodash";
import { useState, useEffect } from "react";
import Loading from "@components/Loading";
import TransactionCard from "@components/TransactionCard";
import Options from "@components/Options";

import { useSession } from "next-auth/client";
import { PieChart, Pie, Cell } from "recharts";
import { useRouter } from "next/router";
import Header from "@components/Header";
import { Button } from "@components/FormComponents";
import useClient from "@utils/useClient";
import categories from "@utils/categories";
import Image from "next/image";
import capitalize from "@utils/capitalize";
import CompactTransactionCard from "@components/CompactTransactionCard";

const Chart = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex justify-center">
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
            {props.data.map(({ key }, index) => (
              <Cell
                key={`pie-slice-${index}`}
                fill={categories[key].colour ?? "#ff597a"}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
      {props.legend && (
        <div
          className={`flex flex-col bg-gray-800 p-3 rounded-md ${
            !open && "items-center bg-gray-900 mx-auto"
          }`}
        >
          <div className="flex justify-end mb-1">
            <Button
              onClick={() => setOpen(!open)}
              className="p-2 flex items-center gap-2 justify-center bg-gray-800 text-gray-100 hover:bg-gray-600 rounded-md transition"
            >
              <Image
                src={open ? "/Minus.svg" : "/Plus.svg"}
                width={20}
                height={20}
              />
              {!open && <p>Show Legend</p>}
            </Button>
          </div>
          {open && (
            <ul className="flex flex-wrap gap-3 animate-fade-in">
              {props.data
                .sort((a, b) => {
                  const total = props.data
                    .map((e) => e.value)
                    .reduce((a, b) => a + b, 0);

                  return b.value / total - a.value / total;
                })
                .map((e, index) => {
                  const total = props.data
                    .map((e) => e.value)
                    .reduce((a, b) => a + b, 0);

                  return (
                    <li
                      className="flex rounded-md bg-gray-700 p-2 justify-between items-center flex-1 whitespace-nowrap"
                      key={`legend-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border border-white mr-1"
                          style={{
                            backgroundColor:
                              categories[e.key].colour ?? "#ff597a",
                          }}
                        ></div>
                        <p className="capitalize font-semibold text-md text-gray-200">
                          {`${e.key}`}
                        </p>
                      </div>
                      <p className="capitalize font-medium text-md text-gray-200">
                        {`${((e.value / total) * 100).toFixed(2)}%`}
                      </p>
                    </li>
                  );
                })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

const CARD_INCREMENT = 15;
const REFRESH_DELAY = 2500;

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [optionsState, setOptionsState] = useState({
    timePeriod: "month",
    compact: false,
    search: "",
    field: "",
    bounds: "25",
  });
  const [data, refetch] = useClient({
    first: 0,
    last: optionsState.bounds === "all" ? -1 : +optionsState.bounds,
  });
  const [open, setOpen] = useState(false);
  const [cardChunk, setCardChunk] = useState(CARD_INCREMENT);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, REFRESH_DELAY);
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
    <div className="bg-gray-900 flex flex-1 items-center min-h-screen flex-col p-1 pb-20 sm:pb-0 relative">
      <Header title="Home" />
      {data.get_client.transactions.length === 0 && (
        <h2 className="text-4xl text-gray-200 font-semibold mt-6">No Data</h2>
      )}
      {data.get_client.transactions.length > 0 && (
        <>
          <div className="flex flex-col items-center gap-3">
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
                <p className="text-red-500">
                  ${expense_total?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-2 right-2 cursor-pointer">
            <Image
              onClick={() => setOpen(!open)}
              src="/Icon_Settings.svg"
              priority
              height={25}
              width={25}
            />
          </div>
          {open && (
            <Options
              setOpen={setOpen}
              state={optionsState}
              setState={setOptionsState}
            />
          )}

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

      <div
        name="transactions"
        className={`flex flex-wrap flex-row gap-2 ${
          optionsState.compact ? "sm:gap-3" : "sm:gap-6"
        } justify-center mt-5 w-full`}
      >
        {/* Sort items in reverse-chronological order */}
        {data?.get_client?.transactions
          .slice(0, cardChunk)
          .map((e, index) =>
            optionsState.compact ? (
              <CompactTransactionCard
                {...e}
                key={`transaction-card-${index}`}
              />
            ) : (
              <TransactionCard
                {...e}
                className="flex-1"
                key={`transaction-card-${index}`}
              />
            )
          )}
      </div>
      <div className="flex justify-center">
        <div
          className="bg-gray-800 p-3 rounded-md my-3 hover:bg-gray-600 transition cursor-pointer flex items-center"
          onClick={() => setCardChunk(cardChunk + CARD_INCREMENT)}
        >
          <Image src="/Plus.svg" width={25} height={25} />
        </div>
      </div>
    </div>
  );
}
