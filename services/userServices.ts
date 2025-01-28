import ApiFetch from "@/config/api";
import {
  CreateUser,
  PatientCareTeamInterface,
  PatientDetailsInterface,
  PatientMedicationInterface,
  PaymentInterface,
  UserAppointmentInterface,
  UserData,
  UserFormInterface,
  UserResponseInterface,
  UserSubscription,
} from "@/types/userInterface";

export const fetchUserDataResponse = async ({
  pageNo,
  pageSize,
  firstName,
  lastName,
}: {
  pageNo?: number;
  pageSize?: number;
  firstName?: string;
  lastName?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (pageNo) queryParams.append("pageNo", pageNo.toString());
    if (pageSize) queryParams.append("pageSize", pageSize.toString());
    if (firstName) queryParams.append("firstName", firstName);
    if (lastName) queryParams.append("lastName", lastName);

    const response = await ApiFetch({
      method: "get",
      url: `/provider/patients/all?${queryParams}`,
    });

    const data: UserResponseInterface = await response.data;
    return data;
  } catch (error) {
    console.log("Error fetching response", error);
    return null;
  }
};

export const createNewPatient = async ({
  requestData,
}: {
  requestData: CreateUser;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: `/provider/patients/add`,
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  console.log(data);
  return data;
};

export const fetchUserInfo = async ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/provider/patients/${userDetailsId}`,
    });

    const data: PatientDetailsInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error fetching response", error);
    return null;
  }
};

export const fetchUserAppointments = async ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/appointments/${userDetailsId}?q=ALL`,
    });
    console.log(response.data);
    const data: UserAppointmentInterface[] = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
};

export const fetchUserSubscriptions = async ({
  userDetailsId,
  pageSize,
}: {
  userDetailsId: string;
  pageSize: number;
}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/billing/subscription/${userDetailsId}?pageSize=${pageSize}`,
    });
    console.log(response.data);
    const data: UserSubscription = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
};

export const fetchUserPayments = async ({
  userDetailsId,
  pageNo,
}: {
  userDetailsId: string;
  pageNo: number;
}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/admin/payments/${userDetailsId}?page=${pageNo}`,
    });
    console.log(response.data);
    const data: PaymentInterface = await response.data;
    console.log(data);
    return data.payments;
  } catch (error) {
    console.error("Error fetching response", error);
  }
};

export const fetchUserMedication = async ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/medication/user/${userDetailsId}`,
    });
    console.log(response.data);
    const data: PatientMedicationInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
};

export const fetchUserForms = async ({
  formType,
  userDetailsId,
}: {
  formType: string;
  userDetailsId: string;
}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/health-assessments/${formType}/${userDetailsId}`,
    });
    console.log(response.data);
    const data: UserFormInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
};

export const fetchOnboardingUserForms = async ({
  formType,
  userDetailsId,
}: {
  formType: string;
  userDetailsId: string;
}) => {
  const response = await ApiFetch({
    method: "get",
    url: `/user-answers/${formType}/${userDetailsId}`,
  });
  console.log(response.data);
  const data: UserFormInterface = await response.data;
  console.log(data);
  return data;
};

//care team

export const fetchUserCareTeam = async ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/provider/patients/care-team/${userDetailsId}`,
    });

    const data: PatientCareTeamInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log("Error fetching response", error);
    return null;
  }
};
