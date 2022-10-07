import { signIn, signOut, useSession } from "next-auth/react";
import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import Link from "next/link"

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("")
  const ctx = trpc.useContext();
  const postMessage = trpc.useMutation("guestbook.postMessage", {
    onMutate: () => {
      ctx.cancelQuery(["guestbook.getAll"])

      const optimisticUpdate = ctx.getQueryData(["guestbook.getAll"])
      if (optimisticUpdate) {
        ctx.setQueryData(["guestbook.getAll"], optimisticUpdate)
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["guestbook.getAll"])
    }
  })


  if (status === "loading") {
    return (
      <main className="flex flex-col items-center pt-4">
        Loading ...
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl pt-4">Guesbook</h1>
      <Link href="/todos">
        <a>Go to todos</a>
      </Link>
      {
        session ? (
          <div className="pt-10">
            <p>Hello {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>
            <div className="pt-6">
              <form className="flex gap-2" onSubmit={(e) => {
                e.preventDefault();
                postMessage.mutate({
                  name: session.user?.name as string,
                  message
                });
                setMessage("");
              }}>
                <input type="text" className="px-4 py-2 rounded-md border-2 border-zinc-800 bg-neutral-900 focus:outline-none" placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button className="p-2 rounded-md border-2 border-zinc-800 focus:outline-none">Send</button>
              </form>
            </div>
            <div className="pt-10">
              <Messages />
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => signIn("discord")}>
              Login With Discord
            </button>
            <div className="pt-10">
              <Messages />
            </div>
          </div>
        )
      }
    </main>
  );
};

const Messages: React.FC = () => {
  const { data: messages, isLoading } = trpc.useQuery(["guestbook.getAll"])
  if (isLoading) return <div>Fetching Messages</div>

  return (
    <div className="flex flex-col gap-4">
      {messages?.map((msg, index) => {
        return (
          <div key={index}>
            <p>{msg.message}</p>
            <p>- {msg.name}</p>
          </div>
        )
      })}
    </div>
  )
}



export default Home;
