import ApiFetch from "@/config/api";
import { CreateEncounterInterface } from "@/types/chartsInterface";

export const createEncounterRequest = async ({
    requestData,
  }: {
    requestData: CreateEncounterInterface;
  }) => {
      const response = await ApiFetch({
        method: "POST",
        url: "/provider/encounter",
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      });
      console.log(response.data);
      const data = await response.data;
      return data;
  };
  