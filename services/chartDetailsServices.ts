import ApiFetch from "@/config/api";

import {
  AlertInterface,
  AlertResponseInterface,
  AlertTypeInterface,
  UpdateAlertInterface,
} from "@/types/alertInterface";
import {
  AllergenInterface,
  AllergenResponseInterfae,
  UpdateAllergenInterface,
} from "@/types/allergyInterface";
import {
  FamilyHistoryInterface,
  FamilyHistoryResponseInterface,
  UpdateFamilyHistoryInterface,
} from "@/types/familyHistoryInterface";
import {
  AddPharmacyInterface,
  PharmacyInterface,
  PharmacyRequestInterface,
} from "@/types/pharmacyInterface";
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
import { TasksInterface } from "@/types/tasksInterface";

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
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/alerts/${userDetailsId}`,
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

export const getStickyNotesData = async ({ chartId }: { chartId: string }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/sticky-notes/${chartId}`,
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
}: {
  page: number;
  limit: number;
  userDetailsId?: string;
  providerId?: string;
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

  const url = `/provider/recalls?${queryParams.toString()}`;

  const response = await ApiFetch({
    method: "GET",
    url,
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response.data);
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
  requestBody: TasksInterface;
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
}: {
  providerId: string;
  page: number;
  limit: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/tasks/all?providerId=${providerId}&page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(await response.data);
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
  requestData: AllergenInterface;
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

  console.log(response.data);

  const data = await response.data;
  return data;
};
