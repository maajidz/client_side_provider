import ApiFetch from "@/config/api";

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
