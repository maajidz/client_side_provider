import LoadingButton from "@/components/LoadingButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { deleteInsuranceData } from "@/services/insuranceServices";
import { InsuranceResponse } from "@/types/insuranceInterface";
import { showToast } from "@/utils/utils";
import AddOrViewNotes from "./actions/AddOrViewNotes";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface InsuranceTableProps {
  insuranceData: InsuranceResponse | undefined;
  setIsDialogOpen: (status: boolean) => void;
  setSelectedInsurance: (insuranceData: InsuranceResponse | undefined) => void;
  onFetchInsuranceData: () => Promise<void>;
}

function InsuranceTable({
  insuranceData,
  setIsDialogOpen,
  setSelectedInsurance,
  onFetchInsuranceData
}: InsuranceTableProps) {
  // Loading State
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [isOpenNotesDialog, setIsOpenNotesDialog] = useState(false);

  // Toast State
  const { toast } = useToast();

  // DELETE Insurance Data
  const handleDeleteInsuranceData = async (id: string) => {
    setLoading(true);

    try {
      await deleteInsuranceData({ id });

      showToast({
        toast,
        type: "success",
        message: "Insurance data deleted successfully",
      });
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Failed to delete insurance data",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "Failed to delete insurance data. An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
      await onFetchInsuranceData();
    }
  };

  return (
    <>
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Group Name or Number</TableHead>
            <TableHead>Subscriber Number</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        {loading && <LoadingButton />}
        <TableBody>
          {insuranceData ? (
            <TableRow>
              <TableCell>{insuranceData.type}</TableCell>
              <TableCell>{insuranceData.companyName}</TableCell>
              <TableCell>{insuranceData.groupNameOrNumber}</TableCell>
              <TableCell>{insuranceData.subscriberNumber}</TableCell>
              <TableCell>{insuranceData.idNumber}</TableCell>
              <TableCell>
                <Badge variant={`${insuranceData.status === "active" ? "success" : "warning"}`}>
                {insuranceData.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => {
                        setIsDialogOpen(true);
                        setSelectedInsurance(insuranceData);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => setIsOpenNotesDialog(true)}
                    >
                      Add/View Notes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() =>
                        handleDeleteInsuranceData(insuranceData.id)
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      Mark as Inactive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                No Insurance Data Available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Notes Dialog */}
      <AddOrViewNotes
        isOpen={isOpenNotesDialog}
        onSetIsOpenNotesDialog={setIsOpenNotesDialog}
      />
    </>
  );
}

export default InsuranceTable;
