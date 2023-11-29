export interface IMatchInfo {
  fid?: string;
  match_url?: string;
  match_group?: string;
  match_type?: string;
  match_category?: string;
  match_round?: string;
  match_time?: string;
  home_team?: string;
  home_team_rank?: string;
  home_score?: string;
  visit_team?: string;
  visit_team_rank?: string;
  visit_score?: string;
  origin_pan_most?: string;
  instant_pan_most?: string;
  field_score?: string;
  match_filter?: string;
  europe_odds_items?: IEuropeOddsInfo[];
  asia_odds_items?: IAsiaOddsInfo[];
  size_odds_items?: ISizeOddsInfo[];


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
  size_small_all?: number;
  size_small_league?: number;
  team_count?: number;
}

export interface IEuropeOddsInfo {
  company_en?: string;
  company_zh?: string;
  origin_win_odds?: number;
  origin_even_home?: number;
  origin_lose_visit?: number;
  instant_win_odds?: number;
  instant_even_home?: number;
  instant_lose_visit?: number;
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
