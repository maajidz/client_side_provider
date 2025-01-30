import ApiFetch from "@/config/api";
import {
  CreateInsuranceInterface,
  InsuranceResponse,
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
      "Content-Type": "application/json",
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
