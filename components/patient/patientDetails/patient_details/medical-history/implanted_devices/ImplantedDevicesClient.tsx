import { CustomDataTable } from "@/components/custom_buttons/table/CustomDataTable";
import LoadingButton from "@/components/LoadingButton";
import { Device } from "@/types/implantedDevices";
import { columns } from "./columns";
import { Dispatch, SetStateAction } from "react";

interface ImplantedDevicesClientProps {
  data: Device[];
  loading: boolean;
  pageNo: number;
  totalPages: number;
  onSetPageNo: Dispatch<SetStateAction<number>>;
}

const ImplantedDevicesClient = ({
  data,
  loading,
  pageNo,
  totalPages,
  onSetPageNo
}: ImplantedDevicesClientProps) => {
  if (loading) return <LoadingButton />;

  return (
    <>
      <CustomDataTable
        columns={columns()}
        data={data || []}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage) => onSetPageNo(newPage)}
      />
    </>
  );
};

export default ImplantedDevicesClient;
