import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend, Tooltip } from "recharts";
import capitalize from "@utils/capitalize";
import _ from "lodash";
import { useState } from "react";
import { useEffect } from "react";
import { AiOutlineArrowUp as ArrowUp, AiOutlineArrowDown as ArrowDown } from "react-icons/ai";

export interface ChartData {
  key: string,
  revenue: number,
  expense: number
}

const CustomTooltip = ({ item, data }: { item: any, data: ChartData[] }) => {
  const { key = "None", revenue = 0, expense = 0 } = item.payload[0]?.payload ?? {};
  const index = _.findIndex(data, { key });

  const [expensePercentage, setExpensePercentage] = useState(null);
  const [revenuePercentage, setRevenuePercentage] = useState(null);

  useEffect(() => {
    const getRevenuePercentage = () => {
      const result = revenue / data[index - 1]?.revenue;

      if (isNaN(result) || result === Infinity || result === 0)
        return

      setRevenuePercentage(result * 100);
    }

    const getExpensePercentage = () => {
      const result = expense / data[index - 1]?.expense;

      if (isNaN(result) || result === Infinity || result === 0)
        return null
      setExpensePercentage(result * 100);
    }

    getRevenuePercentage();
    getExpensePercentage();

  })

  const getArrow = (n: number) => {
    if (n > 1) return <ArrowUp />
    if (n < 1) return <ArrowDown />
    return null;
  }

  return <div className="rounded-lg bg-gray-700 shadow-lg text-gray-100 p-2 flex flex-col gap-2">
    <p className="font-semibold mb-2">{capitalize(key)}</p>
    <div className="flex flex-col gap-1">
      <div className="justify-between flex gap-4 items-center">
        <p className="font-semibold">Revenue</p>
        <p className="bg-green-600 rounded-md py-1 px-2">{`$${revenue}`}</p>
      </div>
      {/* {revenuePercentage && revenuePercentage !== 1 &&
        <div className={`flex justify-center items-center rounded-md py-1 px-4 gap-2 font-semibold bg-gray-600`}>
          <div className={`p-px rounded-full text-xl ${revenuePercentage < 1 ? "bg-red-600" : "bg-green-600"}`}>
            {getArrow(revenuePercentage)}
          </div>
          <p>{`${revenuePercentage.toFixed(1)}%`}
          </p>

        </div>} */}
    </div>
    <div className="flex flex-col gap-1">
      <div className="justify-between flex gap-4 items-center">
        <p className="font-semibold">Expense</p>
        <p className="bg-red-600 rounded-md py-1 px-2">{`$${expense}`}</p>
      </div>
      {/* {expensePercentage && expensePercentage !== 1 &&
        <div className={`flex justify-center items-center rounded-md py-1 px-4 gap-2 font-semibold bg-gray-600`}>
          <div className={`p-px rounded-full text-xl ${expensePercentage < 1 ? "bg-green-600" : "bg-red-600"}`}>
            {getArrow(expensePercentage)}
          </div>
          <p>{`${expensePercentage.toFixed(1)}%`}
          </p>

        </div>} */}
    </div>
  </div>
}

export default function Chart({ width, height, data }: { width: number, height: number, data: ChartData[] }) {
  return (
    <div>
      <div className="flex justify-center">
        <LineChart width={width} height={height} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="key" />
          <YAxis />
          <Tooltip content={(e) => <CustomTooltip item={e} data={data} />} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#84d88b" strokeWidth={1} />
          <Line type="monotone" dataKey="expense" stroke="#f86a6a" />
        </LineChart>
      </div>
    </div>
  );
};