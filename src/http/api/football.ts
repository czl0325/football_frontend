import _ from "lodash"
import { http1, IPaginationInfo } from "../http.ts"
import { IMatchInfo } from "../../models/match.ts"

export const testAPI = () => {
  return http1.get("/football/test")
}

export const getMatchList = (type = "all") => {
  return http1.get<IMatchInfo[]>("/football/matches", { type })
}

export const getMatchInfo = (fid: string) => {
  return http1.get<IMatchInfo>(`/analysis/info`, { fid })
}

export const analysisMatch = (match: IMatchInfo) => {
  match.europe_companies = (JSON.parse(localStorage.getItem("check_europe") ?? "[]"))
  match.asia_companies = (JSON.parse(localStorage.getItem("check_asia") ?? "[]"))
  match.size_companies = (JSON.parse(localStorage.getItem("check_size") ?? "[]"))
  match.asia_compose_size = localStorage.getItem("asia_compose") === "0" ? 0 : 1
  match.size_compose_asia = localStorage.getItem("size_compose") === "0" ? 0 : 1
  match.asia_nonMainstream = localStorage.getItem("asia_nonMainstream") === "0" ? 0 : 1
  match.size_nonMainstream = localStorage.getItem("size_nonMainstream") === "0" ? 0 : 1
  match.no_friend_match = localStorage.getItem("no_friend_match") === "0" ? 0 : 1
  match.asia_filter_odds = localStorage.getItem("asia_filter_odds") === "0" ? 0 : 1
  match.size_filter_odds = localStorage.getItem("size_filter_odds") === "0" ? 0 : 1
  return http1.post("/analysis/all", match)
}

export const getMatchesByDate = (date: string, pagination: IPaginationInfo) => {
  return http1.getList<IMatchInfo[]>(`/football/daily/${date}`, {}, pagination)
}

export const getOddsTrendByCompany = (match: IMatchInfo, type: number, company: string) => {
  const tempMatch = _.cloneDeep(match)
  delete tempMatch.europe_matches
  delete tempMatch.asia_matches
  delete tempMatch.size_matches
  delete tempMatch.europe_score_list
  delete tempMatch.asia_score_list
  delete tempMatch.size_score_list
  if (type === 1) {

  } else {
    return http1.post<any>("/analysis/asia_trend", {
      ...tempMatch,
      company
    })
  }
}
