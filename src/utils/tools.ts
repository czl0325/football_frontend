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

export const defineTrendChartOption = (type: number) => {
  const text1 = type === 1 ? '胜' : type === 2 ? '赢' : '大'
  const text2 = type === 1 ? '平' : '走'
  const text3 = type === 1 ? '负' : type === 2 ? '输' : '小'
  const colors = ['#ff5252', '#99cc33', '#1890ff']
  return {
    color: colors,
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 5,
      data: [text1, text2, text3],
    },
    grid: {
      top: 50,
      left: 30,
      right: 20,
      bottom: 25,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        name: text1,
        type: 'line',
        stack: text1,
        symbol: "none",
      },
      {
        name: text2,
        type: 'line',
        stack: text2,
        symbol: "none",
      },
      {
        name: text3,
        type: 'line',
        stack: text3,
        symbol: "none",
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

export const mergeSameMatch = (matchList: string[]) => {
  const result: any[] = []
  matchList.forEach(item => {
    const parts = item.split('_');
    const key = parts.slice(0, 3).join('_');
    const existingItem = result.find(entry => entry.key === key)
    if (existingItem) {
      existingItem.indices.push(parts[5])
    } else {
      // 如果不存在相同 key 的元素，创建新的 entry，并初始化 indices 数组
      result.push({
        key,
        start: item.substring(0, item.lastIndexOf('_') + 1),
        indices: [parts[5]],
      });
    }
  })
  return result.map(entry => entry.start + mergeEqualValues(entry.indices.join(',')))
}

function mergeEqualValues(str: string) {
  const parts = str.split(',')
  const values: string[] = []
  parts.forEach((item: string) => {
    const regex = /\(([^)]+)\)/g;  // 匹配括号内的任意非右括号字符
    const match = item.match(regex)
    if (match && !values.includes(match[0])) {
      values.push(match[0])
    }
  })
  const results: string[] = []
  values.forEach(item => {
    let str = item
    parts.forEach(part => {
      if (part.endsWith(item)) {
        str = "|" + part.slice(0, part.indexOf('(')) + str
      }
    })
    if (str.startsWith("|")) {
      str = str.slice(1)
    }
    results.push(str)
  })
  return results.join(',')
}
