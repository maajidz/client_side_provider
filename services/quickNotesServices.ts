import ApiFetch from "@/config/api";
import { CreateQuickNoteInterface, UpdateQuickNotesType } from "@/types/quickNotesInterface";

export const createQuickNote = async ({
  requestData,
}: {
  requestData: CreateQuickNoteInterface;
}) => {
  const response = await ApiFetch({
    url: "/provider/quick-notes",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const getQuickNotesData = async () => {
  const response = await ApiFetch({
    url: "/provider/quick-notes",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};

export const updateQuickNotes = async ({
  id,
  requestData,
}: {
  id: string;
  requestData: UpdateQuickNotesType;
}) => {
  const response = await ApiFetch({
    url: `/provider/quick-notes/${id}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: requestData,
  });

  const data = await response.data;
  return data;
};

export const deleteQuickNote = async ({ id }: { id: string }) => {
  const response = await ApiFetch({
    url: `/provider/quick-notes/${id}`,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.data;
  return data;
};
