import { useRef } from "react";
import PopupContainer from "@components/PopupContainer";
import Image from "next/image";
import { AiOutlineClose as CloseIcon } from "react-icons/ai";
import { Label, Button } from "@components/FormComponents";

export default function Options({ setOpen, setState, state }) {
  const ref = useRef(null);

  return (
    <PopupContainer setOpen={setOpen} passRef={ref}>
      <div className="flex justify-center p-2" ref={ref}>
        <div className="bg-gray-800 border border-gray-700 bg-opacity-80 rounded-lg px-4 py-2 w-full md:w-2/3 lg:w-1/2 relative">
          <div className="flex justify-end mb-1">
            <div
              onClick={() => setOpen(!open)}
              className="cursor-pointer p-2 hover:bg-gray-600 rounded-lg flex items-center transition"
            >
              {/* <Image src="/CloseIcon.svg" priority width={13} height={13} /> */}
              <CloseIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <Label>Time Period</Label>
              <div className="flex justify-center gap-3 flex-wrap">
                {["all time", "year", "month", "day"].map((e, index) => (
                  <Button
                    key={`time-${index}`}
                    className={` ${state.time_period === e
                      ? "bg-green-700 text-gray-100"
                      : "bg-white"
                      } rounded-md px-3 py-2 capitalize font-semibold transition`}
                    onClick={() => setState({ ...state, time_period: e })}
                  >
                    {e}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-start md:items-center gap-2">
              <Label>Layout</Label>
              <div className="flex justify-center">
                <div
                  onClick={() => setState({ ...state, compact: !state.compact })}
                  className="cursor-pointer hover:bg-gray-500 rounded-lg transition p-2"
                >
                  {state.compact ? (
                    <Image src="/Layout_Full.svg" width={150} height={50} priority />
                  ) : (
                    <Image src="/Layout_Compact.svg" width={150} height={50} priority />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopupContainer>
  );
}
