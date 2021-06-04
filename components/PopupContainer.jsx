export default function PopupContainer({ children, setOpen, passRef }) {
    return (
      <div
        className="absolute bg-gray-900 bg-opacity-60 top-0 left-0 right-0 bottom-0 z-20"
        onClick={(e) => {
          if (passRef?.current && !passRef?.current.contains(e.target))
            setOpen(false);
        }}
      >
        {children}
      </div>
    );
  }