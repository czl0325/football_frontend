import { version } from '../package.json'

export const PRODUCT_URL = "http://117.72.172.8:10008"
export const DEVELOP_URL = "http://127.0.0.1:10008"
export const API_URL = process.env.NODE_ENV === 'production' ? PRODUCT_URL : DEVELOP_URL
export const APP_VERSION = version

export const EUROPE_COMPANY = [
  {
    name: "威廉希尔",
    value: "wl"
  },
  {
    name: "澳门",
    value: "macao"
  },
  {
    name: "立博",
    value: "lb"
  },
  {
    name: "Bet365",
    value: "365"
  },
  {
    name: "Interwetten",
    value: "interwetten"
  },
  {
    name: "SNAI",
    value: "SNAI"
  },
  {
    name: "皇冠",
    value: "crown"
  },
  {
    name: "易胜博",
    value: "ysb"
  },
  {
    name: "伟德",
    value: "wd"
  },
  {
    name: "Oddset",
    value: "oddset"
  },
  {
    name: "Pinnacle平博",
    value: "pinnacle"
  },
  {
    name: "10BET",
    value: "10"
  },
  {
    name: "Coral",
    value: "coral"
  },
  {
    name: "利记",
    value: "lj"
  },
  {
    name: "金宝博",
    value: "jbb"
  },
  {
    name: "必发",
    value: "bf"
  },
  {
    name: "12BET",
    value: "12BET"
  },
  {
    name: "明升",
    value: "mansion"
  },
]

export const ASIA_COMPANY = [
  {
    name: "威廉希尔",
    value: "wl"
  },
  {
    name: "澳门",
    value: "macao"
  },
  {
    name: "立博",
    value: "lb"
  },
  {
    name: "Bet365",
    value: "365"
  },
  {
    name: "Interwetten",
    value: "interwetten"
  },
  {
    name: "皇冠",
    value: "crown"
  },
  {
    name: "易胜博",
    value: "ysb"
  },
  {
    name: "伟德",
    value: "wd"
  },
  {
    name: "Pinnacle平博",
    value: "pinnacle"
  },
  {
    name: "10BET",
    value: "10"
  },
  {
    name: "Coral",
    value: "coral"
  },
  {
    name: "利记",
    value: "lj"
  },
  {
    name: "金宝博",
    value: "jbb"
  },
  {
    name: "12BET",
    value: "12BET"
  },
  {
    name: "明升",
    value: "mansion"
  },
  {
    name: "盈禾",
    value: "yh"
  },
  {
    name: "18BET",
    value: "18BET"
  },
]

export const SIZE_COMPANY = [
  {
    name: "威廉希尔",
    value: "wl"
  },
  {
    name: "澳门",
    value: "macao"
  },
  {
    name: "立博",
    value: "lb"
  },
  {
    name: "Bet365",
    value: "365"
  },
  {
    name: "Interwetten",
    value: "interwetten"
  },
  {
    name: "皇冠",
    value: "crown"
  },
  {
    name: "易胜博",
    value: "ysb"
  },
  {
    name: "伟德",
    value: "wd"
  },
  {
    name: "Pinnacle平博",
    value: "pinnacle"
  },
  {
    name: "10BET",
    value: "10"
  },
  {
    name: "Coral",
    value: "coral"
  },
  {
    name: "利记",
    value: "lj"
  },
  {
    name: "金宝博",
    value: "jbb"
  },
  {
    name: "12BET",
    value: "12BET"
  },
  {
    name: "明升",
    value: "mansion"
  },
  {
    name: "盈禾",
    value: "yh"
  },
  {
    name: "18BET",
    value: "18BET"
  },
]

export const ALL_COMPETITION = ['英超', '英冠', '英甲', '英乙', '英足总杯', '英锦赛', '英非联', '西甲', '西乙', '西丙1', '西丙2', '西丙3', '西丙4', '西协甲', '西班牙杯', '西超杯', '西丙附', '意甲', '意乙', '意丙1A', '意丙1B', '意丙1C', '意丙附', '意青联', '意青杯', '意杯', '意丙杯', '德甲', '德乙', '德丙联', '德东北', '德国杯', '法甲', '法乙', '法丙', '法国杯', '荷甲', '荷乙', '荷杯', '葡超', '葡甲', '葡联杯', '葡杯', '比甲', '比乙', '比杯', '比超杯', '瑞典超', '瑞典甲', '瑞典杯', '瑞士超', '瑞士甲', '瑞士杯', '欧冠', '欧罗巴', '欧会杯', '丹超', '丹甲', '丹麦杯', '罗甲', '罗杯', '波甲', '波乙', '波兰杯', '苏超', '苏冠', '苏甲', '苏联赛杯', '克罗甲', '克罗杯', '塞甲联', '塞尔杯', '挪超', '挪甲', '挪威杯', '挪超杯', '黑山甲', '保超', '爱超', '爱甲', '土超', '土甲', '土杯', '土超杯', '捷甲', '捷克乙', '捷克杯', '波黑超', '斯洛文甲', '冰岛超', '冰甲', '冰岛杯', '冰超杯', '冰联杯', '威超联', '希腊超A', '希腊超B', '俄超', '俄甲', '俄杯', '俄超杯', '芬超', '芬甲', '芬兰杯', '芬联杯', '奥甲', '奥乙', '北爱超', '以超', '塞浦甲', '亚美联', '格超', '立甲', '斯伐超', '乌超', '乌克甲', '乌克杯', '匈甲', '匈乙', '匈牙利杯', '拉脱甲', '卢森甲', '哈萨超', '马其甲', '日职', '日职乙', '日丙', '日联杯', '日天皇杯', 'K1联赛', 'K2联赛', 'K3联赛', 'K4联赛', '韩足杯', '印度超', '印度甲', '印尼超', '泰超', '伊朗甲', '乌兹超', '沙特联', '沙特甲', '沙王冠', '中超', '中甲', '中协杯', '阿联超', '卡塔联', '伊拉联', '巴甲', '巴乙', '巴西杯', '巴圣锦', '巴里州杯', '巴东北杯', '阿甲', '阿乙', '阿根廷杯', '乌拉超', '解放者杯', '南俱杯', '巴拉联', '智甲', '智乙', '秘鲁甲', '美职联', '公开赛', '北美联', '墨西联', '墨西乙', '墨西杯', '哥甲', '哥伦杯', '厄甲', '哥斯甲', '玻甲联', '美冠杯', '中北国联', '摩洛超', '埃及甲', '阿尔及甲', '突尼斯甲', '尼日超', '南非超', '澳超', '澳南超', '澳维超', '澳昆超', '澳西超', '澳足杯', '欧洲杯', '非洲杯', '世界杯', '世外亚洲', '世外南美', '世青赛', '欧青赛', '亚青U23', '金杯赛', '南非协杯', '女世杯', '球会友谊']
