import { useEffect } from "react";

export default function PopupContainer({ children, setOpen, passRef }) {
  
  useEffect(() => passRef?.current?.scrollIntoView({ behavior: "smooth" }), []);

  const handleEvent = (e:any) => {
    if (passRef?.current && !passRef?.current.contains(e.target))
      setOpen(false);
  }

  return (
    <div
      className="fixed bg-gray-900 bg-opacity-60 top-0 left-0 right-0 bottom-0 z-20"
      onMouseDown={handleEvent}
      onTouchStart={handleEvent}
    >
      {children}
    </div>
  );
}
