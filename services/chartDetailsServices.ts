import ApiFetch from "@/config/api";
import { AlertInterface, UpdateAlertInterface } from "@/types/alertInterface";
import { RecallsInterface, UpdateRecallsInterface } from "@/types/recallsInterface";
import { StickyNotesInterface, UpdateStickyNotesInterface } from "@/types/stickyNotesInterface";

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

export const getAlertData = async ({ userDetailsId }: { userDetailsId: string }) => {
    const response = await ApiFetch({
        method: "GET",
        url: `/provider/alerts/${userDetailsId}`,
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(response.data);
    const data = await response.data;
    return data;
};

export const updateAlertData = async ({ id,
    requestData,
}: {
    id: string,
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

export const deleteAlert = async ({
    id
}: {
    id: string
}) => {
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
    const data = await response.data;
    return data;
};

export const getStickyNotesData = async ({ chartId }: { chartId: string }) => {
    const response = await ApiFetch({
        method: "GET",
        url: `/provider/sticky-notes/${chartId}`,
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(response.data);
    const data = await response.data;
    return data;
};

export const updateStickyNotesData = async ({ id,
    requestData,
}: {
    id: string,
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

export const deleteStickyNotes = async ({
    chartId
}: {
    chartId: string
}) => {
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
    const data = await response.data;
    return data;
};

export const getRecallsData = async ({ page, limit, userDetailsId, providerId }: { page: number, limit: number, userDetailsId?: string , providerId?:string}) => {
    const response = await ApiFetch({
        method: "GET",
        url: `/provider/recalls?page=${page}&limit=${limit}${userDetailsId ?? `&userDetailsId=${userDetailsId}`}${providerId ?? `&providerId=${providerId}`}`,
        headers: {
            "Content-Type": "application/json",
        }
    });
    console.log(response.data);
    const data = await response.data;
    return data;
};

export const updateRecallsData = async ({ id,
    requestData,
}: {
    id: string,
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

export const deleteRecalls = async ({
    id
}: {
    id: string
}) => {
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