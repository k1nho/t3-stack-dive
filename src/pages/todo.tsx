import { NextPage } from "next";
import { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

const TodoPage : NextPage = () => {
    const [createWindow, setCreateWindow] = useState(false)
    const [todo, setTodo] = useState("");
    const ctx = trpc.useContext()
    const todoMutation = trpc.useMutation("todo.createTodo", {
        onMutate: () => {
            ctx.cancelQuery(["todo.getTodos"])
            const optimisticUpdate = ctx.getQueryData(["todo.getTodos"])
            if(optimisticUpdate){
                ctx.setQueryData(["todo.getTodos"], optimisticUpdate)
            }
        },
        onSettled : () => {
            ctx.invalidateQueries(["todo.getTodos"])
        }
        
    })

    const handleTodoPost = (e :FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        todoMutation.mutate({
            task: todo
        })
        setTodo("");
    }

    return(
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="bg-slate-200 rounded-md p-24 text-black">
            <div id="actions" className="flex gap-4 mb-4 text-white">
                <div className="rounded-md border-green-500 bg-green-500 p-2">
                    <button onClick={() => setCreateWindow(true)}>
                        Create Todo
                    </button>
                </div>
                <div className="rounded-md border-blue-500 bg-blue-500 p-2" >
                    <button>
                        Get Todo
                    </button>
                </div>
            </div>
            <Todos/>
            <div className="flex justify-center mt-4 rounded-md bg-amber-400 text-white">
                <a href="/" >HOME</a>
            </div>
                <form className={createWindow ? "flex items-center gap-4 mt-3 text-black" : "hidden"} onSubmit={(e) => handleTodoPost(e)}>
                <input type="text" placeholder="add todo" value={todo} onChange ={(e) => setTodo(e.target.value)} className=" p-2 rounded-md focus:outline-green-500"/>
                <div className="rounded-md px-3 py-1  bg-red-500 text-white cursor-pointer " onClick={() => setCreateWindow(false)}>
                   X 
                </div>
                </form>
            </div>
        </div>
    )
}

const Todos : React.FC = () => {
    const {data: todos , isLoading} = trpc.useQuery(["todo.getTodos"]);

    if(isLoading){
        return <div>Loading ...</div>
    }

    return(
        <div className="flex flex-col justify-center items-start">
            {todos?.map((todo) => {
                return(
                    <div key={todo.id} className="flex gap-6">
                        <input type="checkbox" />
                        <p>{todo.task}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default TodoPage;