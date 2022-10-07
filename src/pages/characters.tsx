import { NextPage } from "next";
import { trpc } from "../utils/trpc";

interface Toy {
  character: string,
  power: number,
  def: number,
}


const CharactersPage: NextPage = () => {
  const { data: characters, isLoading } = trpc.useQuery(["character.getCharacters"])

  if (isLoading) {
    return (
      <>
        Loading ...
      </>
    )
  }

  return (
    <div>
      {characters?.map((character) => {
        return (
          <div key={character.character}>
            {character.character}
          </div>
        )
      })}
    </div>
  )
}

export default CharactersPage;



export const Character: React.FC<Toy> = ({ character, power, def }) => {
  return (
    <div className="flex justify-center">
      <p>
        {character}
      </p>
      <p>
        {power}
      </p>
      <p>
        {def}
      </p>
    </div>
  )
}

