export const defineChartOption = (type: number) => {
  const text1 = type === 1 ? '胜' : type === 2 ? '赢' : '大'
  const text2 = type === 1 ? '平' : '走'
  const text3 = type === 1 ? '负' : type === 2 ? '熟' : '小'
  const colors = ['#ff3200', '#99cc33', '#1890ff']
  return {
    color: colors,
    legend: {
      top: '10%'
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
      show: false,
      type: 'category',
      data: ['场次']
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
