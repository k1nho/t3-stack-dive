// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { guestBookRouter } from "./guestbook";
import { todoRouter } from "./todo";


export const appRouter = createRouter()
  .transformer(superjson)
  .merge("guestbook.", guestBookRouter)
  .merge("todo.", todoRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
