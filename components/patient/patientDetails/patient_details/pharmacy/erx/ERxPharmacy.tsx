"use client";

import PharmacyDialog from "@/components/charts/Encounters/Details/Pharmacy/PharmacyDialog";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import { useToast } from "@/hooks/use-toast";
import {
  deleteUserPharmacyData,
  getUserPharmacyData,
} from "@/services/chartDetailsServices";
import { showToast } from "@/utils/utils";
import { Trash2Icon } from "lucide-react";
import TableShimmer from "@/components/custom_buttons/table/TableShimmer";

interface ERxPharmacyProps {
  userDetailsId: string;
}

function ERxPharmacy({ userDetailsId }: ERxPharmacyProps) {
  // Dialog State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [eRxData, setERxData] = useState<UserPharmacyInterface>();
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const fetchUserPharmacy = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getUserPharmacyData({
        userDetailsId,
      });

      if (response) {
        setERxData(response);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log("Error", err);
      }
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  const handleDeleteUserPharmacy = async (pharmacyId: string) => {
    setLoading(true);

    try {
      await deleteUserPharmacyData({ pharmacyId });

      showToast({
        toast,
        type: "success",
        message: `Pharmacy deleted successfully`,
      });
      fetchUserPharmacy();
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Pharmacy delete failed`,
        });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPharmacy();
  }, [fetchUserPharmacy]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4 items-center text-lg font-semibold">
        <span>eRx Pharmacy</span>
        <Button variant="ghost" onClick={() => setIsOpen(true)}>
          Add
        </Button>
        <PharmacyDialog
          isOpen={isOpen}
          userDetailsId={userDetailsId}
          onClose={() => {
            setIsOpen(false);
            fetchUserPharmacy();
          }}
        />
      </div>
      {loading ? (
        <TableShimmer />
      ) : (
        <Table className="border rounded-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eRxData ? (
              <TableRow>
                <TableCell>{eRxData.name}</TableCell>
                <TableCell>{eRxData.address}</TableCell>
                <TableCell>{eRxData.phoneNumber}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteUserPharmacy(eRxData.id)}
                  >
                    <Trash2Icon color="#84012A" />
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No Pharmacy Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {/* <ERxPharmacyTable userDetailsId={userDetailsId} /> */}
    </div>
  );
}

export default ERxPharmacy;
