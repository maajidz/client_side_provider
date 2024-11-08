import ApiFetch from "@/config/api";
import { LoginInterface, LoginResponse } from "@/types/loginInterface";

export const providerLogin = async ({
    requestData,
  }: {
    requestData: LoginInterface;
  }) => {
    try {
      const response = await ApiFetch({
        method: "POST",
        url: "/provider/auth/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      });
      console.log(response.data);
      const data:LoginResponse = await response.data;
      return data;
    } catch (error) {
      console.error("Error submitting form:", error);
      return null;
    }
  };