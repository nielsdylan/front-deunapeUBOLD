

import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, FormSelect, Row } from 'react-bootstrap'

import  ReactApexChart from 'react-apexcharts'

const colorMap: Record<string, string> = {
  primary: '#727cf5',
  secondary: '#6c757d',
  info: '#39afd1',
  danger: '#fa5c7c',
  warning: '#ffbc00',
  success: '#0acf97',
  'border-color': '#e0e0e0',
}

const arrayData = [
  {
    y: 400,
    quarters: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 90 },
      { x: 'Q3', y: 100 },
      { x: 'Q4', y: 90 },
    ],
    colorToken: 'primary',
  },
  {
    y: 430,
    quarters: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 110 },
      { x: 'Q3', y: 90 },
      { x: 'Q4', y: 110 },
    ],
    colorToken: 'secondary',
  },
  {
    y: 448,
    quarters: [
      { x: 'Q1', y: 70 },
      { x: 'Q2', y: 100 },
      { x: 'Q3', y: 140 },
      { x: 'Q4', y: 138 },
    ],
    colorToken: 'info',
  },
  {
    y: 470,
    quarters: [
      { x: 'Q1', y: 150 },
      { x: 'Q2', y: 60 },
      { x: 'Q3', y: 190 },
      { x: 'Q4', y: 70 },
    ],
    colorToken: 'danger',
  },
  {
    y: 540,
    quarters: [
      { x: 'Q1', y: 120 },
      { x: 'Q2', y: 120 },
      { x: 'Q3', y: 130 },
      { x: 'Q4', y: 170 },
    ],
    colorToken: 'warning',
  },
  {
    y: 580,
    quarters: [
      { x: 'Q1', y: 170 },
      { x: 'Q2', y: 130 },
      { x: 'Q3', y: 120 },
      { x: 'Q4', y: 160 },
    ],
    colorToken: 'success',
  },
]

const shuffleArray = (array: any[]) => {
  const newArr = [...array]
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }
  return newArr
}

const makeData = () => {
  const dataset = shuffleArray(arrayData)
  return dataset.map((item, index) => ({
    x: `${2019 + index}`,
    y: item.y,
    colorToken: item.colorToken,
    quarters: item.quarters,
  }))
}

const quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4']

const DynamicLoadedChart = () => {
  const [yearData, setYearData] = useState<any[]>([])
  const [yearOptions, setYearOptions] = useState<any>({})
  const [quarterData, setQuarterData] = useState<any[]>([])
  const [quarterOptions, setQuarterOptions] = useState<any>({})
  const [colors, setColors] = useState<string[]>([])

  const updateQuarterChart = (sourceSeries: any, selectedIndexes: number[]) => {
    if (!selectedIndexes || selectedIndexes.length === 0) {
      setQuarterData([])
      return
    }

    const series: any[] = []
    const colorTokens: string[] = []

    selectedIndexes.forEach((i) => {
      const item = sourceSeries.data[i]
      const values = quarterLabels.map((q) => {
        const found = item.quarters.find((entry: any) => entry.x === q)
        return found?.y || 0
      })

      series.push({ name: item.x, data: values })
      colorTokens.push(colorMap[item.colorToken] || '#000000')
    })

    setQuarterData(series)
    setColors(colorTokens)
  }

  const initializeCharts = () => {
    const data = makeData()
    const colorTokens = data.map((d) => colorMap[d.colorToken] || '#000000')

    const yearChartOptions = {
      chart: {
        id: 'barYear',
        type: 'bar',
        height: 400,
        events: {
          dataPointSelection: (_e: any, chart: any, opts: any) => {
            const selected = opts.selectedDataPoints[0]
            if (selected && selected.length > 0) {
              updateQuarterChart(chart.w.config.series[0], selected)
            } else {
              setQuarterData([])
            }
          },
          updated: (chart: any) => {
            const selected = chart.w.globals.selectedDataPoints[0]
            if (selected && selected.length > 0) {
              updateQuarterChart(chart.w.config.series[0], selected)
            }
          },
        },
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          distributed: true,
          horizontal: true,
          barHeight: '75%',
          dataLabels: { position: 'bottom' },
        },
      },
      dataLabels: {
        enabled: true,
        style: { colors: ['#fff'] },
        formatter: (_val: any, opt: any) => opt.w.globals.labels[opt.dataPointIndex],
        offsetX: 10,
        dropShadow: { enabled: true },
      },
      colors: colorTokens,
      tooltip: {
        x: { show: false },
        y: {
          title: {
            formatter: (_val: any, opt: any) => opt.w.globals.labels[opt.dataPointIndex],
          },
        },
      },
      states: {
        normal: { filter: { type: 'desaturate' } },
        active: { allowMultipleDataPointsSelection: true, filter: { type: 'darken', value: 1 } },
      },
      title: {
        text: 'Yearly Results',
        offsetX: 5,
        style: { fontSize: '14px', fontWeight: 700 },
      },
      subtitle: {
        text: '(Click on bar to see details)',
        offsetX: 5,
        style: { fontSize: '12px', fontWeight: 500 },
      },
      xaxis: { axisBorder: { show: false } },
      yaxis: { labels: { show: false } },
      grid: {
        borderColor: colorMap['border-color'],
        padding: { top: -10, right: 0, bottom: -15, left: 0 },
      },
      legend: { show: false },
    }

    const quarterChartOptions = {
      chart: {
        id: 'barQuarter',
        height: 400,
        type: 'bar',
        stacked: true,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: { columnWidth: '50%', horizontal: false },
      },
      xaxis: {
        categories: quarterLabels,
        axisBorder: { show: false },
      },
      yaxis: { labels: { show: false } },
      legend: { show: false },
      grid: {
        yaxis: { lines: { show: false } },
        xaxis: { lines: { show: true } },
      },
      colors,
      title: {
        text: 'Quarterly Results',
        offsetX: 10,
        style: { fontSize: '14px', fontWeight: 700 },
      },
      tooltip: {
        x: {
          formatter: (_val: any, opts: any) => opts.w.globals.seriesNames[opts.seriesIndex],
        },
        y: {
          title: {
            formatter: (_val: any, opts: any) => opts.w.globals.labels[opts.dataPointIndex],
          },
        },
      },
    }

    setYearData([{ data }])
    setYearOptions(yearChartOptions)
    setQuarterOptions(quarterChartOptions)
    setQuarterData([])
    setColors([])
  }

  useEffect(() => {
    initializeCharts()
  }, [])

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center border-dashed">
        <h4 className="card-title mb-0">Dynamic Loaded Chart</h4>
        <div className="flex-shrink-0">
          <FormSelect size="sm" className="w-auto" onChange={initializeCharts}>
            <option value="iphone5">iPhone 5</option>
            <option value="iphone6">iPhone 6</option>
            <option value="iphone7">iPhone 7</option>
          </FormSelect>
        </div>
      </CardHeader>

      <CardBody className="pt-3">
        <Row>
          <Col sm={6}>
            <ReactApexChart options={yearOptions} series={yearData} type="bar" height={400} />
          </Col>
          <Col sm={6}>
            <ReactApexChart options={{ ...quarterOptions, colors }} series={quarterData} type="bar" height={400} />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default DynamicLoadedChart
