import Layout from "@/components/Layout";
import {useSession} from "next-auth/react";
import Image from 'next/image';

export default function Home() {
  const {data: session} = useSession();
  return <Layout>
    <div className="text-blue-900 flex justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-1 text-black rounded-lg overflow-hidden">
        <img src={session?.user?.image} alt="" className="w-6 h-6"/>
        <span className="px-2">
          {session?.user?.name}
        </span>
      </div>
    </div>
    <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
        <Image
            src="/welcomeimg.svg"
            width={1000}
            height={900}
            className=""
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
  </Layout>
}
