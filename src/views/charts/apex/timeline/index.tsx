
import ComponentCard from '@/components/cards/ComponentCard'
import CustomApexChart from '@/components/CustomApexChart.tsx'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap'
import { getAdvanceTimelineChart, getDistributedTimelineChart, getGroupRowTimelineChart, getMultiSeriesTimelineChart, getTimelineChart } from './data.ts'

const Index = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Timeline Apexchart" subtitle="Charts" />
      <Row>
        <Col xl={6}>
          <ComponentCard title="Basic Timeline">
            <CustomApexChart getOptions={getTimelineChart} series={getTimelineChart().series} type="rangeBar" height={350} />
          </ComponentCard>
        </Col>
        <Col xl={6}>
          <ComponentCard title="Distributed Timeline">
            <CustomApexChart getOptions={getDistributedTimelineChart} series={getDistributedTimelineChart().series} type="rangeBar" height={350} />
          </ComponentCard>
        </Col>
      </Row>
      <Row>
        <Col xl={6}>
          <ComponentCard title="Multi Series Timeline">
            <CustomApexChart getOptions={getMultiSeriesTimelineChart} series={getMultiSeriesTimelineChart().series} type="rangeBar" height={350} />
          </ComponentCard>
        </Col>
        <Col xl={6}>
          <ComponentCard title="Advanced Timeline">
            <CustomApexChart getOptions={getAdvanceTimelineChart} series={getAdvanceTimelineChart().series} type="rangeBar" height={350} />
          </ComponentCard>
        </Col>
      </Row>
      <Col xl={6}>
        <ComponentCard title="Multiple Series - Group Rows">
          <CustomApexChart getOptions={getGroupRowTimelineChart} series={getGroupRowTimelineChart().series} type="rangeBar" height={350} />
        </ComponentCard>
      </Col>
    </Container>
  )
}

export default Index
