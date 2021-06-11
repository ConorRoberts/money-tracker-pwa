import React, { useState } from "react";
import Image from "next/image";

export const Button = (props) => {
  const styles = "focus:ring-0 focus:outline-none appearance-none";
  return (
    <button
      {...props}
      className={
        props.className
          ? `${props.className} ${styles}`
          : `px-4 py-2 rounded-md transition ${styles}`
      }
      type={props.type ?? "button"}
    >
      {props.children}
    </button>
  );
};

export const Input = (props) => {
  return (
    <input
      {...props}
      className={`bg-white rounded-md w-full border border-gray-300 py-1 px-2 focus:ring-1 focus:outline-none appearance-none ${props.className}`}
    />
  );
};

export const TextArea = (props) => {
  return (
    <textarea
      {...props}
      className={`rounded-md w-full py-1 px-2 border border-gray-300 focus:ring-1 focus:outline-none bg-white ${props.className}`}
    />
  );
};
export const Select = (props) => {
  const [open, setOpen] = useState(false);

  const onBlur = (e) => {
    if (props.onBlur) props?.onBlur(e);
    if (open) {
      setOpen(!open);
    }
  };
  const onClick = (e) => {
    if (props.onClick) props?.onClick(e);
    setOpen(!open);
  };

  return (
    <div className={`relative w-full flex items-center`}>
      <select
        className={`py-1 px-2 w-full rounded-md appearance-none focus:ring-1 focus:outline-none border border-gray-300 bg-white`}
        {...props}
        onBlur={onBlur}
        onClick={onClick}
      >
        {props.children}
      </select>
      <div
        className={`absolute right-1 top-0 flex items-center bottom-0 transform transition-transform duration-75 ${
          open && "rotate-180"
        }`}
      >
        <Image width={22} height={22} src="/Arrow_Down.svg" />
      </div>
    </div>
  );
};

export const Label = ({ children, className }) => {
  return (
    <p className={`text-lg font-semibold text-gray-100 ${className}`}>
      {children}
    </p>
  );
};

export const Checkbox = (props) => {
  return (
    <div
      {...props}
      className={`relative cursor-pointer w-5 h-5 bg-white rounded-sm ${props.className}`}
    >
      <input
        type="checkbox"
        className={`rounded-md cursor-pointer appearance-none`}
      />
      {/* Checkmark */}
      <div
        className={`absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 filter ${
          props.value ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image layout="fill" src="/Check.svg" priority />
      </div>
    </div>
  );
};

export const Tooltip = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative inline-block p-1"
      onMouseOver={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Image
        src="/graphics/Tooltip.svg"
        width={25}
        height={25}
        className="cursor-pointer"
      />
      {visible && (
        <div className="absolute top-0 right-0 p-2 rounded-md bg-gray-800 text-gray-100 bg-opacity-95 border border-gray-600 w-48 font-medium shadow-md z-10">
          {props.text}
        </div>
      )}
    </div>
  );
};
