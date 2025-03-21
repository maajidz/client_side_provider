import ApiFetch from "@/config/api";
import {
  CreateDiagnosesRequestBody,
  CreateEncounterInterface,
  CreateEncounterResponseInterface,
  CreateFollowUp,
  ImageResultInterface,
  CreatePrescriptionInterface,
  CreateTestsRequestBody,
  CreateTransferInterface,
  FollowUpInterface,
  ImageOrdersInterface,
  ImagesResponseInterface,
  ImagesTestsResponseInterface,
  LabOrdersDataInterface,
  LabOrdersInterface,
  LabsDataResponse,
  LabsRequestData,
  PatientPhysicalStats,
  SOAPInterface,
  TestResponse,
  TestsResponseInterface,
  UpdateDiagnosesRequestBody,
  UpdateFollowUp,
  UpdateSOAPInterface,
  UserEncounterInterface,
  TransferResponseData,
  ImageOrdersResponseInterface,
  DiagnosesResponseInterface,
  PastDiagnosesInterface,
  DiagnosesTypeDataInterface,
  Prescription,
  UpdateEncounterInterface,
} from "@/types/chartsInterface";
import { EncounterInterface } from "@/types/encounterInterface";

export const createEncounterRequest = async ({
  requestData,
}: {
  requestData: CreateEncounterInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/encounters",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: CreateEncounterResponseInterface = await response.data;
  return data;
};

export const updateEncounterRequest = async ({
  encounterId,
  requestData,
}: {
  encounterId: string;
  requestData: UpdateEncounterInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/encounters/${encounterId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: CreateEncounterResponseInterface = await response.data;
  return data;
};

export const getLabsData = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/all?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: LabsDataResponse = await response.data;
  return data;
};

export const createLabs = async ({
  requestData,
}: {
  requestData: LabsRequestData;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getUserEncounterDetails = async ({
  encounterId,
}: {
  encounterId: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/encounters/${encounterId}?idtype=id&page=1&limit=10`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: UserEncounterInterface = await response.data;
  return data.response;
};

export const getEncounterList = async ({
  id,
  idType,
  page,
  limit,
  userDetailsId,
}: {
  id: string;
  idType: "id" | "providerID";
  page?: number;
  limit?: number;
  userDetailsId?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (idType) queryParams.append("idType", idType);
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());
  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/encounters/${id}?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: EncounterInterface = await response.data;
  return data;
};

export const createSOAPChart = async ({
  requestData,
}: {
  requestData: SOAPInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/charts",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const updateSOAPChart = async ({
  chartId,
  requestData,
}: {
  chartId: string;
  requestData: UpdateSOAPInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/charts/${chartId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const updatePatientPhysicalStatus = async ({
  userDetailsID,
  requestData,
}: {
  userDetailsID: string;
  requestData: PatientPhysicalStats;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/user-details/update-physical-stats/${userDetailsID}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const createDiagnoses = async ({
  requestData,
}: {
  requestData: CreateDiagnosesRequestBody;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/diagnosis",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const fetchDiagnoses = async ({ chartId }: { chartId: string }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/diagnosis/${chartId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};

export const fetchDiagnosesForUser = async ({
  userDetailsId,
  page,
  limit,
}: {
  userDetailsId: string;
  page: number;
  limit: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/diagnosis/patient/${userDetailsId}?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: DiagnosesResponseInterface = await response.data;
  return data;
};

export const fetchDiagnosesType = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search: string;
}) => {
  const queryParams = new URLSearchParams();
  if (search) queryParams.append("search", search);
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    method: "get",
    url: `/provider/diagnosis/type/all?${queryParams}`,
  });
  console.log(response.data);
  const data: DiagnosesTypeDataInterface = await response.data;
  console.log(data);
  return data;
};

export const updateDiagnoses = async ({
  diagnosisId,
  requestData,
}: {
  diagnosisId: string;
  requestData: UpdateDiagnosesRequestBody;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/diagnosis/${diagnosisId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};

export const deleteDiagnoses = async ({
  diagnosisId,
}: {
  diagnosisId: string;
}) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/diagnosis/${diagnosisId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};

export const createTests = async ({
  requestData,
}: {
  requestData: CreateTestsRequestBody;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab/tests",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  const data: TestResponse = await response.data;
  return data;
};

export const createLabOrder = async ({
  requestData,
}: {
  requestData: LabOrdersInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/lab/orders",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

// Image Results
export const createImageResult = async ({
  requestData,
}: {
  requestData: ImageResultInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/images/results",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  console.log(response.data);

  const data = await response.data;
  return data;
};

export const createImageOrder = async ({
  requestData,
}: {
  requestData: ImageOrdersInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/images/order",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const createFollowUp = async ({
  requestData,
}: {
  requestData: CreateFollowUp[];
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/follow-up",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getFollowUpData = async ({ chartId }: { chartId: string }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/follow-up/${chartId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: FollowUpInterface[] = await response.data;
  return data;
};

export const updateFollowUp = async ({
  followUpId,
  requestData,
}: {
  followUpId: string;
  requestData: UpdateFollowUp;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/follow-up/${followUpId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};

export const deleteFollowUp = async ({
  followUpId,
}: {
  followUpId: string;
}) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/follow-up/${followUpId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};

export const getLabTestsData = async ({
  limit,
  query,
  page,
}: {
  limit: number;
  page: number;
  query: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/tests/all?search=${query}&limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: TestsResponseInterface = await response.data;
  return data;
};

export const getImagesData = async ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/images/types?limit=${limit}&page=${page}&search=${search}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: ImagesResponseInterface = await response.data;
  return data;
};

export const getImagesTestsData = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/images/tests?limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: ImagesTestsResponseInterface = await response.data;
  return data;
};

export const getLabOrdersData = async ({
  userDetailsId = "",
  providerId = "",
  status = "",
  page = 1,
  limit,
  orderedBy = "",
}: {
  userDetailsId?: string;
  providerId?: string;
  page?: number;
  status?: string;
  limit?: number;
  orderedBy: string;
}) => {
  const queryParams = new URLSearchParams();
  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (orderedBy) queryParams.append("orderedBy", orderedBy);
  if (providerId) queryParams.append("providerId", providerId);
  if (status) queryParams.append("status", status);
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/orders/?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: LabOrdersDataInterface = await response.data;
  return data;
};

export const getImagesOrdersData = async ({
  userDetailsId,
  providerId,
  status,
  page,
  limit,
}: {
  userDetailsId?: string;
  providerId?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (userDetailsId) queryParams.append("userDetailsId", userDetailsId);
  if (providerId) queryParams.append("providerId", providerId);
  if (status) queryParams.append("status", status);
  if (page) queryParams.append("page", page.toString());
  if (limit) queryParams.append("limit", limit.toString());

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/images/order?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ImageOrdersResponseInterface = await response.data;
  return data;
};

export const createPrescriptions = async ({
  requestData,
}: {
  requestData: CreatePrescriptionInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/prescriptions",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getPrescriptionsData = async ({
  chartId,
}: {
  chartId: string;
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/prescriptions/${chartId}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: Prescription[] = await response.data;
  return data;
};

export const createTransfer = async ({
  requestData,
}: {
  requestData: CreateTransferInterface;
}) => {
  const response = await ApiFetch({
    method: "POST",
    url: "/provider/transfer",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const getTransferData = async ({
  id,
  idType,
  referralType,
  statusType,
  status,
}: {
  id: string;
  idType:
    | "id"
    | "encounterId"
    | "referringToProviderID"
    | "referringFromProviderID";
  referralType?: "external" | "internal";
  statusType?: "responseStatus" | "requestStatus" | "";
  status?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (idType) queryParams.append("idType", idType);
  if (referralType) queryParams.append("referralType", referralType);
  if (statusType) queryParams.append("statusType", statusType);
  if (status) queryParams.append("status", status);

  const response = await ApiFetch({
    method: "GET",
    url: `/provider/transfer/${id}?${queryParams}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: TransferResponseData[] = await response.data;
  return data;
};

export const updateTransferData = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateSOAPInterface;
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/transfer/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });
  console.log(response.data);
  const data = await response.data;
  return data;
};

export const deleteTransfer = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    method: "DELETE",
    url: `/provider/transfer/${id}`,
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response.data);
  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};
