export const Button = (props) => {
  return (
    <button className={`p-3 rounded-md bg-indigo-400 ${props.className}`} {...props}>
      {props.children}
    </button>
  );
};

export const Input = (props) => {
  return (
    <input
      className={`p-2 font-thin text-lg shadow-md rounded-md ${props.className}`}
      {...props}
    />
  );
};

export const Select = (props) => {
  return (
    <select
      className={`p-3 font-thin rounded-md shadow-md ${props.className}`}
      {...props}
    >
      {props.children}
    </select>
  );
};
