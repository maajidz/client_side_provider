import ApiFetch from "@/config/api";
import { CreatePrescriptionInterface } from "@/types/chartsInterface";
import { PrescriptionResponseInterface, UpdatePrescriptionInterface } from "@/types/prescriptionInterface";

export const getUserPrescriptionsData = async ({
  userDetailsId,
  page,
  limit,
}: {
  userDetailsId: string;
  page: number;
  limit: number;
}) => {
  const response = await ApiFetch({
    url: `/provider/prescriptions/patient/${userDetailsId}?page=${page}&limit=${limit}`,
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
    url: `/provider/prescriptions/patient/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};
