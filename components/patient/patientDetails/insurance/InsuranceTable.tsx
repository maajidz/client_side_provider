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
import { InsuranceResponse } from "@/types/insuranceInterface";
import AddOrViewNotes from "./actions/AddOrViewNotes";
import { Ellipsis } from "lucide-react";
import { useState } from "react";

interface InsuranceTableProps {
  insuranceData: InsuranceResponse | undefined;
  setIsDialogOpen: (status: boolean) => void;
  setSelectedInsurance: (insuranceData: InsuranceResponse | undefined) => void;
}

function InsuranceTable({
  insuranceData,
  setIsDialogOpen,
  setSelectedInsurance,
}: InsuranceTableProps) {
  // Notes Dialog
  const [isOpenNotesDialog, setIsOpenNotesDialog] = useState(false);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Group Name or Number</TableHead>
            <TableHead>Subscriber Number</TableHead>
            <TableHead>ID Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {insuranceData ? ( // Ensure insuranceData exists before rendering
            <TableRow>
              <TableCell>{insuranceData.type}</TableCell>
              <TableCell>{insuranceData.companyName}</TableCell>
              <TableCell>{insuranceData.groupNameOrNumber}</TableCell>
              <TableCell>{insuranceData.subscriberNumber}</TableCell>
              <TableCell>{insuranceData.idNumber}</TableCell>
              <TableCell
                className={`cursor-pointer capitalize ${
                  insuranceData.status === "active"
                    ? "text-[#067647]"
                    : "text-[#B42318]"
                }`}
              >
                {insuranceData.status}
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
                    <DropdownMenuItem className="cursor-pointer">
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
