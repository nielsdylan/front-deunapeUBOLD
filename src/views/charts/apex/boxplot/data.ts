import { getColor } from '@/helpers/color'
import type { ApexOptions } from 'apexcharts'

// BASIC BOXPLOT

export const getBasicBoxplotChart = (): ApexOptions => ({
  series: [
    {
      type: 'boxPlot',
      data: [
        {
          x: 'Q1 2022',
          y: [12, 18, 21, 26, 34],
        },
        {
          x: 'Q2 2022',
          y: [10, 14, 19, 24, 30],
        },
        {
          x: 'Q3 2022',
          y: [9, 13, 17, 22, 28],
        },
        {
          x: 'Q4 2022',
          y: [14, 19, 23, 27, 35],
        },
        {
          x: 'Q1 2023',
          y: [11, 15, 20, 25, 32],
        },
        {
          x: 'Q2 2023',
          y: [13, 17, 22, 26, 33],
        },
        {
          x: 'Q3 2023',
          y: [15, 19, 24, 29, 37],
        },
      ],
    },
  ],
  plotOptions: {
    boxPlot: {
      colors: {
        upper: getColor('secondary'),
        lower: getColor('info'),
      },
    },
  },
  chart: {
    type: 'boxPlot',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  stroke: {
    colors: ['#677fac'],
  },
})

// SCATTER BOXPLOT

export const getScatterBoxplotChart = (): ApexOptions => ({
  series: [
    {
      name: 'Resolution Time',
      type: 'boxPlot',
      data: [
        {
          x: new Date('2018-01-01').getTime(),
          y: [12, 18, 22, 26, 31],
        },
        {
          x: new Date('2019-01-01').getTime(),
          y: [14, 20, 24, 28, 34],
        },
        {
          x: new Date('2020-01-01').getTime(),
          y: [10, 16, 21, 25, 30],
        },
        {
          x: new Date('2021-01-01').getTime(),
          y: [11, 17, 23, 27, 33],
        },
        {
          x: new Date('2022-01-01').getTime(),
          y: [13, 19, 25, 30, 36],
        },
      ],
    },
    {
      name: 'Outliers',
      type: 'scatter',
      data: [
        {
          x: new Date('2018-01-01').getTime(),
          y: 8,
        },
        {
          x: new Date('2019-01-01').getTime(),
          y: 37,
        },
        {
          x: new Date('2020-01-01').getTime(),
          y: 5,
        },
        {
          x: new Date('2021-01-01').getTime(),
          y: 38,
        },
        {
          x: new Date('2022-01-01').getTime(),
          y: 40,
        },
      ],
    },
  ],
  chart: {
    type: 'boxPlot',
    height: 350,
    toolbar: { show: false },
  },
  colors: [getColor('danger'), getColor('success')],
  plotOptions: {
    boxPlot: {
      colors: {
        upper: getColor('success'),
        lower: getColor('danger'),
      },
    },
  },
  stroke: {
    colors: ['#a1a9b1'],
  },
  legend: {
    offsetY: 5,
  },
  xaxis: {
    type: 'datetime',
  },
  grid: {
    padding: {
      bottom: 5,
    },
  },
  tooltip: {
    shared: false,
    intersect: true,
  },
})

// HORIZONTAL BOXPLOT

export const getHorizontalBoxplotChart = (): ApexOptions => ({
  series: [
    {
      data: [
        { x: 'Monday', y: [2, 3, 4, 5, 7] },
        { x: 'Tuesday', y: [1.5, 2.5, 3.5, 4.5, 6] },
        { x: 'Wednesday', y: [3, 4, 5, 6, 8] },
        { x: 'Thursday', y: [2.2, 3.2, 4.2, 5.5, 6.5] },
        { x: 'Friday', y: [2.8, 3.6, 4.6, 5.8, 7.2] },
        { x: 'Saturday', y: [1, 2, 3, 4, 5.5] },
        { x: 'Sunday', y: [2.5, 3.5, 4.5, 5.2, 6.8] },
      ],
    },
  ],
  chart: {
    type: 'boxPlot',
    height: 350,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '50%',
    },
    boxPlot: {
      colors: {
        upper: getColor('warning'),
        lower: getColor('purple'),
      },
    },
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
  },
  stroke: {
    colors: ['#a1a9b1'],
  },
  grid: {
    padding: { right: 20 },
  },
})
