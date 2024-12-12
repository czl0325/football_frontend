export interface IMatchInfo {
  fid?: string;
  match_url?: string;
  match_group?: string;
  match_type?: string;
  match_category?: string;
  match_round?: string;
  match_time?: string;
  match_status?: string;
  home_team?: string;
  home_team_rank?: string;
  home_score?: string;
  visit_team?: string;
  visit_team_rank?: string;
  visit_score?: string;
  origin_pan_most?: number;
  origin_pan_home_map?: { [key: number]: number[] };
  origin_pan_visit_map?: { [key: number]: number[] };
  instant_pan_most?: number;
  instant_pan_home_map?: { [key: number]: number[] };
  instant_pan_visit_map?: { [key: number]: number[] };
  origin_size_most?: number;
  origin_size_home_map?: { [key: number]: number[] };
  origin_size_visit_map?: { [key: number]: number[] };
  instant_size_most?: number;
  instant_size_home_map?: { [key: number]: number[] };
  instant_size_visit_map?: { [key: number]: number[] };
  field_score?: string;
  match_filter?: string;
  europe_odds_items?: IEuropeOddsInfo[];
  asia_odds_items?: IAsiaOddsInfo[];
  size_odds_items?: ISizeOddsInfo[];
  europe_companies?: string[];
  asia_companies?: string[];
  size_companies?: string[];
  remark?: string;
  asia_compose_size?: number;
  size_compose_asia?: number;
  europe_matches?: string[];
  asia_matches?: string[];
  size_matches?: string[];
  asia_nonMainstream?: number;
  size_nonMainstream?: number;
  no_friend_match?: number;
  asia_filter_odds?: number;
  size_filter_odds?: number;

  asia_lose_all?: number;
  asia_lose_league?: number;
  asia_run_all?: number;
  asia_run_league?: number;
  asia_score_list?: any[];
  asia_win_all?: number;
  asia_win_league?: number;

  europe_win_all?: number;
  europe_win_league?: number;
  europe_even_all?: number;
  europe_even_league?: number;
  europe_lose_all?: number;
  europe_lose_league?: number;
  europe_score_list?: any[];

  size_big_all?: number;
  size_big_league?: number;
  size_run_all?: number;
  size_run_league?: number;
  size_score_list?: any[];
  goal_number_list?: any[];
  half_goal_number_list?: any[];
  size_small_all?: number;
  size_small_league?: number;
  team_count?: number;

  poisson_small?: number;
  poisson_big?: number;
  poisson_small_limit?: number;
  poisson_big_limit?: number;
}

export interface IEuropeOddsInfo {
  company_en?: string;
  company_zh?: string;
  origin_win_odds?: number;
  origin_even_odds?: number;
  origin_lose_odds?: number;
  instant_win_odds?: number;
  instant_even_odds?: number;
  instant_lose_odds?: number;
}

export interface IAsiaOddsInfo {
  company_en?: string;
  company_zh?: string;
  origin_odds?: number;
  origin_odds_home?: number;
  origin_odds_visit?: number;
  instant_odds?: number;
  instant_odds_home?: number;
  instant_odds_visit?: number;
}

export interface ISizeOddsInfo {
  company_en?: string;
  company_zh?: string;
  origin_size?: number;
  origin_odds_big?: number;
  origin_odds_small?: number;
  instant_size?: number;
  instant_odds_big?: number;
  instant_odds_small?: number;
}
