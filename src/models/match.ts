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
