
import ComponentCard from '@/components/cards/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Pagination, Row } from 'react-bootstrap'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb'

const DefaultPagination = () => {
  const items = []
  for (let number = 1; number <= 3; number++) {
    items.push(<Pagination.Item key={number}>{number}</Pagination.Item>)
  }
  return (
    <ComponentCard isCollapsible title="Default Pagination">
      <p className="text-muted fs-sm">
        Use <code>.pagination</code> inside <code>&lt;nav&gt;</code>
        for accessible, easy-to-click page links.
      </p>
      <Pagination className="mb-0">
         <Pagination.Prev>Previous</Pagination.Prev>
        {items}
         <Pagination.Next>Next</Pagination.Next>
      </Pagination>
    </ComponentCard>
  )
}

const AlignmentPagination = () => {
  return (
    <ComponentCard isCollapsible title="Alignment">
      <p className="text-muted fs-sm">
        Align pagination using flexbox utilities, such as
        <code>.justify-content-center</code> to center it.
      </p>
      <Pagination className="justify-content-center">
        <Pagination.Prev disabled>Previous</Pagination.Prev>
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Next>Next</Pagination.Next>
      </Pagination>
      <Pagination className="justify-content-end">
        <Pagination.Prev disabled>Previous</Pagination.Prev>
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Next>Next</Pagination.Next>
      </Pagination>
    </ComponentCard>
  )
}

const CustomColorPagination = () => {
  return (
    <ComponentCard isCollapsible title="Custom Color Pagination">
      <p className="text-muted fs-sm">
        Add classes like <code>.pagination-primary</code>,<code>.pagination-info</code>, or <code>.pagination-secondary</code> to customize pagination
        color.
      </p>
      <Pagination className="pagination-boxed pagination-info">
        <Pagination.Prev>
          <TbChevronLeft />
        </Pagination.Prev>
        <Pagination.Item>1</Pagination.Item>
        <Pagination.Item active>2</Pagination.Item>
        <Pagination.Item>3</Pagination.Item>
        <Pagination.Item>4</Pagination.Item>
        <Pagination.Item>5</Pagination.Item>
        <Pagination.Next>
          <TbChevronRight className="align-middle" />
        </Pagination.Next>
      </Pagination>
      <Pagination className="pagination-boxed pagination-secondary mb-0">
        <Pagination.Prev>
          <TbChevronLeft />
        </Pagination.Prev>
        <Pagination.Item>1</Pagination.Item>
        <Pagination.Item>2</Pagination.Item>
        <Pagination.Item active>3</Pagination.Item>
        <Pagination.Item>4</Pagination.Item>
        <Pagination.Item>5</Pagination.Item>
        <Pagination.Next>
          <TbChevronRight className="align-middle" />
        </Pagination.Next>
      </Pagination>
    </ComponentCard>
  )
}

const DisabledAndActive = () => {
  return (
    <ComponentCard isCollapsible title="Disabled and active states">
      <p className="text-muted fs-sm">
        Add <code>.disabled</code> and <code>tabindex="-1"</code> to
        <code>.page-item</code> to make it non-interactive.
      </p>
      <Pagination className="mb-0">
        <Pagination.Prev disabled>Previous</Pagination.Prev>
        <Pagination.Item>{1}</Pagination.Item>
        <Pagination.Item active>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
        <Pagination.Next>Next</Pagination.Next>
      </Pagination>
    </ComponentCard>
  )
}

const CustomIconPagination = () => {
  return (
    <ComponentCard isCollapsible title="Custom Icon Pagination">
      <p className="text-muted fs-sm">
        Add icons like
        <code>&lt;i class="ti ti-chevron-**"&gt;&lt;/i&gt;</code> or SVGs inside
        <code>.page-link</code> for custom pagination arrows.
      </p>
      <Pagination className="pagination-boxed">
        <Pagination.Prev>
          <TbChevronLeft />
        </Pagination.Prev>
        <Pagination.Item>1</Pagination.Item>
        <Pagination.Item active>2</Pagination.Item>
        <Pagination.Item>3</Pagination.Item>
        <Pagination.Item>4</Pagination.Item>
        <Pagination.Item>5</Pagination.Item>
        <Pagination.Next>
          <TbChevronRight className="align-middle" />
        </Pagination.Next>
      </Pagination>
      <Pagination className="pagination-boxed">
        <Pagination.Prev>
          <LuArrowLeft />
        </Pagination.Prev>
        <Pagination.Item>1</Pagination.Item>
        <Pagination.Item>2</Pagination.Item>
        <Pagination.Item active>3</Pagination.Item>
        <Pagination.Item>4</Pagination.Item>
        <Pagination.Item>5</Pagination.Item>
        <Pagination.Next>
          <LuArrowRight />
        </Pagination.Next>
      </Pagination>
    </ComponentCard>
  )
}

const SizingPagination = () => {
  const items = []
  for (let number = 1; number <= 3; number++) {
    items.push(<Pagination.Item key={number}>{number}</Pagination.Item>)
  }
  return (
    <ComponentCard isCollapsible title="Sizing">
      <p className="text-muted fs-sm">
        Use <code>.pagination-lg</code> or
        <code>.pagination-sm</code> to change pagination size.
      </p>
      <nav>
        <Pagination size="lg">
          <Pagination.Prev />
          {items}
          <Pagination.Next />
        </Pagination>
        <Pagination size="sm" className="mb-0">
          <Pagination.Prev />
          {items}
          <Pagination.Next />
        </Pagination>
      </nav>
    </ComponentCard>
  )
}

const BoxedPagination = () => {
  return (
    <ComponentCard isCollapsible title="Boxed Pagination">
      <p className="text-muted fs-sm">
        Use <code>.pagination-boxed</code> with
        <code>.pagination</code> to give pagination items a boxed appearance.
      </p>
      <nav>
        <Pagination className="pagination-boxed">
          <Pagination.Prev />
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item active>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Next />
        </Pagination>
        <Pagination className="pagination-lg pagination-boxed">
          <Pagination.Prev />
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item active>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Next />
        </Pagination>
        <Pagination className="pagination-sm pagination-boxed mb-0">
          <Pagination.Prev />
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item active>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </nav>
    </ComponentCard>
  )
}

const RoundedPagination = () => {
  return (
    <ComponentCard isCollapsible title="Rounded Pagination">
      <p className="text-muted fs-sm">
        Use <code>.pagination-rounded</code> with
        <code>.pagination</code> to create rounded pagination links.
      </p>
      <nav>
        <Pagination className="pagination-rounded pagination-boxed mb-0">
          <Pagination.Prev />
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item active>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </nav>
    </ComponentCard>
  )
}

const SoftPagination = () => {
  return (
    <ComponentCard isCollapsible title="Soft Pagination">
      <p className="text-muted fs-sm">
        Use <code>.pagination-soft-**</code> with
        <code>.pagination</code> for a soft-colored pagination style.
      </p>
      <nav>
        <Pagination className="pagination-soft-danger pagination-boxed mb-0">
          <Pagination.Prev />
          <Pagination.Item>1</Pagination.Item>
          <Pagination.Item>2</Pagination.Item>
          <Pagination.Item active>3</Pagination.Item>
          <Pagination.Item>4</Pagination.Item>
          <Pagination.Item>5</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </nav>
    </ComponentCard>
  )
}

const page = () => {
  return (
    <>
      <Container fluid>
        <PageBreadcrumb title="Pagination" subtitle="UI" />
        <Row>
          <Col xl={6}>
            <DefaultPagination />
            <AlignmentPagination />
            <CustomColorPagination />
            <DisabledAndActive />
            <CustomIconPagination />
          </Col>
          <Col xl={6}>
            <SizingPagination />
            <BoxedPagination />
            <RoundedPagination />
            <SoftPagination />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default page
