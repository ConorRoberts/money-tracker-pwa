import Link from "next/link";
import { useSession } from "next-auth/client";

export default function Navigation() {
  const [session, _] = useSession();

  const ROUTES = [
    {
      path: "/",
      text: "Home",
      icon: "/Home.svg",
    },
  ];
  const LOGGED_IN_LINKS = [
    {
      path: "/transaction-form/new",
      text: "Form",
      icon: "/Plus.svg",
    },
    {
      path: "/api/auth/signout",
      text: "Logout",
      icon: "/Person.svg",
    },
  ];
  const LOGGED_OUT_LINKS = [
    {
      path: "/login",
      text: "Login",
      icon: "/Person.svg",
    },
  ];

  const link_style =
    "cursor-pointer p-3 rounded-sm hover:bg-gray-900 transition duration-100 block";

  return (
    <div className="bg-gray-800 text-white font-thin text-lg flex justify-center sm:justify-end px-10 items-start sm:items-center fixed bottom-0 w-full pb-6 sm:pb-0 sm:static z-50">
      <ul className="flex list-none gap-10 sm:gap-0">
        {[
          ...ROUTES,
          ...(() => (session ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS))(),
        ].map(({ path, text }, index) => (
          <li key={`nav-bar-route-${index}`} className="block">
            <Link href={path}>
              <a className={link_style}>{text}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
