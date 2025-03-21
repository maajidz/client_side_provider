import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getImagesOrdersData } from "@/services/chartsServices";
import { ImageOrdersResponseInterface } from "@/types/chartsInterface";
import { Button } from "@/components/ui/button";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { ColumnDef } from "@tanstack/react-table";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

interface ImageTest {
  name: string;
}

interface ImageOrder {
  imageType: {
    name: string;
  };
  imageTests: ImageTest[];
  createdAt: string;
}

const PastImageOrders = ({ userDetailsId }: { userDetailsId: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<ImageOrdersResponseInterface>();
  const limit = 8;
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPages] = useState(1);

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getImagesOrdersData({ page, limit, userDetailsId });
      if (data) {
        setResponse(data);
        setTotalPages(Math.ceil(data.total / limit));
      }
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [page, userDetailsId]);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

  const columns: ColumnDef<ImageOrder>[] = [
    {
      header: "Image Name",
      accessorKey: "imageType.name",
      cell: ({ getValue }) => getValue<string>() || "N/A",
    },
    {
      header: "Test Name",
      accessorKey: "imageTests",
      cell: ({ getValue }) =>
        getValue<ImageTest[]>()
          .map((test) => test.name)
          .join(", ") || "N/A",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ getValue }) => getValue<string>().split("T")[0],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>Past Orders</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Past Orders</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <>
          {loading ? (
            <TableShimmer />
          ) : response?.data ? (
            <DefaultDataTable
              columns={columns}
              data={response.data}
              pageNo={page}
              totalPages={totalPage}
              onPageChange={(newPage) => setPage(newPage)}
            />
          ) : (
            <div>No previous orders</div>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export default PastImageOrders;
