import categories from "@utils/categories";

export default function CustomLegend ({ data }) {
    return (
      <ul className="flex flex-wrap gap-3 animate-fade-in">
        {data
          .sort((a: any, b: any) => {
            const total = data
              .map((e: any) => e.value)
              .reduce((a: number, b: number) => a + b, 0);
  
            return b.value / total - a.value / total;
          })
          .map((e: any, index: number) => {
            const total = data
              .map((e: any) => e.value)
              .reduce((a: number, b: number) => a + b, 0);
  
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
      </ul>)
  }