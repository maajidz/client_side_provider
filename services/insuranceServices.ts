import ApiFetch from "@/config/api";
import {
  CreateInsuranceInterface,
  InsuranceResponse,
  UpdateInsuranceType,
} from "@/types/insuranceInterface";

export const createInsurance = async ({
  requestData,
}: {
  requestData: CreateInsuranceInterface;
}) => {
  const response = await ApiFetch({
    url: "/provider/insurance",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const getInsuranceData = async ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/insurance/${userDetailsId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: InsuranceResponse = await response.data;
  return data;
};

export const updateInsurance = async ({
  requestData,
  id,
}: {
  requestData: UpdateInsuranceType;
  id: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/insurance/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const deleteInsuranceData = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    url: `/provider/insurance/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};
