import ApiFetch from "@/config/api";
import { CreateLabResults } from "@/types/labResults";

export const createLabResultRequest = async ({
    requestData,
  }: {
    requestData: CreateLabResults;
  }) => {
    const response = await ApiFetch({
      method: "POST",
      url: "/provider/lab/results",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    });
    console.log(response.data);
    const data = await response.data;
    return data;
  };
  