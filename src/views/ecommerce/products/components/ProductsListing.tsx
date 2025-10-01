import {
    type ColumnDef,
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
import {Button, Card, CardFooter, CardHeader, Col, Row} from 'react-bootstrap'
import {LuBox, LuDollarSign, LuSearch, LuTag} from 'react-icons/lu'
import {TbEdit, TbEye, TbLayoutGrid, TbList, TbPlus, TbTrash} from 'react-icons/tb'

import Rating from '@/components/Rating.tsx'
import DataTable from '@/components/table/DataTable.tsx'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal.tsx'
import TablePagination from '@/components/table/TablePagination.tsx'
import {currency} from '@/helpers'
import {toPascalCase} from '@/helpers/casing.ts'
import {productData, type ProductType} from '@/views/ecommerce/products/data'

const priceRangeFilterFn: FilterFn<any> = (row, columnId, value) => {
    const price = row.getValue<number>(columnId)
    if (!value) return true
    if (value === '500+') return price > 500
    const [min, max] = value.split('-').map(Number)
    return price >= min && price <= max
}

const columnHelper = createColumnHelper<ProductType>()

const ProductsListing = () => {
    const columns: ColumnDef<ProductType, any>[] = [
        {
            id: 'select',
            maxSize: 45,
            size: 45,
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
                        <h5 className="mb-0">
                            <Link to={row.original.url} className="link-reset">
                                {row.original.name}
                            </Link>
                        </h5>
                        <p className="text-muted mb-0 fs-xxs">by: {row.original.brand}</p>
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('code', {header: 'SKU'}),
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
                    <Button variant="default" size="sm" className="btn-icon rounded-circle">
                        <TbEye className="fs-lg"/>
                    </Button>
                    <Button variant="default" size="sm" className="btn-icon rounded-circle">
                        <TbEdit className="fs-lg"/>
                    </Button>
                    <Button
                        variant="default"
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

    const [data, setData] = useState<ProductType[]>(() => [...productData])
    const [globalFilter, setGlobalFilter] = useState('')
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 8})

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
            <Col xs={12}>
                <Card className="mb-4">
                    <CardHeader className="d-flex justify-content-between align-items-center">
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
                                    value={(table.getColumn('category')?.getFilterValue() as string) ?? 'All'}
                                    onChange={(e) => table.getColumn('category')?.setFilterValue(e.target.value === 'All' ? undefined : e.target.value)}>
                                    <option value="All">Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home">Home</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Beauty">Beauty</option>
                                </select>
                                <LuTag className="app-search-icon text-muted"/>
                            </div>

                            <div className="app-search">
                                <select
                                    className="form-select form-control my-1 my-md-0"
                                    value={(table.getColumn('status')?.getFilterValue() as string) ?? 'All'}
                                    onChange={(e) => table.getColumn('status')?.setFilterValue(e.target.value === 'All' ? undefined : e.target.value)}>
                                    <option value="All">Status</option>
                                    <option value="published">Published</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <LuBox className="app-search-icon text-muted"/>
                            </div>

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

                            <div>
                                <select
                                    className="form-select form-control my-1 my-md-0"
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => table.setPageSize(Number(e.target.value))}>
                                    {[5, 8, 10, 15, 20].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="d-flex gap-1">
                            <Link  to="/products-grid">
                                <Button variant="outline-primary" className="btn-icon btn-soft-primary">
                                    <TbLayoutGrid className="fs-lg"/>
                                </Button>
                            </Link>
                            <Button variant="primary" className="btn-icon">
                                <TbList className="fs-lg"/>
                            </Button>
                            <Link to="/add-product" >
                                <Button variant="danger" className="ms-1">
                                    <TbPlus className="fs-sm me-2"/> Add Product
                                </Button>
                            </Link>
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
                </Card>
            </Col>
        </Row>
    )
}

export default ProductsListing
