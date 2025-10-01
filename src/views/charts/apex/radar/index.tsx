
import ComponentCard from '@/components/cards/ComponentCard'
import CustomApexChart from '@/components/CustomApexChart.tsx'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { generateRandomSeries, getBasicRadarChart, getRadarMultiPleSeriesChart, getRadarPolygonChart } from './data.ts'

const Index = () => {
  const [series, setSeries] = useState(generateRandomSeries)

  const handleUpdate = () => {
    setSeries(generateRandomSeries())
  }

  return (
    <Container fluid>
      <PageBreadcrumb title="Radar Apexchart" subtitle="Charts" />
      <Row>
        <Col xl={6}>
          <ComponentCard title="Basic Radar Chart">
            <CustomApexChart getOptions={getBasicRadarChart} series={getBasicRadarChart().series} type="radar" height={350} />
          </ComponentCard>
        </Col>
        <Col xl={6}>
          <ComponentCard title="Radar with Polygon-fill">
            <CustomApexChart getOptions={getRadarPolygonChart} series={getRadarPolygonChart().series} type="radar" height={350} />
          </ComponentCard>
        </Col>
      </Row>
      <Row>
        <Col xl={12} md={6}>
          <ComponentCard title="Radar – Multiple Series">
            <CustomApexChart getOptions={() => ({ ...getRadarMultiPleSeriesChart(), series })} series={series} type="radar" height={350} />
            <div className="text-center mt-2">
              <Button size="sm" variant="primary" onClick={handleUpdate}>
                Update
              </Button>
            </div>
          </ComponentCard>
        </Col>
      </Row>
    </Container>
  )
}

export default Index
