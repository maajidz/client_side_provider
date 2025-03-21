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
  Row,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

// Define the structure for column definitions with mobile options
type ExtendedColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  mobileOptions?: {
    showInHeader?: boolean;
    showInPreview?: boolean;
    mobileLabel?: string;
  };
}

interface DefaultDataTableProps<TData, TValue = unknown> {
  title?: React.ReactNode
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageNo: number
  totalPages: number
  onPageChange: (page: number) => void
  onAddClick?: () => void
  className?: string
}

export function DefaultDataTable<TData, TValue = unknown>({
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

  const validColumns = Array.isArray(columns) ? columns : []
  const validData = Array.isArray(data) ? data : []

  const table = useReactTable({
    data: validData,
    columns: validColumns,
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

  const getHeaderCells = (row: Row<TData>) => {
    const cells = row.getVisibleCells()
    if (!cells || cells.length === 0) return []

    return cells.filter((cell, index) => {
      const columnDef = cell.column.columnDef as Partial<ExtendedColumnDef<TData>>
      return columnDef.mobileOptions?.showInHeader || (index === 0 && !columnDef.mobileOptions)
    })
  }

  const getPreviewCells = (row: Row<TData>) => {
    const cells = row.getVisibleCells()
    if (!cells || cells.length === 0) return []

    return cells.filter((cell) => {
      const columnDef = cell.column.columnDef as Partial<ExtendedColumnDef<TData>>
      return columnDef.mobileOptions?.showInPreview && !columnDef.mobileOptions?.showInHeader
    })
  }

  const getDetailCells = (row: Row<TData>) => {
    const cells = row.getVisibleCells()
    if (!cells || cells.length === 0) return []

    return cells.filter((cell) => {
      const columnDef = cell.column.columnDef as Partial<ExtendedColumnDef<TData>>
      return !columnDef.mobileOptions?.showInHeader && !columnDef.mobileOptions?.showInPreview
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
                    {headerCells.map((cell) => (
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
                    {previewCells.map((cell) => {
                      const columnDef = cell.column.columnDef as Partial<ExtendedColumnDef<TData>>
                      return (
                        <div key={cell.id} className="flex items-center justify-between py-1">
                          <span className="text-sm text-gray-500">
                            {columnDef.mobileOptions?.mobileLabel || String(columnDef.header || "")}
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
                    {detailCells.map((cell) => {
                      const columnDef = cell.column.columnDef as Partial<ExtendedColumnDef<TData>>
                      return (
                        <div key={cell.id} className="flex flex-col">
                          <span className="text-sm text-gray-500">
                            {columnDef.mobileOptions?.mobileLabel || String(columnDef.header || "")}
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