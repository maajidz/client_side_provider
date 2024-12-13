import ApiFetch from "@/config/api";
import { CreateDiagnosesRequestBody, CreateEncounterInterface, CreateEncounterResponseInterface, CreateFollowUp, CreatePrescriptionInterface, CreateTestsRequestBody, DiagnosesChart, FetchPrescription, FollowUpInterface, ImagesResponseInterface, ImagesTestsResponseInterface, LabOrdersDataInterface, LabOrdersInterface, LabsDataResponse, LabsRequestData, PastDiagnosesInterface, PatientPhysicalStats, SOAPInterface, TestResponse, TestsResponseInterface, UpdateDiagnosesRequestBody, UpdateFollowUp, UpdateSOAPInterface, UserEncounterInterface } from "@/types/chartsInterface";

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

export const getLabsData = async ({ page, limit }: { page: number, limit: number }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/all?page=${page}&limit=${limit}`,
    headers: {
      "Content-Type": "application/json",
    }
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
  console.log(response.data);
  const data: UserEncounterInterface = await response.data;
  return data.response;
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

export const updateSOAPChart = async ({ chartId,
  requestData,
}: {
  chartId: string,
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

export const updatePatientPhysicalStatus = async ({ userDetailsID,
  requestData,
}: {
  userDetailsID: string,
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
  requestData: CreateDiagnosesRequestBody[];
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

export const fetchDiagnoses = async ({
  chartId
}: {
  chartId: string
}) => {
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

export const updateDiagnoses = async ({
  diagnosisId,
  requestData
}: {
  diagnosisId: string
  requestData: UpdateDiagnosesRequestBody
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/diagnosis/${diagnosisId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData
  });
  console.log(response.data);
  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};

export const deleteDiagnoses = async ({
  diagnosisId
}: {
  diagnosisId: string
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

export const getFollowUpData = async ({
  chartId
}: {
  chartId: string
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/follow-up/${chartId}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: FollowUpInterface[] = await response.data;
  return data;
};

export const updateFollowUp = async ({
  followUpId,
  requestData
}: {
  followUpId: string
  requestData: UpdateFollowUp
}) => {
  const response = await ApiFetch({
    method: "PATCH",
    url: `/provider/follow-up/${followUpId}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData
  });
  console.log(response.data);
  const data: PastDiagnosesInterface[] = await response.data;
  return data;
};

export const deleteFollowUp = async ({
  followUpId
}: {
  followUpId: string
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
  page
}: {
  limit: number,
  page: number,
  query: string
}) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/tests/all?search=${query}&limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: TestsResponseInterface = await response.data;
  return data;
};

export const getImagesData = async ({ page, limit }: { page: number, limit: number }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/images/types?limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: ImagesResponseInterface = await response.data;
  return data;
};

export const getImagesTestsData = async ({ page, limit }: { page: number, limit: number }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/images/tests?limit=${limit}&page=${page}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: ImagesTestsResponseInterface = await response.data;
  return data;
};

export const getLabOrdersData = async ({ userDetailsId, providerId, page, limit }: { userDetailsId?: string, providerId?: string, page?: number, limit?: number }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/lab/orders?userDetailsId=${userDetailsId}&providerId=${providerId? providerId : ''}&limit=${limit ? limit : 10 }&page=${page ? page : 1 }`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: LabOrdersDataInterface = await response.data;
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


export const getPrescriptionsData = async ({ chartId }: { chartId: string, }) => {
  const response = await ApiFetch({
    method: "GET",
    url: `/provider/prescriptions/${chartId}`,
    headers: {
      "Content-Type": "application/json",
    }
  });
  console.log(response.data);
  const data: FetchPrescription = await response.data;
  return data;
};