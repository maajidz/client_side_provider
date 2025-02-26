"use client";

import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DefaultDataTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageNo: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  // clickAddButton?: React.Dispatch<React.SetStateAction<boolean>>;
  onAddClick?: () => void;
}

export function DefaultDataTable<TData, TValue>({
  title,
  columns,
  data,
  pageNo,
  totalPages,
  onPageChange,
  onAddClick,
}: DefaultDataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <span className="font-bold text-lg">{title}</span>
          <Button variant="ghost" onClick={onAddClick}>
            {" "}
            Add{" "}
          </Button>
        </div>
        <div className="flex flex-row text-sm items-center gap-2">
          <div className="text-gray-400">
            Page {pageNo} of {totalPages}
            {/* {table.getPageCount()} */}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageNo - 1)}
              disabled={pageNo <= 1}
            >
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
      <ScrollArea className="h-full rounded-md border">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="px-4 py-2" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="hover:text-sky-600 hover:bg-sky-50/50 hover:cursor-pointer font-medium"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="px-4 py-3" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
