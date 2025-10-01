
import ComponentCard from '@/components/cards/ComponentCard'
import CustomApexChart from '@/components/CustomApexChart.tsx'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import { getBasicFunnelChart, getPyramidFunnelChart } from './data.ts'

const Index = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Funnel Apexchart" subtitle="Charts" />
      <Row>
        <Col xl={6}>
          <ComponentCard title="Basic Funnel">
            <CustomApexChart getOptions={getBasicFunnelChart} series={getBasicFunnelChart().series} type="bar" height={350} />
          </ComponentCard>
        </Col>
        <Col xl={6}>
          <ComponentCard title="Pyramid Funnel">
            <CustomApexChart getOptions={getPyramidFunnelChart} series={getPyramidFunnelChart().series} type="bar" height={350} />
          </ComponentCard>
        </Col>
      </Row>
    </Container>
  )
}

export default Index
