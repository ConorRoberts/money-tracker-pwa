import _ from "lodash";
import React, { useState, useEffect } from "react";
import Loading from "@components/Loading";
import TransactionCard from "@components/TransactionCard";
import Options from "@components/Options";

import { useSession } from "next-auth/client";
import Chart from "@components/Home/Chart";
import { useRouter } from "next/router";
import Header from "@components/Header";
import useClient from "@utils/useClient";
import Image from "next/image";
import capitalize from "@utils/capitalize";
import CompactTransactionCard from "@components/CompactTransactionCard";
import type Transaction from "@typedefs/transaction";
import getWeekStart from "@utils/getWeekStart";

const CARD_INCREMENT = 15;
const REFRESH_DELAY = 2500;

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [optionsState, setOptionsState] = useState({
    time_period: "month",
    time_period_start: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    ),
    compact: false,
    search: "",
    field: "",
    bounds: "25",
    month: "",
    day: "",
    year: "",
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
  console.log(data);

  if (!loading && !session) router.push("/login");
  if (loading || !data || !data?.get_client || !session) return <Loading />;


  const revenue_total = data?.get_client?.transactions
    .filter((e: any) => e?.type?.toLowerCase() === "revenue")
    .map((e: any) => e.amount)
    .reduce((a: number, b: number) => a + b, 0);

  const expense_total = data?.get_client?.transactions
    .filter((e: any) => e?.type?.toLowerCase() === "expense")
    .map((e: any) => e.amount)
    .reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="bg-gray-900 flex flex-1 items-center min-h-screen flex-col p-1 pb-20 sm:pb-0 relative" >
      <Header title="Home" />
      {data.get_client.transactions.length === 0 && (
        <h2 className="text-4xl text-gray-200 font-semibold mt-6">No Data</h2>
      )
      }
      {
        data.get_client.transactions.length > 0 && (
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
                width={window.innerWidth-10}
                height={400}
                data={getChartData(data?.get_client?.transactions)}
              // legend
              />
            </div>
            <div className="hidden md:block">
              <Chart
                width={700}
                height={500}
                data={getChartData(data?.get_client?.transactions)}
              // label={(e: any) =>
              //   `${capitalize(e.key)} | ${+(e.percent * 100).toFixed(2)}%`
              // }
              />
            </div>
          </>
        )
      }

      < div
        className={`flex flex-wrap flex-row gap-2 ${optionsState.compact ? "sm:gap-3" : "sm:gap-6"
          } justify-center mt-5 w-full`}
      >
        {/* Sort items in reverse-chronological order */}
        {
          data?.get_client?.transactions
            .slice(0, cardChunk)
            .map((e: any, index: number) =>
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
            )
        }
      </div >
      <div className="flex justify-center">
        <div
          className="bg-gray-800 p-3 rounded-md my-3 hover:bg-gray-600 transition cursor-pointer flex items-center"
          onClick={() => setCardChunk(cardChunk + CARD_INCREMENT)}
        >
          <Image src="/Plus.svg" width={25} height={25} />
        </div>
      </div>
    </div >
  );
}

/**
 * Formats a list of transactions so that their data can be used by the charts
 * @param transactions 
 * @returns 
 */
const getChartData = (transactions: Transaction[]): { key: string, revenue: number, expense: number }[] => {

  const getSum = (list: Transaction[], type: string): number => {
    return +list.filter((e: Transaction) => e.type === type).map((e: Transaction) => e.amount).reduce((a: number, b: number) => a + b, 0)
      .toFixed(2)
  }

  const groupedByDate = Object.entries(_.groupBy(transactions.map((e: any) => ({ ...e, created_at: getWeekStart(new Date(e.created_at.slice(0, 10))).toDateString() })), "created_at")).reverse();

  const groupedByType = groupedByDate.map(([key, value]: [key: string, value: Transaction[]]): { key: string, revenue: number, expense: number } => ({
    key: key.split(" ").slice(1, 3).join(" "), revenue: getSum(value, "revenue")
    , expense: getSum(value, "expense"),
  })).slice(-4);

  return groupedByType;
}
