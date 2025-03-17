import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchPatientImplantedDevice } from "@/services/implantedDevices";
import { Device } from "@/types/implantedDevices";
import ImplantedDevicesDialog from "./ImplantedDevicesDialog";
import { useCallback, useEffect, useState } from "react";
import { columns } from "./columns";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

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
      <ImplantedDevicesDialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          fetchDevices();
        }}
        userDetailsId={userDetailsId}
      />
      <ScrollArea className="flex">
        <div className="space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <DefaultDataTable
              title={"Implanted Devices"}
              onAddClick={() => {
                setIsOpen(true);
              }}
              columns={columns()}
              data={data || []}
              pageNo={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ImplantedDevices;
