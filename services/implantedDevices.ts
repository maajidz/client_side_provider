import ApiFetch from "@/config/api";
import {
  CreateImplantedDevices,
  ImplantDeviceResponse,
  ImplantedDevices,
} from "@/types/implantedDevices";

export const verifyImplantedDevices = async ({ udi }: { udi: string }) => {
  const response = await ApiFetch({
    url: `/provider/implanted-devices/type/${udi}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ImplantedDevices = await response.data;
  return data;
};

export const createPatientImplantedDevice = async ({
  requestData,
}: {
  requestData: CreateImplantedDevices;
}) => {
  const response = await ApiFetch({
    url: `/provider/implanted-devices`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data: ImplantedDevices = await response.data;
  return data;
};

export const fetchPatientImplantedDevice = async ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/implanted-devices/${userDetailsId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ImplantDeviceResponse = await response.data;
  return data;
};
