import {
    type ColumnFiltersState,
    createColumnHelper,
    type FilterFn,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    type Row as TableRow,
    type Table as TableType,
    useReactTable,
} from '@tanstack/react-table'

import {Link} from "react-router";
import {useState} from 'react'
import {Button, CardFooter, CardHeader, Col, Row} from 'react-bootstrap'
import {LuCalendar, LuDollarSign, LuSearch} from 'react-icons/lu'
import {TbEdit, TbEye, TbTrash} from 'react-icons/tb'

import {products, type ProductType} from '@/views/tables/tanstack/data'
import ComponentCard from '@/components/cards/ComponentCard'
import Rating from '@/components/Rating'
import DataTable from '@/components/table/DataTable'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import TablePagination from '@/components/table/TablePagination'
import {currency} from '@/helpers'
import {toPascalCase} from '@/helpers/casing'

const priceRangeFilterFn: FilterFn<any> = (row, columnId, value) => {
    const price = row.getValue<number>(columnId)
    if (!value) return true

    if (value === '500+') return price > 500

    const [min, max] = value.split('-').map(Number)
    return price >= min && price <= max
}

const dateRangeFilterFn: FilterFn<any> = (row, columnId, selectedRange) => {
    if (!selectedRange || selectedRange === 'All') return true

    const text = row.getValue<string>(columnId)
    if (!text) return false

    const cellDate = new Date(text)
    if (isNaN(cellDate.getTime())) return false

    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    let rangeStart, rangeEnd

    switch (selectedRange) {
        case 'Today':
            return cellDate >= startOfToday && cellDate < endOfToday
        case 'Last 7 Days':
            rangeStart = new Date(now)
            rangeStart.setDate(now.getDate() - 7)
            rangeEnd = endOfToday
            return cellDate >= rangeStart && cellDate < rangeEnd
        case 'Last 30 Days':
            rangeStart = new Date(now)
            rangeStart.setDate(now.getDate() - 30)
            rangeEnd = endOfToday
            return cellDate >= rangeStart && cellDate < rangeEnd
        case 'This Year':
            rangeStart = new Date(now.getFullYear(), 0, 1)
            rangeEnd = new Date(now.getFullYear() + 1, 0, 1)
            return cellDate >= rangeStart && cellDate < rangeEnd
        default:
            return true
    }
}

const columnHelper = createColumnHelper<ProductType>()

const TableWithRangeFilters = () => {
    const columns = [
        {
            id: 'select',
            header: ({table}: { table: TableType<ProductType> }) => (
                <input
                    type="checkbox"
                    className="form-check-input form-check-input-light fs-14"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({row}: { row: TableRow<ProductType> }) => (
                <input
                    type="checkbox"
                    className="form-check-input form-check-input-light fs-14"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },
        columnHelper.accessor('name', {
            header: 'Product',
            cell: ({row}) => (
                <div className="d-flex">
                    <div className="avatar-md me-3">
                        <img src={row.original.image} alt="Product" height={36} width={36}
                             className="img-fluid rounded"/>
                    </div>
                    <div>
                        <h5 className="mb-1">
                            <Link to={row.original.url} className="link-reset">
                                {row.original.name}
                            </Link>
                        </h5>
                        <p className="text-muted mb-0 fs-xxs">by: {row.original.brand}</p>
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('code', {header: 'Code'}),
        columnHelper.accessor('category', {
            header: 'Category',
            filterFn: 'equalsString',
            enableColumnFilter: true,
        }),
        columnHelper.accessor('stock', {header: 'Stock'}),
        columnHelper.accessor('price', {
            header: 'Price',
            filterFn: priceRangeFilterFn,
            enableColumnFilter: true,
            cell: ({row}) => (
                <>
                    {currency}
                    {row.original.price}
                </>
            ),
        }),
        columnHelper.accessor('sold', {header: 'Sold'}),
        columnHelper.accessor('rating', {
            header: 'Rating',
            cell: ({row}) => (
                <>
                    <Rating rating={row.original.rating}/>
                    <span className="ms-1">
            <Link to="" className="link-reset fw-semibold">
              ({row.original.reviews})
            </Link>
          </span>
                </>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            filterFn: 'equalsString',
            enableColumnFilter: true,
            cell: ({row}) => (
                <span
                    className={`badge ${row.original.status === 'published' ? 'badge-soft-success' : row.original.status === 'pending' ? 'badge-soft-warning' : 'badge-soft-danger'} fs-xxs`}>
          {toPascalCase(row.original.status)}
        </span>
            ),
        }),
        columnHelper.accessor('date', {
            header: 'Date',
            filterFn: dateRangeFilterFn,
            enableColumnFilter: true,
            cell: ({row}) => (
                <>
                    {row.original.date} <small className="text-muted">{row.original.time}</small>
                </>
            ),
        }),
        {
            header: 'Actions',
            cell: ({row}: { row: TableRow<ProductType> }) => (
                <div className="d-flex  gap-1">
                    <Button variant="light" size="sm" className="btn-icon rounded-circle">
                        <TbEye className="fs-lg"/>
                    </Button>
                    <Button variant="light" size="sm" className="btn-icon rounded-circle">
                        <TbEdit className="fs-lg"/>
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        className="btn-icon rounded-circle"
                        onClick={() => {
                            toggleDeleteModal()
                            setSelectedRowIds({[row.id]: true})
                        }}>
                        <TbTrash className="fs-lg"/>
                    </Button>
                </div>
            ),
        },
    ]

    const [data, setData] = useState<ProductType[]>(() => [...products])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 5})

    const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({})

    const table = useReactTable({
        data,
        columns,
        state: {sorting, globalFilter, columnFilters, pagination, rowSelection: selectedRowIds},
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onRowSelectionChange: setSelectedRowIds,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: 'includesString',
        enableColumnFilters: true,
        enableRowSelection: true,
        filterFns: {
            priceRange: priceRangeFilterFn,
            dateRange: dateRangeFilterFn,
        },
    })

    const pageIndex = table.getState().pagination.pageIndex
    const pageSize = table.getState().pagination.pageSize
    const totalItems = table.getFilteredRowModel().rows.length

    const start = pageIndex * pageSize + 1
    const end = Math.min(start + pageSize - 1, totalItems)

    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

    const toggleDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal)
    }

    const handleDelete = () => {
        const selectedIds = new Set(Object.keys(selectedRowIds))
        setData((old) => old.filter((_, idx) => !selectedIds.has(idx.toString())))
        setSelectedRowIds({})
        setPagination({...pagination, pageIndex: 0})
        setShowDeleteModal(false)
    }

    return (
        <Row>
            <Col sm={12}>
                <ComponentCard title="Custom table with range filters" bodyClassName="p-0">
                    <CardHeader className="border-light justify-content-between">
                        <div className="d-flex gap-2">
                            <div className="app-search">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Search product name..."
                                    value={globalFilter ?? ''}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                />
                                <LuSearch className="app-search-icon text-muted"/>
                            </div>

                            {Object.keys(selectedRowIds).length > 0 && (
                                <Button variant="danger" size="sm" onClick={toggleDeleteModal}>
                                    Delete
                                </Button>
                            )}
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <span className="me-2 fw-semibold">Filter By:</span>

                            <div className="app-search">
                                <select
                                    className="form-select form-control my-1 my-md-0"
                                    value={(table.getColumn('price')?.getFilterValue() as string) ?? ''}
                                    onChange={(e) => table.getColumn('price')?.setFilterValue(e.target.value || undefined)}>
                                    <option value="">Price Range</option>
                                    <option value="0-50">$0 - $50</option>
                                    <option value="51-150">$51 - $150</option>
                                    <option value="151-500">$151 - $500</option>
                                    <option value="500+">$500+</option>
                                </select>
                                <LuDollarSign className="app-search-icon text-muted"/>
                            </div>

                            <div className="app-search">
                                <select
                                    className="form-select form-control my-1 my-md-0"
                                    value={(table.getColumn('date')?.getFilterValue() as string) ?? ''}
                                    onChange={(e) => table.getColumn('date')?.setFilterValue(e.target.value || undefined)}>
                                    <option value="All">Date Range</option>
                                    <option value="Today">Today</option>
                                    <option value="Last 7 Days">Last 7 Days</option>
                                    <option value="Last 30 Days">Last 30 Days</option>
                                    <option value="This Year">This Year</option>
                                </select>
                                <LuCalendar className="app-search-icon text-muted"/>
                            </div>

                            <div>
                                <select
                                    className="form-select form-control my-1 my-md-0"
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => table.setPageSize(Number(e.target.value))}>
                                    {[5, 10, 15, 20].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </CardHeader>

                    <DataTable<ProductType> table={table} emptyMessage="No records found"/>

                    {table.getRowModel().rows.length > 0 && (
                        <CardFooter className="border-0">
                            <TablePagination
                                totalItems={totalItems}
                                start={start}
                                end={end}
                                itemsName="products"
                                showInfo
                                previousPage={table.previousPage}
                                canPreviousPage={table.getCanPreviousPage()}
                                pageCount={table.getPageCount()}
                                pageIndex={table.getState().pagination.pageIndex}
                                setPageIndex={table.setPageIndex}
                                nextPage={table.nextPage}
                                canNextPage={table.getCanNextPage()}
                            />
                        </CardFooter>
                    )}

                    <DeleteConfirmationModal
                        show={showDeleteModal}
                        onHide={toggleDeleteModal}
                        onConfirm={handleDelete}
                        selectedCount={Object.keys(selectedRowIds).length}
                        itemName="product"
                    />
                </ComponentCard>
            </Col>
        </Row>
    )
}

export default TableWithRangeFilters
