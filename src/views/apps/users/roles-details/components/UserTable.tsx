import {users} from '@/views/apps/users/roles/data'
import type {UserType} from '@/views/apps/users/roles/types'
import DataTable from '@/components/table/DataTable'
import DeleteConfirmationModal from '@/components/table/DeleteConfirmationModal'
import TablePagination from '@/components/table/TablePagination'
import {toPascalCase} from '@/helpers/casing'
import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type Row as TableRow,
    type SortingState,
    type Table as TableType,
    useReactTable,
} from '@tanstack/react-table'

import {useState} from 'react'
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    Col,
    FormControl,
    FormLabel,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle,
    Row
} from 'react-bootstrap'
import {LuSearch, LuUserCheck} from 'react-icons/lu'
import {TbEdit, TbEye, TbTrash} from 'react-icons/tb'
import {useToggle} from 'usehooks-ts'

const columnHelper = createColumnHelper<UserType>()

const UserTable = () => {
    const columns: ColumnDef<UserType, any>[] = [
        {
            id: 'select',
            maxSize: 45,
            size: 45,
            header: ({table}: { table: TableType<UserType> }) => (
                <input
                    type="checkbox"
                    className="form-check-input form-check-input-light fs-14"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({row}: { row: TableRow<UserType> }) => (
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
        columnHelper.accessor('id', {
            cell: ({row}) => (
                <h5 className="m-0">
                    <a href="#" className="link-reset">
                        {row.original.id}
                    </a>
                </h5>
            ),
        }),
        columnHelper.accessor('name', {
            header: 'User',
            cell: ({row}) => (
                <div className="d-flex align-items-center gap-2">
                    <div className="avatar avatar-sm">
                        <img src={row.original.avatar} className="img-fluid rounded-circle" alt="user" width={32}
                             height={32}/>
                    </div>
                    <div>
                        <h5 className="fs-base mb-0">
                            <a data-sort="user" href="#" className="link-reset">
                                {row.original.name}
                            </a>
                        </h5>
                        <p className="text-muted fs-xs mb-0"> {row.original.email}</p>
                    </div>
                </div>
            ),
        }),
        columnHelper.accessor('date', {
            header: 'Last Updated',
            cell: ({row}) => (
                <>
                    {row.original.date} <small className="text-muted">{row.original.time}</small>
                </>
            ),
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            filterFn: 'equalsString',
            enableColumnFilter: true,
            cell: ({row}) => (
                <span
                    className={`badge ${row.original.status === 'suspended' ? 'bg-danger-subtle text-danger' : row.original.status === 'inactive' ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'} badge-label`}>
          {toPascalCase(row.original.status)}
        </span>
            ),
        }),

        {
            header: 'Actions',
            cell: ({row}: { row: TableRow<UserType> }) => (
                <div className="d-flex  gap-1">
                    <Button variant="default" size="sm" className="btn-icon">
                        <TbEye className="fs-lg"/>
                    </Button>
                    <Button variant="default" size="sm" className="btn-icon">
                        <TbEdit className="fs-lg"/>
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        className="btn-icon"
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

    const [data, setData] = useState<UserType[]>(() => [...users])
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

    const [show, toggle] = useToggle(false)

    return (
        <>
            <Card>
                <CardHeader className=" border-light justify-content-between">
                    <div className="d-flex gap-2">
                        <div className="app-search">
                            <input
                                value={globalFilter ?? ''}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                type="search"
                                className="form-control"
                                placeholder="Search users..."
                            />
                            <LuSearch className="app-search-icon text-muted"/>
                        </div>
                        {Object.keys(selectedRowIds).length > 0 && (
                            <Button variant="danger" onClick={toggleDeleteModal}>
                                Delete
                            </Button>
                        )}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="me-2 fw-semibold">Filter By:</span>

                        <div className="app-search">
                            <select
                                value={(table.getColumn('status')?.getFilterValue() as string) ?? 'All'}
                                onChange={(e) => table.getColumn('status')?.setFilterValue(e.target.value === 'All' ? undefined : e.target.value)}
                                className="form-select form-control my-1 my-md-0">
                                <option value="All">Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                            <LuUserCheck className="app-search-icon text-muted"/>
                        </div>

                        <div>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => table.setPageSize(Number(e.target.value))}
                                className="form-select form-control my-1 my-md-0">
                                {[5, 10, 15, 20].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" onClick={toggle} className="btn btn-secondary">
                            Add User
                        </button>
                    </div>
                </CardHeader>
                <DataTable<UserType> table={table} emptyMessage="No records found"/>
                {table.getRowModel().rows.length > 0 && (
                    <CardFooter className="border-0">
                        <TablePagination
                            totalItems={totalItems}
                            start={start}
                            end={end}
                            itemsName="roles"
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
                    itemName="row"
                />
            </Card>
            <Modal show={show} onHide={toggle} className="fade" dialogClassName='modal-lg' id="addUserModal"
                   tabIndex={-1} aria-labelledby="addUserModalLabel" aria-hidden="true">
                <ModalHeader>
                    <ModalTitle as={'h5'} id="addUserModalLabel">Add New User</ModalTitle>
                    <button onClick={toggle} type="button" className="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"/>
                </ModalHeader>
                <form id="addUserForm">
                    <ModalBody>
                        <Row className="g-3">
                            <Col md={6}>
                                <FormLabel htmlFor="userFullName">Full Name</FormLabel>
                                <FormControl type="text" id="userFullName" placeholder="Enter full name" required/>
                            </Col>
                            <Col md={6}>
                                <FormLabel htmlFor="userEmail">Email Address</FormLabel>
                                <FormControl type="email" id="userEmail" placeholder="Enter email" required/>
                            </Col>
                            <Col md={6}>
                                <FormLabel htmlFor="userRole">Role</FormLabel>
                                <select className="form-select" id="userRole" required>
                                    <option>Select role</option>
                                    <option value="Project Manager">Project Manager</option>
                                    <option value="Developer">Developer</option>
                                    <option value="Support Lead">Support Lead</option>
                                    <option value="Security Officer">Security Officer</option>
                                </select>
                            </Col>
                            <Col md={6}>
                                <FormLabel htmlFor="userStatus">Status</FormLabel>
                                <select className="form-select" id="userStatus" required>
                                    <option>Select status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </Col>
                            <Col md={6}>
                                <FormLabel htmlFor="userAvatar">User Avatar</FormLabel>
                                <FormControl type="file" id="userAvatar" accept="image/*"/>
                                <small className="text-muted">Optional: Upload avatar image</small>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        <button type="button" className="btn btn-light" onClick={toggle}
                                data-bs-dismiss="modal">Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">Add User</button>
                    </ModalFooter>
                </form>
            </Modal>

        </>
    )
}
export default UserTable
