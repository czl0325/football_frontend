import { http1, IPaginationInfo } from "../http.ts"
import { IMatchInfo } from "../../models/match.ts"

export const testAPI = () => {
  return http1.get("/football/test")
}

export const getMatchList = () => {
  return http1.get<IMatchInfo[]>("/football/matches")
}

export const getMatchInfo = (fid: string) => {
  return http1.get<IMatchInfo>(`/analysis/info`, { fid })
}

export const analysisMatch = (match: IMatchInfo) => {
  return http1.post("/analysis/all", match)
}

export const getMatchesByDate = (date: string, pagination: IPaginationInfo) => {
  return http1.getList<IMatchInfo[]>(`/football/daily/${date}`, {}, pagination)
}
