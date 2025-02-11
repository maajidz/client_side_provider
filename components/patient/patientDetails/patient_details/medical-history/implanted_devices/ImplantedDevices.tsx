import GhostButton from "@/components/custom_buttons/buttons/GhostButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchPatientImplantedDevice } from "@/services/implantedDevices";
import { Device } from "@/types/implantedDevices";
import ImplantedDevicesClient from "./ImplantedDevicesClient";
import ImplantedDevicesDialog from "./ImplantedDevicesDialog";
import { useCallback, useEffect, useState } from "react";

const ImplantedDevices = ({ userDetailsId }: { userDetailsId: string }) => {
  // Dialog State
  const [isOpen, setIsOpen] = useState(false);

  // Data State
  const [data, setData] = useState<Device[]>([]);

  // Loading State
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDevices = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchPatientImplantedDevice({
        userDetailsId,
        page,
        limit: itemsPerPage,
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
  }, [userDetailsId, page]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center p-4 text-lg font-semibold rounded-md bg-[#f0f0f0]">
        <span>Implanted Devices</span>
        <GhostButton onClick={() => setIsOpen(true)}>Add </GhostButton>
        <ImplantedDevicesDialog
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            fetchDevices();
          }}
          userDetailsId={userDetailsId}
        />
      </div>
      <ScrollArea className="h-[12.5rem] min-h-10">
        <div></div>
        <ImplantedDevicesClient
          data={data}
          loading={loading}
          pageNo={page}
          totalPages={totalPages}
          onSetPageNo={setPage}
        />
      </ScrollArea>
    </div>
  );
};

export default ImplantedDevices;
