import Image from "next/image";

export const Button = (props) => {
  return (
    <button
      {...props}
      className={`p-3 rounded-md appearance-none ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export const Input = (props) => {
  return (
    <input
      {...props}
      className={`p-2 font-thin text-lg shadow-md rounded-md appearance-none ${props.className}`}
    />
  );
};
export const Checkbox = (props) => {
  return (
    <div
      {...props}
      className={`relative rounded-md cursor-pointer flex justify-center items-center ${props.className}`}
    >
      {/* Checkmark */}
      {props.value ? <Image width={35} height={35} src="/Check.svg" /> : null}
    </div>
  );
};

export const Select = (props) => {
  return (
    <select
      {...props}
      className={`p-3 font-thin rounded-md shadow-md appearance-none ${props.className}`}
    >
      {props.children}
    </select>
  );
};
