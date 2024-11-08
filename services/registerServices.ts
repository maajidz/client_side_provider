import ApiFetch from "@/config/api";
import { ProviderDetails } from "@/types/providerDetailsInterface";
import { RegisterInterface, RegisterResponseInterface } from "@/types/registerInterface";

export const registerProvider = async ({
  requestData,
}: {
  requestData: RegisterInterface;
}) => {
  try {
    const response = await ApiFetch({
      method: "POST",
      url: "/provider/auth/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    });
    console.log(response.data);
    const data:RegisterResponseInterface = await response.data;
    return data;
  } catch (error) {
    console.error("Error submitting form:", error);
    return null;
  }
};

export const sendProviderDetails = async ({
  requestData,
}: {
  requestData: ProviderDetails;
}) => {
  try {
    const response = await ApiFetch({
      method: "POST",
      url: "/provider-details",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    });
    console.log(response.data);
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error submitting form:", error);
    return null;
  }
};