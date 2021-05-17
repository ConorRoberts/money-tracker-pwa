export const Button = (props) => {
  return (
    <button className="p-3 rounded-md bg-indigo-400" {...props}>
      {props.children}
    </button>
  );
};
