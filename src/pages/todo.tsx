import { NextPage } from "next";
import { trpc } from "../utils/trpc";

const TodoPage : NextPage = () => {
    return(
        <div className="flex flex-col justify-center min-h-screen">
            <Todos/>
        </div>
    )
}

const Todos : React.FC = () => {
    const {data: todos , isLoading} = trpc.useQuery(["todo.getTodos"]);

    if(isLoading){
        return <div>Loading ...</div>
    }

    return(
        <div className="flex flex-col justify-center items-center">
            {todos?.map((todo) => {
                return(
                    <div key={todo.id} className="flex">
                        <p>{todo.task}</p>
                        <input type="checkbox" />
                    </div>
                )
            })}
        </div>
    )
}

export default TodoPage;