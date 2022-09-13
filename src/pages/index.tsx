import { signIn , signOut, useSession} from "next-auth/react";
import { NextPage } from "next";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const {data: session, status} = useSession();

  if(status === "loading"){
    return(
      <main className="flex flex-col items-center pt-4">
        Loading ...
      </main>
    )
  }

  return(
    <main className="flex flex-col items-center">
      <h1 className="text-3xl pt-4">Guesbook</h1>
      {
        session ? (
          <div className="pt-10">
            <p>Hello {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>
            <div className="pt-10">
              <Messages/>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => signIn("discord")}>
              Login With Discord
            </button>
            <div className="pt-10">
              <Messages/>
            </div>
          </div>
        )
      }
    </main>
  );
};

const Messages : React.FC = () =>{
  const {data: messages, isLoading} = trpc.useQuery(["guestbook.getAll"])

  if(isLoading) return <div>Fetching Messages</div>

  return(
    <div className="flex flex-col gap-4">
      {messages?.map((msg, index) => {
        return(
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