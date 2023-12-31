import { IMatchInfo } from "../models/match.ts"

export const defineChartOption = (type: number, yName = "") => {
  const text1 = type === 1 ? '胜' : type === 2 ? '赢' : '大'
  const text2 = type === 1 ? '平' : '走'
  const text3 = type === 1 ? '负' : type === 2 ? '输' : '小'
  const colors = ['#ff5252', '#99cc33', '#1890ff']
  return {
    color: colors,
    legend: {
      top: 0
    },
    grid: {
      left: 0,
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      show: false,
      type: 'value',
      min: 0,
      max: 1,
      axisLabel: {
        formatter: function (value: any) {
          return value + "%"
        }
      },
      splitLine: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        margin: 2,
        align: "right"
      },
      axisTick: {
        show: false
      },
      data: [yName]
    },
    series: [
      {
        name: text1,
        type: 'bar',
        stack: 'total',
        label: {
          show: false
        },
        itemStyle: {
          normal: {
            color: colors[0]
          },
          emphasis: {
            color: colors[0]
          }
        },
        barWidth: 20
      },
      {
        name: text2,
        type: 'bar',
        stack: 'total',
        label: {
          show: false
        },
        itemStyle: {
          normal: {
            color: colors[1]
          },
          emphasis: {
            color: colors[1]
          }
        },
        barWidth: 20
      },
      {
        name: text3,
        type: 'bar',
        stack: 'total',
        label: {
          show: false
        },
        itemStyle: {
          normal: {
            color: colors[2]
          },
          emphasis: {
            color: colors[2]
          }
        },
        barWidth: 20,
      },
    ]
  }
}

export const getDecimalPoint = (value: number, num = 2) => {
  return parseFloat(value.toFixed(num))
}

export const getAssetsFile = (url: string) => {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}

export const getAllMatchGroup = (matchList: IMatchInfo[]) => {
  return [...new Set(matchList.map(item => item.match_category))]
}
