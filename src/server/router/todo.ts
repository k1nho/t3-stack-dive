import { createRouter } from "./context";
import { z } from "zod";

export const todoRouter = createRouter()
  .query("getTodos", {
    async resolve({ ctx }) {
    try {
       return await ctx.prisma.todo.findMany({
        select: {
          id: true,
          task: true,
          done: true,
       },
     });
        
    } catch (error) {
      console.log(error)   
    }
    },
  })
  .query("getTodo", {
    input: z.object({
        id: z.string()
    }),
    async resolve({ctx, input}){
        return await ctx.prisma.todo.findUnique({
            where:{
                id: input.id
            }
        })
    }
  })
  .mutation("createTodo", {
    input: z.object({
      task: z.string().min(5),
    }),
    async resolve({ ctx, input }) {
      try {
        return await ctx.prisma.todo.create({
          data: {
            task: input.task,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("updateTodo", {
    input : z.object({
        id: z.string()
    }),
    async resolve({ctx, input}){
        try {
            return await ctx.prisma.todo.update({
                where :{
                    id : input.id
                },
                data : {
                    done: true
                }
            })
        } catch (error) {
           console.log(error) 
        }
    }
  }).
  mutation("deleteTodo", {
    input : z.object({
        id: z.string()
    }),
    async resolve({ctx, input}){
        try {
            return await ctx.prisma.todo.delete({
                where: {
                    id: input.id
                }
            })
        } catch (error) {
            console.log(error)
        }
    } 
  })
  ;
