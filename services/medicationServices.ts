import ApiFetch from "@/config/api";
import { CreateMedicationInterface, MedicationInterface, UserMedicationInterface } from "@/types/medicationInterface";

export const fetchMedications = async ({ pageNo }: { pageNo: string }) => {
  try {
    const response = await ApiFetch({
      method: "get",
      url: `/admin/provider-requests?page=${pageNo}`,
    });
    console.log(response.data);
    const data: MedicationInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
    return null;
  }
};

export const createNewMedication = async ({
  requestData,
}: {
  requestData: CreateMedicationInterface;
}) => {
  try {
    const response = await ApiFetch({
      method: "POST",
      url: "/admin/medication/type",
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

export const fetchUserMedicationType = async ({ pageNo }: { pageNo: number }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/medication/medication-type/all?page=${pageNo}`
    });
    console.log(response.data);
    const data: MedicationInterface = await response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching response", error);
  }
}

export const fetchUserMedicationData = async ({ userDetailsId }: { userDetailsId: string }) => {
  try {
    const response = await ApiFetch({
      method: 'get',
      url: `/medication/user/${userDetailsId}?page=1`
    });
    console.log(response.data);
    const data: UserMedicationInterface = await response.data;
    console.log(data);
    return data
  } catch (error) {
    console.error("Error fetching response", error);
  }
}