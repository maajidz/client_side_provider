import ApiFetch from "@/config/api";
import { ProviderAppointmentsInterface, ProviderAppointmentsStatus } from "@/types/appointments";

export const fetchProviderAppointments = async ({ providerId, page, limit, startDate, endDate }: { providerId: string, page: number, limit: number, startDate: string, endDate: string }) => {
    const response = await ApiFetch({
      method: 'GET',
      url: `/provider/appointments/${providerId}?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
    });
    console.log(response.data);
    const data: ProviderAppointmentsInterface = await response.data;
    console.log(data);
    return data
}

export const updateAppointmentStatus = async({appointmentID, requestData}: {appointmentID: string,requestData: ProviderAppointmentsStatus}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/appointments/status/${appointmentID}`,
    data: requestData,
  });
  const data = await response.data;
  return data;
}