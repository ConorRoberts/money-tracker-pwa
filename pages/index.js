import { useUser } from '@auth0/nextjs-auth0';
import { Button } from '@components/FormComponents';
import Link from "next/link";

export default function Home() {
  const { user, error, isLoading } = useUser();
  console.log(user, error, isLoading);
  return (
    <div className="bg-indigo-300 flex justify-center items-center h-screen">
      <p className="text-3xl font-bold">
        Adrian has genital warts
      </p>

      <Button>
        <Link href="/api/auth/login">
          Login
        </Link>
      </Button>
    </div>
  )
}
