import { useRef } from "react";
import PopupContainer from "@components/PopupContainer";
import Image from "next/image";
import { Input } from "./FormComponents";
import { Select } from "./FormComponents";
import { Label } from "./FormComponents";

export default function Options({ setOpen, setState, state }) {
  const ref = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  return (
    <PopupContainer setOpen={setOpen} passRef={ref}>
      <div className="flex justify-center mt-10" ref={ref}>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-end">
            <div
              onClick={() => setOpen(!open)}
              className="cursor-pointer p-2 hover:bg-gray-600 rounded-lg flex items-center transition"
            >
              <Image src="/Minus.svg" priority width={20} height={20} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex">
                <Label className="w-1/3">Order by</Label>
                <Select
                  className="w-2/3"
                  onChange={handleChange}
                  name="timePeriod"
                  value={state.timePeriod}
                >
                  <option value="week">Week</option>
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                </Select>
              </div>
              <div className="flex">
                <Label className="w-1/3">Search </Label>
                <Input
                  type="text"
                  placeholder="Search"
                  onChange={handleChange}
                  name="search"
                  className="w-2/3"
                  value={state.search}
                />
              </div>
              <div className="flex">
                <Label className="w-1/3">Field</Label>
                <Select
                  className="w-2/3"
                  onChange={handleChange}
                  name="field"
                  value={state.field}
                >
                  <option value="note">Note</option>
                  <option value="category">Category</option>
                  <option value="type">Type</option>
                </Select>
              </div>
              <div className="flex">
                <Label className="w-1/3">Bounds</Label>
                <Select
                  className="w-2/3"
                  onChange={handleChange}
                  name="bounds"
                  value={state.bounds}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="250">250</option>
                  <option value="500">500</option>
                  <option value="all">No Limit</option>
                </Select>
              </div>
            </div>

            <div className="flex flex-col justify-start items-center gap-2">
              <Label>Layout</Label>
              <div
                onClick={() => setState({ ...state, compact: !state.compact })}
                className="cursor-pointer hover:bg-gray-600 rounded-lg transition p-2"
              >
                {state.compact ? (
                  <Image src="/Layout_Full.svg" width={115} height={40} />
                ) : (
                  <Image src="/Layout_Compact.svg" width={115} height={40} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PopupContainer>
  );
}
