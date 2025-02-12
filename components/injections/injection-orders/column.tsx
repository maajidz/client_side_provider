import { Button } from "@/components/ui/button";
import { deleteInjectionOrder } from "@/services/injectionsServices";
import { InjectionsInterface } from "@/types/injectionsInterface";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";

const handleInjectionsDelete = async (
  injectionId: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void
) => {
  setLoading(true);
  try {
    await deleteInjectionOrder({ injectionId: injectionId });
    showToast({
      type: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete task" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  setLoading,
  showToast,
  fetchInjectionList,
}: {
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
  fetchInjectionList: () => void;
}): ColumnDef<InjectionsInterface>[] => [
  {
    accessorKey: "userDetails.user.firstName",
    header: "Patient",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.original.userDetails.user.firstName}{" "}
        {row.original.userDetails.user.lastName}
      </div>
    ),
  },
  {
    accessorKey: "injection_name",
    header: "Drug Name",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("injection_name")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Ordered On",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.original.createdAt).toDateString()}
      </div>
    ),
  },
  {
    accessorKey: "providerName",
    header: "Ordered By",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("providerName")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.status.trim().toLowerCase() === "pending"
              ? "text-yellow-500 font-semibold cursor-pointer"
              : "text-green-500 font-semibold cursor-pointer"
          }
        >
          {row.original.status.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => (
      <Button
        variant={"ghost"}
        onClick={() => {
          handleInjectionsDelete(row.original.id, setLoading, showToast);
          fetchInjectionList();
        }}
      >
        <Trash2Icon color="#84012A" />
      </Button>
    ),
  },
];
