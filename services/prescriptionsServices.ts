import ApiFetch from "@/config/api";
import {
  PrescriptionResponseInterface,
  UpdatePrescriptionInterface,
} from "@/types/prescriptionInterface";

export const getUserPrescriptionsData = async ({
  userDetailsId,
  page,
  limit,
  providerId,
}: {
  userDetailsId: string;
  page: number;
  limit: number;
  providerId?: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/prescriptions/patient/${userDetailsId}?page=${page}&limit=${limit}&providerId=${providerId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: PrescriptionResponseInterface = await response.data;
  return data;
};

export const updateUserPrescription = async ({
  requestData,
  id,
}: {
  requestData: UpdatePrescriptionInterface;
  id: string;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/prescriptions/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const deleteUserPrescriptionsData = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    url: `/provider/prescriptions/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};
