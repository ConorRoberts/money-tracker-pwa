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
      <div className="flex justify-center p-2" ref={ref}>
        <div className="bg-gray-700 rounded-lg px-4 py-2 w-full md:w-2/3 lg:w-1/2 relative">
          <div className="flex justify-end mb-1">
            <div
              onClick={() => setOpen(!open)}
              className="cursor-pointer p-3 hover:bg-gray-600 rounded-lg flex items-center transition"
            >
              <Image src="/CloseIcon.svg" priority width={13} height={13} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mb-5">
            <Label>Search</Label>
            <Input
              type="text"
              placeholder="Search"
              onChange={handleChange}
              name="search"
              value={state.search}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col sm:flex-row">
                <Label className="sm:w-1/3">Order by</Label>
                <div className="sm:w-2/3">
                  <Select
                    onChange={handleChange}
                    name="timePeriod"
                    value={state.timePeriod}
                  >
                    <option value="week">Week</option>
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Label className="sm:w-1/3">Field</Label>
                <div className="sm:w-2/3">
                  <Select
                    onChange={handleChange}
                    name="field"
                    value={state.field}
                  >
                    <option value="note">Note</option>
                    <option value="category">Category</option>
                    <option value="type">Type</option>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row">
                <Label className="sm:w-1/3">Limit</Label>
                <div className="sm:w-2/3">
                  <Select
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
