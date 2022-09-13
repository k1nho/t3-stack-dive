import { signIn , signOut, useSession} from "next-auth/react";
import { NextPage } from "next";

const Home: NextPage = () => {
  const {data: session, status} = useSession();

  if(status === "loading"){
    return(
      <main>
        Loading ...
      </main>
    )
  }

  return(
    <main>
      <h1>Guesbook</h1>
      {
        session ? (
          <div>
            <p>Hello {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => signIn("discord")}>
              Login With Discord
            </button>
          </div>
        )
      }
    </main>
  );
};

export default Home;