import ApiFetch from "@/config/api";
import { CreateMedicationInterface, MedicationInterface, UserMedicationInterface } from "@/types/medicationInterface";

export const fetchMedications = async ({ pageNo }: { pageNo: string }) => {
    const response = await ApiFetch({
      method: "get",
      url: `/admin/provider-requests?page=${pageNo}`,
    });
    console.log(response.data);
    const data: MedicationInterface = await response.data;
    console.log(data);
    return data;
};

export const createNewMedication = async ({
  requestData,
}: {
  requestData: CreateMedicationInterface;
}) => {
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
};

export const fetchUserMedicationType = async ({ pageNo }: { pageNo: number }) => {
    const response = await ApiFetch({
      method: 'get',
      url: `/medication/medication-type/all?page=${pageNo}`
    });
    console.log(response.data);
    const data: MedicationInterface = await response.data;
    console.log(data);
    return data;
}

export const fetchUserMedicationData = async ({ userDetailsId }: { userDetailsId: string }) => {
    const response = await ApiFetch({
      method: 'get',
      url: `/medication/user/${userDetailsId}?page=1`
    });
    console.log(response.data);
    const data: UserMedicationInterface = await response.data;
    console.log(data);
    return data
}