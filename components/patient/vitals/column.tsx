import { Button } from "@/components/ui/button";
import { deleteVitalData } from "@/services/vitalsServices";
import { VitalsInterface } from "@/types/vitalsInterface";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, Trash2Icon } from "lucide-react";

const handleDeleteVitalData = async (
  id: string,
  setLoading: (loading: boolean) => void,
  showToast: (args: { type: string; message: string }) => void,
  getVitalsData: () => void
) => {
  setLoading(true);

  try {
    await deleteVitalData({ id });
    showToast({
      type: "success",
      message: "Vital data deleted successfully",
    });

    getVitalsData();
  } catch (error) {
    console.error("Error:", error);
    showToast({ type: "error", message: "Failed to delete vital data" });
  } finally {
    setLoading(false);
  }
};

export const columns = ({
  fetchVitalsData,
  setEditData,
  setIsDialogOpen,
  setLoading,
  showToast,
}: {
  fetchVitalsData: () => void;
  setEditData: React.Dispatch<
    React.SetStateAction<VitalsInterface | undefined>
  >;
  setIsDialogOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  showToast: (args: { type: string; message: string }) => void;
}): ColumnDef<VitalsInterface>[] => [
  {
    header: "Date",
    accessorKey: "dateTime",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {new Date(row.getValue("dateTime")).toDateString()}
      </div>
    ),
  },
  {
    header: "Weight",
    accessorKey: "weightLbs",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.getValue("weightLbs")} lbs {row.original.heightInches} ozs
      </div>
    ),
  },
  {
    header: "Height",
    accessorKey: "heightFeets",
    cell: ({ row }) => (
      <div className="cursor-pointer">
        {row.getValue("weightLbs")}ft. {row.original.heightInches} ins.
      </div>
    ),
  },
  {
    header: "BMI",
    accessorKey: "BMI",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("BMI")}</div>
    ),
  },
  {
    header: "Starting Weight (lbs)",
    accessorKey: "startingWeight",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("startingWeight")}</div>
    ),
  },
  {
    header: "Goal Weight (lbs)",
    accessorKey: "goalWeight",
    cell: ({ row }) => (
      <div className="cursor-pointer">{row.getValue("goalWeight")}</div>
    ),
  },
  {
    header: "Action",
    accessorKey: "id",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 cursor-pointer">
        <Button
          variant="outline"
          className="outline-none border-none bg-transparent"
          onClick={() => {
            setIsDialogOpen(true);
            setEditData({
              id: row.original.id,
              dateTime: row.original.dateTime,
              weightLbs: row.original.weightLbs,
              weightOzs: row.original.weightOzs,
              heightFeets: row.original.heightFeets,
              heightInches: row.original.heightInches,
              startingWeight: row.original.startingWeight,
              goalWeight: row.original.goalWeight,
              BMI: row.original.BMI,
              providerId: row.original.providerId,
              userDetailsId: row.original.userDetailsId,
            });
          }}
        >
          <Edit2Icon color="#84012A" />
        </Button>
        <Button
          variant="outline"
          className="outline-none border-none bg-transparent"
          onClick={() => {
            handleDeleteVitalData(
              row.original.id,
              setLoading,
              showToast,
              fetchVitalsData
            );
          }}
        >
          <Trash2Icon color="#84012A" />
        </Button>
      </div>
    ),
  },
];
