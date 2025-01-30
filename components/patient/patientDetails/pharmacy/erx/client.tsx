"use client";

import LoadingButton from "@/components/LoadingButton";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import {
  deleteUserPharmacyData,
  getUserPharmacyData,
} from "@/services/chartDetailsServices";
import { UserPharmacyInterface } from "@/types/pharmacyInterface";
import { showToast } from "@/utils/utils";
import { columns } from "./column";
import { useCallback, useEffect, useState } from "react";

interface ERxPharmacyClientProps {
  userDetailsId: string;
}

function ERxPharmacyClient({ userDetailsId }: ERxPharmacyClientProps) {
  // eRx State
  const [eRxData, setERxData] = useState<UserPharmacyInterface>();

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const {toast} = useToast();

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
    } catch (err) {
      if (err instanceof Error)
        showToast({
          toast,
          type: "error",
          message: `Pharmacy delete failed`,
        });
    } finally {
      setLoading(false);
      fetchUserPharmacy();
    }
  };

  // Effects
  useEffect(() => {
    fetchUserPharmacy();
  }, [fetchUserPharmacy]);

  if (loading) return <LoadingButton />;

  return (
    <>
      <DataTable
        searchKey="eRx"
        columns={columns(handleDeleteUserPharmacy)}
        data={eRxData ? [eRxData] : []}
        pageNo={1}
        totalPages={1}
        onPageChange={() => {}}
      />
    </>
  );
}

export default ERxPharmacyClient;
