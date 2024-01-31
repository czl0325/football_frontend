import { defineStore } from "pinia"
import { IMatchInfo } from "../models/match.ts"

export const useMatchStore = defineStore({
  id: "currentMatch",
  state: () => ({
    match: {} as IMatchInfo
  }),
  actions: {

  }
})
