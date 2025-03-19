import ApiFetch from "@/config/api";

import {
  AlertInterface,
  AlertResponseInterface,
  AlertTypeInterface,
  UpdateAlertInterface,
} from "@/types/alertInterface";
import {
  AllergenResponseInterfae,
  AllergeyRequestInterface,
  AllergyTypeResponse,
  UpdateAllergenInterface,
} from "@/types/allergyInterface";
import {
  FamilyHistoryInterface,
  FamilyHistoryResponseInterface,
  UpdateFamilyHistoryInterface,
} from "@/types/familyHistoryInterface";
import {
  CreateMedicationPrescriptionInterface,
  MedicationListResponseInterface,
  MedicationPrescriptionResponseInterface,
  MedicationQueryParamsInterface,
  UpdateMedicationPrescriptionType,
} from "@/types/medicationInterface";
import {
  AddPharmacyInterface,
  PharmacyInterface,
  PharmacyRequestInterface,
  UserPharmacyInterface,
} from "@/types/pharmacyInterface";
import {
  ProcedureResponse,
  ProceduresInterface,
  ProceduresTypesResponseInterface,
} from "@/types/procedureInterface";
import {
  RecallsData,
  RecallsInterface,
  RecallsResponseInterface,
  UpdateRecallsInterface,
} from "@/types/recallsInterface";
import {
  StickyNotesInterface,
  StickyNotesResponse,
  StickyNotesResponseInterface,
  UpdateStickyNotesInterface,
} from "@/types/stickyNotesInterface";
import {
  CreateSupplementType,
  SupplementResponseInterface,
  SupplementTypesResponseInterface,
  UpdateSupplementType,
} from "@/types/supplementsInterface";
import {
  CreateTaskType,
  Status,
  TasksResponseInterface,
  TaskTypeResponse,
  UpdateTaskType,
} from "@/types/tasksInterface";
import {
  CreatePastMedicalHistoryType,
  PastMedicalHistoryResponseInterface,
  UpdatePastMedicalHistoryType,
} from "./pastMedicalHistoryInterface";
import {
  CreateHistoricalVaccineType,
  HistoricalVaccineResponseInterface,
  UpdateHistoricalVaccineType,
} from "@/types/chartsInterface";

//Alerts

export const createAlert = async ({
  requestData,
}: {
  requestData: AlertInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/alerts",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getAlertData = async ({
  page,
  limit,
  userDetailsId,
}: {
  userDetailsId: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/alerts/${userDetailsId}?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: AlertResponseInterface = await response.data;
  return data;
};

export const getAlertTypeData = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/alerts/type/all?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: AlertTypeInterface = await response.data;
  return data;
};

export const updateAlertData = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateAlertInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/alerts/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteAlert = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/alerts/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

//Sticky Notes

export const createStickyNotes = async ({
  requestData,
}: {
  requestData: StickyNotesInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/sticky-notes",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: StickyNotesResponse = await response.data;
  return data;
};

export const getStickyNotesData = async ({
  chartId,
  page,
  limit,
}: {
  chartId: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/sticky-notes/${chartId}?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: StickyNotesResponseInterface = await response.data;
  return data;
};

export const updateStickyNotesData = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateStickyNotesInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/sticky-notes/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteStickyNotes = async ({ chartId }: { chartId: string }) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/sticky-notes/${chartId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

//Recalls

export const createRecalls = async ({
  requestData,
}: {
  requestData: RecallsInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/recalls",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: RecallsData = await response.data;
  return data;
};

// export const getRecallsData = async ({ page, limit, userDetailsId, providerId }: { page: number, limit: number, userDetailsId?: string , providerId?:string}) => {
//     const response = await ApiFetch({
//         method: "GET",
//         url: `/provider/recalls?page=${page}&limit=${limit}${userDetailsId ?? `&userDetailsId=${userDetailsId}`}${providerId ?? `&providerId=${providerId}`}`,
//         headers: {
//             "Content-Type": "application/json",
//         }
//     });
//     console.log(response.data);
//     const data: RecallsResponseInterface = await response.data;
//     return data;
// };

export const getRecallsData = async ({
  page,
  limit,
  userDetailsId,
  providerId,
  category,
  status,
}: {
  page: number;
  limit: number;
  userDetailsId?: string;
  providerId?: string;
  category?: string;
  status?: string;
}) => {
  // Build the query string dynamically based on the parameters provided
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (userDetailsId) {
    queryParams.append("userDetailsId", userDetailsId);
  }
  if (providerId) {
    queryParams.append("providerId", providerId);
  }
  if (category) {
    queryParams.append("category", category);
  }
  if (status) {
    queryParams.append("status", status);
  }

  const url = `/provider/recalls?${queryParams.toString()}`;

  const response = await ApiFetch({
    method: "GET",
    url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: RecallsResponseInterface = await response.data;
  return data;
};

export const updateRecallsData = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateRecallsInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/recalls/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteRecalls = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/recalls/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

// Tasks

export const createTask = async ({
  requestBody,
}: {
  requestBody: CreateTaskType;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/tasks",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  });

  console.log(await response.data);
  const data = await response.data;
  return data;
};

export const getTasks = async ({
  providerId,
  page,
  limit,
  status,
  category,
  dueDate,
  priority,
  userDetailsId,
}: {
  providerId: string;
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  dueDate?: string;
  priority?: string;
  userDetailsId?: string;
}) => {
  const queryParams = new URLSearchParams({
    providerId: providerId,
  });
  if (page) {
    queryParams.append("page", page.toString());
  }
  if (limit) {
    queryParams.append("limit", limit.toString());
  }
  if (status) {
    queryParams.append("status", status);
  }
  if (category) {
    queryParams.append("category", category);
  }
  if (dueDate) {
    queryParams.append("dueDate", dueDate);
  }
  if (priority) {
    queryParams.append("priority", priority);
  }
  if (userDetailsId) {
    queryParams.append("userDetailsId", userDetailsId);
  }

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/tasks/all?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: TasksResponseInterface = await response.data;
  return data;
};

export const getTasksTypes = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (page) {
    queryParams.append("page", page.toString());
  }
  if (limit) {
    queryParams.append("limit", limit.toString());
  }

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/tasks/types/all?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: TaskTypeResponse = await response.data;
  return data;
};

export const updateTask = async ({
  requestData,
  id,
}: {
  requestData: UpdateTaskType;
  id: string;
}) => {
  const response = ApiFetch({
    url: `/provider/tasks/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = (await response).data;
  return data;
};

export const updateTaskStatus = async ({
  requestData,
  id,
}: {
  requestData: Status;
  id: string;
}) => {
  const response = ApiFetch({
    url: `/provider/tasks/status/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = (await response).data;
  return data;
};

export const deleteTask = async ({ id }: { id: string }) => {
  const response = ApiFetch({
    url: `/provider/tasks/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response).data;
  return data;
};

/**
 * * Past Medical History API
 */
export const getPastMedicalHistory = async ({
  userDetailsId,
  page,
  limit,
}: {
  userDetailsId: string;
  page?: number;
  limit?: number;
}) => {
  const response = await ApiFetch({
    url: `/provider/medical-history/${userDetailsId}?page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: PastMedicalHistoryResponseInterface = await response.data;
  return data;
};

export const createPastMedicalHistory = async ({
  requestData,
}: {
  requestData: CreatePastMedicalHistoryType;
}) => {
  const response = await ApiFetch({
    url: `/provider/medical-history`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const updatePastMedicalHistory = async ({
  requestData,
  id,
}: {
  requestData: UpdatePastMedicalHistoryType;
  id: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/medical-history/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const deletePastMedicalHistory = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    url: `/provider/medical-history/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

//Family History

export const createFamilyHistory = async ({
  requestData,
}: {
  requestData: FamilyHistoryInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/family-history",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: FamilyHistoryResponseInterface = await response.data;
  return data;
};

export const getFamilyHistoryData = async ({
  limit,
  page,
  userDetailsId,
}: {
  limit: number;
  page: number;
  userDetailsId: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/family-history?userDetailsId=${userDetailsId}&limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: FamilyHistoryResponseInterface[] = await response.data;
  return data;
};

export const updateFamilyHistoryData = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateFamilyHistoryInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/family-history/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteFamilyHistory = async ({
  familyHistoryId,
}: {
  familyHistoryId: string;
}) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/family-history/${familyHistoryId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

//Allergy

export const createAllergies = async ({
  requestData,
}: {
  requestData: AllergeyRequestInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/allergies",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getAllergiesData = async ({
  limit,
  page,
  userDetailsId,
}: {
  limit: number;
  page: number;
  userDetailsId: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/allergies?userDetailsId=${userDetailsId}&limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: AllergenResponseInterfae[] = await response.data;
  return data;
};

export const getAllergyTypeData = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/allergies/types/all?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: AllergyTypeResponse = await response.data;
  return data;
};

export const updateAllergiesData = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateAllergenInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/allergies/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteAllergies = async ({ allergyId }: { allergyId: string }) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/allergies/${allergyId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

/**
 * * Pharmacy API
 */
export const getPharmacyData = async (params?: PharmacyRequestInterface) => {
  const queryParams = new URLSearchParams({
    address: params?.address || "",
    contact: params?.contact || "",
    name: params?.name || "",
    type: params?.type || "",
    zipCode: params?.zipCode || "",
  }).toString();

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/pharmacy/all?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: PharmacyInterface[] = await response.data;
  return data;
};

export const addPharmacyData = async (requestData: AddPharmacyInterface) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/pharmacy",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const getUserPharmacyData = async ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/pharmacy/user/${userDetailsId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: UserPharmacyInterface = await response.data;
  return data;
};

export const deleteUserPharmacyData = async ({
  pharmacyId,
}: {
  pharmacyId: string;
}) => {
  const response = await ApiFetch({
    url: `/provider/pharmacy/${pharmacyId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  console.log(data);
  return data;
};

/**
 * * Medications API
 */
export const getMedicationData = async (
  params?: MedicationQueryParamsInterface
) => {
  const queryParams = new URLSearchParams({
    strength: params?.strength || "",
    route: params?.route || "",
    doseForm: params?.doseForm || "",
    // Convert to string if it's a number
    // because URLSearchParams requires each value to be a string
    page: params?.page ? String(params.page) : "",
    limit: params?.limit ? String(params.limit) : "",
  }).toString();

  const response = await ApiFetch({
    url: `/provider/medication/name/all?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: MedicationListResponseInterface = await response.data;
  return data;
};

export const getMedicationPrescription = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  const response = ApiFetch({
    url: `/provider/medication/precription/all?page=${page}&limit=${limit}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: MedicationPrescriptionResponseInterface = (await response).data;
  return data;
};

export const createMedicationPrescription = async (
  requestData: CreateMedicationPrescriptionInterface
) => {
  const response = ApiFetch({
    url: "/provider/medication/precription",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = (await response).data;
  return data;
};

export const updateMedicationPrescription = async ({
  medicationPrescriptionId,
  requestData,
}: {
  medicationPrescriptionId: string;
  requestData: UpdateMedicationPrescriptionType;
}) => {
  const response = ApiFetch({
    url: `/provider/medication/precription/${medicationPrescriptionId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = (await response).data;
  return data;
};

export const deleteMedicationPrescription = async ({
  medicationPrescriptionId,
}: {
  medicationPrescriptionId: string;
}) => {
  const response = ApiFetch({
    url: `/provider/medication/precription/${medicationPrescriptionId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = (await response).data();
  return data;
};

/**
 * * Supplements API
 */
export const createSupplement = async ({
  requestData,
}: {
  requestData: CreateSupplementType;
}) => {
  const response = await ApiFetch({
    url: "/provider/supplements",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getAllSupplementTypes = async () => {
  const response = await ApiFetch({
    url: "/provider/supplements/types/all",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: SupplementTypesResponseInterface = await response.data;
  return data;
};

export const getSupplements = async ({
  userDetailsId,
  page,
  limit,
}: {
  userDetailsId: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();

  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    url: `/provider/supplements?${queryParams}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: SupplementResponseInterface = await response.data;
  return data;
};

export const updateSupplement = async ({
  supplementId,
  requestData,
}: {
  supplementId: string;
  requestData: UpdateSupplementType;
}) => {
  const response = await ApiFetch({
    url: `/provider/supplements/${supplementId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteSupplement = async (supplementId: string) => {
  const response = await ApiFetch({
    url: `/provider/supplements/${supplementId}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

//Procedures

export const createProcedure = async ({
  requestData,
}: {
  requestData: ProceduresInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/procedures",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getProcedureData = async ({
  userDetailsId,
  page,
  limit,
}: {
  userDetailsId: string;
  page?: number;
  limit?: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/procedures/${userDetailsId}?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ProcedureResponse = await response.data;
  return data;
};

export const updateProcedureData = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: ProceduresInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/procedures/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteProcedure = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/procedures/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getAllProcedureNameTypes = async () => {
  const response = await ApiFetch({
    url: "/provider/procedures/type-name/all",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ProceduresTypesResponseInterface = await response.data;
  return data;
};

/**
 * * Historical Vaccines API
 */
export const createHistoricalVaccine = async ({
  requestData,
}: {
  requestData: CreateHistoricalVaccineType;
}) => {
  const response = await ApiFetch({
    url: "/injections/historical-vaccine",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const getHistoricalVaccine = async (params: {
  userDetailsId?: string;
  providerId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();

  const { userDetailsId, providerId, status, page = 1, limit = 10 } = params;

  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (providerId) queryParams.append("providerId", providerId);
  if (status) queryParams.append("status", status);
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    url: `/injections/historical-vaccine?userDetailsId=${userDetailsId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: HistoricalVaccineResponseInterface = await response.data;
  return data;
};

export const updateHistoricalVaccine = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateHistoricalVaccineType;
}) => {
  const response = await ApiFetch({
    url: `/injections/historical-vaccine/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const deleteHistoricalVaccine = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    url: `/injections/historical-vaccine/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};
