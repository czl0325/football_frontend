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
  match.europe_companies = (JSON.parse(localStorage.getItem("check_europe") ?? "[]"))
  match.asia_companies = (JSON.parse(localStorage.getItem("check_asia") ?? "[]"))
  match.size_companies = (JSON.parse(localStorage.getItem("check_size") ?? "[]"))
  match.asia_compose_size = localStorage.getItem("asia_compose") === "true" || false
  match.size_compose_asia = localStorage.getItem("size_compose") === "true" || true
  return http1.post("/analysis/all", match)
}

export const getMatchesByDate = (date: string, pagination: IPaginationInfo) => {
  return http1.getList<IMatchInfo[]>(`/football/daily/${date}`, {}, pagination)
}
