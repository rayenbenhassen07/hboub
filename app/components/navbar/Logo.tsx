'use client';
import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();

  return (
    <Image
    onClick={()=>router.push('/')}
    src="/images/logo4.png"
    alt="Logo"
    width={150}
    height={100}
    className="hidden md:block cursor-pointer"
    />
  )
}

export default Logo