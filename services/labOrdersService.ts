import ApiFetch from "@/config/api";
import { LabOrdersInterface } from "@/types/chartsInterface";

export const createLabOrders = async ({
  requestData,
}: {
  requestData: LabOrdersInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab/orders",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};
