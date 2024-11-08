import ApiFetch from "@/config/api";
import { PatientMedicationInterface, PaymentInterface, UserAppointmentInterface, UserFormInterface, UserInfo, UserResponseInterface, UserSubscription } from "@/types/userInterface";

export const fetchUserDataResponse = async ({ pageNo }: { pageNo: number }) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/admin/users/list?page=${pageNo}&pageSize=15`,
    });
    console.log(response.data);
    const data: UserResponseInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
};

export const fetchUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/admin/users/info/${userId}`,
    });
    console.log(response.data);
    const data: UserInfo = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
};

export const fetchUserAppointments = async ({ userDetailsId }: { userDetailsId: string }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/appointments/${userDetailsId}?q=ALL`
    });
    console.log(response.data);
    const data: UserAppointmentInterface[] = await response.data;
    console.log(data);
    return data
  } catch (error) {
    console.error("Error fetching response", error);
  }
}

export const fetchUserSubscriptions = async ({ userDetailsId, pageSize }: { userDetailsId: string, pageSize: number }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/billing/subscription/${userDetailsId}?pageSize=${pageSize}`
    });
    console.log(response.data);
    const data: UserSubscription = await response.data;
    console.log(data);
    return data
  } catch (error) {
    console.error("Error fetching response", error);
  }
}

export const fetchUserPayments = async ({ userDetailsId, pageNo }: { userDetailsId: string, pageNo: number }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/admin/payments/${userDetailsId}?page=${pageNo}`
    });
    console.log(response.data);
    const data: PaymentInterface = await response.data;
    console.log(data);
    return data.payments
  } catch (error) {
    console.error("Error fetching response", error);
  }
}

export const fetchUserMedication = async ({ userDetailsId }: { userDetailsId: string }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/medication/user/${userDetailsId}`
    });
    console.log(response.data);
    const data: PatientMedicationInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
}

export const fetchUserForms = async ({ formType, userDetailsId }: { formType: string, userDetailsId: string }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/health-assessments/${formType}/${userDetailsId}`
    });
    console.log(response.data);
    const data: UserFormInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
}

export const fetchOnboardingUserForms = async ({ formType, userDetailsId }: { formType: string, userDetailsId: string }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/user-answers/${formType}/${userDetailsId}`
    });
    console.log(response.data);
    const data: UserFormInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
}
