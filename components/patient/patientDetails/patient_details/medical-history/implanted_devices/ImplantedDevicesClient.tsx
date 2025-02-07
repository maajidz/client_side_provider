import { CustomDataTable } from "@/components/custom_buttons/table/CustomDataTable";
import LoadingButton from "@/components/LoadingButton";
import { fetchPatientImplantedDevice } from "@/services/implantedDevices";
import { Device } from "@/types/implantedDevices";
import React, { useCallback, useEffect, useState } from "react";
import { columns } from "./columns";

const ImplantedDevicesClient = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [data, setData] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDevices = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchPatientImplantedDevice({
        userDetailsId,
      });

      if (response) {
        setData(response.organizedData);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      }
    } catch (e) {
      console.log("Error", e);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  if (loading) return <LoadingButton />;

  return (
    <>
      <CustomDataTable
        columns={columns()}
        data={data || []}
        pageNo={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>
  );
};

export default ImplantedDevicesClient;
