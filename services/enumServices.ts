import ApiFetch from "@/config/api";

export const getFrequencyData = async () => {
  const response = await ApiFetch({
    url: "/enums/frequency",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const getDosageUnits = async () => {
  const response = await ApiFetch({
    url: "/enums/dosage-unit",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const getIntakeTypes = async () => {
  const response = await ApiFetch({
    url: "/enums/intake-type",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const getVisitTypes = async () => {
  const response = await ApiFetch({
    url: "/enums/visit-type",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const getParenteralRoutes = async () => {
  const response = await ApiFetch({
    url: "/enums/parenteral-routes",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const getInjectionSite = async ({route}: {route: string}) => {
  const response = await ApiFetch({
    url: `/enums/parenteral-route-sites/${route}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};
