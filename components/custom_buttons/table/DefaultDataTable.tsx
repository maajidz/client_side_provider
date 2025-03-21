"use client"

import type React from "react"
import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Extended column definition with mobile display options
interface ExtendedColumnDef<TData, TValue> {
  // Ensure this matches the structure of ColumnDef
  accessorKey?: keyof TData; // Example property
  header: string | React.ReactNode; // Ensure header is defined
  cell: (info: { row: any; getValue: (key: keyof TData) => TValue }) => React.ReactNode; // Example cell function
  mobileOptions?: {
    // Whether to show this column in the mobile card header
    showInHeader?: boolean;
    // Whether to show this column in the mobile card preview (before expanding)
    showInPreview?: boolean;
    // Custom label for mobile view
    mobileLabel?: string;
  };
}

interface DefaultDataTableProps<TData, TValue> {
  title?: React.ReactNode
  columns: ExtendedColumnDef<TData, TValue>[]
  data: TData[]
  pageNo: number
  totalPages: number
  onPageChange: (page: number) => void
  onAddClick?: () => void
  className?: string
}

// Sample data types
interface UserType {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastActive: string
  priority: string
  isSelected: boolean
  actions?: string
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusProps = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return { variant: "success" as const, icon: <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> }
      case "inactive":
        return { variant: "secondary" as const, icon: <Clock className="h-3.5 w-3.5 mr-1" /> }
      case "pending":
        return { variant: "warning" as const, icon: <AlertCircle className="h-3.5 w-3.5 mr-1" /> }
      case "blocked":
        return { variant: "destructive" as const, icon: <XCircle className="h-3.5 w-3.5 mr-1" /> }
      default:
        return { variant: "outline" as const, icon: null }
    }
  }

  const { variant, icon } = getStatusProps(status)

  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {status}
    </Badge>
  )
}

// Priority badge component
const PriorityBadge = ({ priority }: { priority: string }) => {
  const getPriorityProps = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return {
          color: "text-red-500",
          bgColor: "bg-red-50",
          icon: <Star className="h-3.5 w-3.5 mr-1" fill="currentColor" />,
        }
      case "medium":
        return {
          color: "text-amber-500",
          bgColor: "bg-amber-50",
          icon: <Star className="h-3.5 w-3.5 mr-1" fill="currentColor" />,
        }
      case "low":
        return { color: "text-green-500", bgColor: "bg-green-50", icon: <Star className="h-3.5 w-3.5 mr-1" /> }
      default:
        return { color: "text-gray-500", bgColor: "bg-gray-50", icon: null }
    }
  }

  const { color, bgColor, icon } = getPriorityProps(priority)

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} ${bgColor}`}>
      {icon}
      {priority}
    </div>
  )
}

// Action buttons component
const ActionButtons = () => (
  <div className="flex space-x-2">
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <Eye className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <Edit className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
)

export function DefaultDataTable<TData, TValue>({
  title,
  columns,
  data,
  pageNo,
  totalPages,
  onPageChange,
  onAddClick,
  className,
}: DefaultDataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  // Ensure columns and data are valid arrays
  const validColumns = Array.isArray(columns) ? columns : []
  const validData = Array.isArray(data) ? data : []

  const table = useReactTable({
    data: validData,
    columns: validColumns as ColumnDef<TData, TValue>[],
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  })

  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }))
  }

  // Helper function to safely render header groups
  const renderHeaderGroups = () => {
    try {
      const headerGroups = table.getHeaderGroups()
      if (!headerGroups || !Array.isArray(headerGroups)) return null

      return headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead className="px-4 py-2" key={header.id}>
              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}
        </TableRow>
      ))
    } catch (error) {
      console.error("Error rendering header groups:", error)
      return null
    }
  }

  // Helper function to safely get rows
  const getRows = () => {
    try {
      return table.getRowModel().rows || []
    } catch (error) {
      console.error("Error getting rows:", error)
      return []
    }
  }

  const rows = getRows()
  const hasRows = rows.length > 0

  // Get header cells for a row that should be shown in the mobile preview
  const getHeaderCells = (row: any) => {
    const cells = row.getVisibleCells()
    if (!cells || cells.length === 0) return []

    return cells.filter((cell: any, index: number) => {
      const column = cell.column.columnDef as ExtendedColumnDef<any, any>
      return column.mobileOptions?.showInHeader || (index === 0 && !column.mobileOptions)
    })
  }

  // Get preview cells for a row that should be shown in the mobile preview
  const getPreviewCells = (row: any) => {
    const cells = row.getVisibleCells()
    if (!cells || cells.length === 0) return []

    return cells.filter((cell: any, index: number) => {
      const column = cell.column.columnDef as ExtendedColumnDef<any, any>
      return column.mobileOptions?.showInPreview && !column.mobileOptions?.showInHeader
    })
  }

  // Get detail cells for a row that should be shown when expanded
  const getDetailCells = (row: any) => {
    const cells = row.getVisibleCells()
    if (!cells || cells.length === 0) return []

    return cells.filter((cell: any, index: number) => {
      const column = cell.column.columnDef as ExtendedColumnDef<any, any>
      return !column.mobileOptions?.showInHeader && !column.mobileOptions?.showInPreview
    })
  }

  return (
    <div className={`data-table-container flex flex-col gap-3 flex-1 ${className}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0">
        <div className="flex flex-row gap-2 items-center">
          {title && <span className="font-bold text-lg">{title}</span>}
          {onAddClick && (
            <Button variant="ghost" onClick={onAddClick} className="flex items-center gap-1">
              Add
            </Button>
          )}
        </div>
        <div className="flex flex-row text-sm items-center gap-2 w-full md:w-auto">
          <div className="text-gray-400">
            Page {pageNo} of {totalPages}
          </div>
          <div className="space-x-2 ml-auto md:ml-0">
            <Button variant="outline" size="sm" onClick={() => onPageChange(pageNo - 1)} disabled={pageNo <= 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageNo + 1)}
              disabled={pageNo >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop view - regular table */}
      <div className="hidden md:block">
        <Table className="relative h-full border border-gray-200 border-separate border-spacing-0 rounded-[6px]">
          <TableHeader>{renderHeaderGroups()}</TableHeader>
          <TableBody>
            {hasRows ? (
              rows.map((row) => (
                <TableRow
                  className="hover:text-sky-600 hover:bg-sky-50/50 hover:cursor-pointer font-medium"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-3 border-t" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={validColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view - card-like layout */}
      <div className="md:hidden space-y-4">
        {hasRows ? (
          rows.map((row) => {
            const headerCells = getHeaderCells(row)
            const previewCells = getPreviewCells(row)
            const detailCells = getDetailCells(row)

            return (
              <div key={row.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                {/* Card Header */}
                <div
                  className="flex justify-between items-center p-4 bg-gray-50 hover:bg-sky-50/50 hover:text-sky-600 cursor-pointer"
                  onClick={() => toggleRow(row.id)}
                >
                  <div className="flex-1">
                    {headerCells.map((cell: any) => (
                      <div key={cell.id} className="font-medium">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                  <div>
                    {expandedRows[row.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>

                {/* Preview Section (always visible) */}
                {previewCells.length > 0 && (
                  <div className="px-4 py-2 bg-white border-t border-gray-100">
                    {previewCells.map((cell: any) => {
                      const column = cell.column.columnDef as ExtendedColumnDef<any, any>
                      return (
                        <div key={cell.id} className="flex items-center justify-between py-1">
                          <span className="text-sm text-gray-500">
                            {column.mobileOptions?.mobileLabel || String(column.header || "")}
                          </span>
                          <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Expanded Details */}
                {expandedRows[row.id] && detailCells.length > 0 && (
                  <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                    {detailCells.map((cell: any) => {
                      const column = cell.column.columnDef as ExtendedColumnDef<any, any>
                      return (
                        <div key={cell.id} className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            {column.mobileOptions?.mobileLabel || String(column.header || "")}
                          </span>
                          <div className="font-medium py-1">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center p-8 border border-gray-200 rounded-lg">No results.</div>
        )}
      </div>
    </div>
  )
}

