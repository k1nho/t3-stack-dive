// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { guestBookRouter } from "./guestbook";
import { todoRouter } from "./todo";
import { characterRouter } from "./character";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("guestbook.", guestBookRouter)
  .merge("todo.", todoRouter)
  .merge("character.", characterRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
