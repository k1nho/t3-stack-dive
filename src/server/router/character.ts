import { createRouter } from "./context"
import { z } from "zod"


export const characterRouter = createRouter()
  .query("getCharacters", {
    async resolve() {
      return [
        { character: "Denji", power: 5000, def: 2000 },
        { character: "Power", power: 3000, def: 3000 },
        { character: "Makima", power: 50000, def: 450000 },
      ]
    }
  })
