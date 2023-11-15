import { http1 } from "../http.ts"
import { IMatchInfo } from "../../models/match.ts"

export const getMatchList = () => {
  return http1.get<IMatchInfo[]>("/football/matches")
}

export const getMatchInfo = (fid: string) => {
  return http1.get<IMatchInfo>(`/analysis/info`, { fid })
}
