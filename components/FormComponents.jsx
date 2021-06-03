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
      className={`p-2 shadow-md rounded-md appearance-none ${props.className}`}
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
      {props.value ? <Image layout="fill" src="/Check.svg" /> : null}
    </div>
  );
};

export const Select = (props) => {
  return (
    <select
      {...props}
      className={`p-3 rounded-md appearance-none ${props.className}`}
    >
      {props.children}
    </select>
  );
};
