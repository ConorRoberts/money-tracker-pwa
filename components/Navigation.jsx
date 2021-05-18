import Link from "next/link";

const ROUTES = [
  {
    path: "/",
    text: "Home",
  },
];

export default function Navigation() {
  return (
    <div className="bg-gray-800 text-white font-thin text-lg flex justify-end px-10">
      <ul className="flex list-none">
        {ROUTES.map(({ path, text }) => (
          <li className="cursor-pointer p-3 rounded-md hover:bg-gray-900 transition-all">
            <Link href={path}>{text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
