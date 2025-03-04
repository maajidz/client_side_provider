"use client";

import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  deleteUserPharmacyData,
  getUserPharmacyData,
} from "@/services/chartDetailsServices";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import { showToast } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";

interface ERxPharmacyClientProps {
  userDetailsId: string;
}

function ERxPharmacyTable({ userDetailsId }: ERxPharmacyClientProps) {
  // eRx State
  const [eRxData, setERxData] = useState<UserPharmacyInterface>();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // GET User Pharmacy
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

  // DELETE User Pharmacy
  const handleDeleteUserPharmacy = async (pharmacyId: string) => {
    setLoading(true);

    try {
      await deleteUserPharmacyData({ pharmacyId });

      showToast({
        toast,
        type: "success",
        message: `Pharmacy deleted successfully`,
      });
      setERxData(undefined);
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

  // Effects
  useEffect(() => {
    fetchUserPharmacy();
  }, [fetchUserPharmacy]);

  if (loading) return <LoadingButton />;

  return (
    <>
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
    </>
  );
}

export default ERxPharmacyTable;
