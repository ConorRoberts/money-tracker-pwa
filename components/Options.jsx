import { useState, useRef,useEffect } from "react";
import PopupContainer from "@components/PopupContainer";
import Image from "next/image";

export default function Options({ setOpen }) {
  const [selected, setSelected] = useState(false);

  const ref = useRef(null);

  useEffect(() => ref?.current?.scrollIntoView({ behavior: "smooth" }), []);

  return (
    <PopupContainer setOpen={setOpen} passRef={ref}>
      <div className="flex justify-center mt-10" ref={ref}>
        <div className="box-border h-50 w-96 border-0 bg-gray-700 rounded-lg font-thin text-white">
          <div className="flex justify-between">
            <div
              onClick={() => setOpen(!open)}
              className="cursor-pointer justify-self-end"
            >
              <Image src="/Icon_Close.svg" width={55} height={55} />
            </div>
          </div>
          <div className="flex justify-between">
            {/* Left side */}
            <div>
              <div className="flex pl-4 pb-2">
                <p>Order by</p>
                <select className="box-border h-7 w-40 rounded-lg font-thin text-black ml-2">
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                </select>
              </div>
              <div className="flex pl-4 pr-4 pb-2">
                <p>Search </p>
                <input
                  class=" box-border h-7 w-40 ml-6 rounded-lg pl-2 pb-2 pt-1 text-gray-700"
                  type="text"
                  placeholder="Search"
                ></input>
              </div>
              <div className="flex pl-4 pr-4">
                <p>Field</p>
                <select className="box-border h-7 w-40 rounded-lg font-thin text-black ml-9">
                  <option>Note</option>
                  <option>Category</option>
                  <option>Type</option>
                </select>
              </div>
            </div>

            {/* Right side */}
            <div>
              <div className="flex flex-col">
                <div className="ml-6">
                  <p>Layout</p>
                </div>
                <div className="mr-5">
                  {selected && (
                    <div
                      onClick={() => setSelected(!selected)}
                      className="cursor-pointer"
                    >
                      <Image src="/Layout_Full.svg" height={100} width={100} />
                    </div>
                  )}

                  {!selected && (
                    <div
                      onClick={() => setSelected(!selected)}
                      className="cursor-pointer"
                    >
                      <Image
                        src="/Layout_Compact.svg"
                        height={100}
                        width={100}
                      />
                    </div>
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
