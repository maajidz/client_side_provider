import ApiFetch from "@/config/api";
import { LoginInterface, LoginResponse } from "@/types/loginInterface";

export const providerLogin = async ({
  requestData,
}: {
  requestData: LoginInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/auth/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: LoginResponse = await response.data;
  return data;
};