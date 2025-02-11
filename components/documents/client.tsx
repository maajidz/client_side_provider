"use client";

import LoadingButton from "@/components/LoadingButton";
import { getDocumentsData } from "@/services/documentsServices";
import { fetchProviderListDetails } from "@/services/registerServices";
import { fetchUserDataResponse } from "@/services/userServices";
import { searchParamsForDocumentsSchema } from "@/schema/documentsSchema";
import { DocumentsInterface } from "@/types/documentsInterface";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import { DataTable } from "../ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { columns } from "./column";
import FilterDocuments from "./FilterDocuments";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

function DocumentsClient() {
  // Data States
  const [documentsData, setDocumentsData] = useState<DocumentsInterface[]>([]);
  const [userInfo, setUserInfo] = useState<UserData[]>([]);
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Filter State
  const [filters, setFilters] = useState({
    reviewer: "all",
    status: "all",
    patient: "",
  });

  // Pagination States
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loading States
  const [loading, setLoading] = useState({
    documents: false,
    users: false,
    providers: false,
  });

  // Toast State
  const { toast } = useToast();

  // Fetch Documents Data
  const fetchDocumentsData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, documents: true }));

    try {
      if (filters.patient) {
        const response = await getDocumentsData({
          userDetailsId: filters.patient,
          reviewerId: filters.reviewer,
          status: filters.status,
        });
        setDocumentsData(response.data);
      } else {
        showToast({ toast, type: "error", message: "Please select a patient" });
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch documents for selected patient",
        });
      }
    } finally {
      setLoading((prev) => ({ ...prev, documents: false }));
    }
  }, [filters, toast]);

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, users: true }));

    try {
      const response = await fetchUserDataResponse({ pageNo });

      if (response) {
        setUserInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  }, [pageNo]);

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, providers: true }));

    try {
      const response = await fetchProviderListDetails({
        page: pageNo,
        limit: itemsPerPage,
      });
      setProvidersList(response.data);
    } catch (err) {
      console.error("Error fetching providers data:", err);
    } finally {
      setLoading((prev) => ({ ...prev, providers: false }));
    }
  }, [pageNo]);

  const handleSearch = (
    filterValues: z.infer<typeof searchParamsForDocumentsSchema>
  ) => {
    if (filterValues.status === "all") {
      filterValues.status = "";
    }

    if (filterValues.reviewer === "all") {
      filterValues.reviewer = "";
    }

    setFilters({
      reviewer: filterValues.reviewer || "",
      status: filterValues.status || "",
      patient: filterValues.patient || "",
    });
    setPageNo(1);
  };

  // Effects
  useEffect(() => {
    fetchUserData();
    fetchProvidersData();
    fetchDocumentsData();
  }, [fetchUserData, fetchProvidersData, fetchDocumentsData]);

  useEffect(() => {
    setTotalPages(Math.ceil(documentsData.length / itemsPerPage));
  }, [documentsData.length]);

  const paginatedData = documentsData.slice(
    (pageNo - 1) * itemsPerPage,
    pageNo * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <FilterDocuments
        documentsData={documentsData}
        userInfo={userInfo}
        providersData={providersList}
        onSearch={handleSearch}
      />

      {loading.documents || loading.providers || loading.users ? (
        <LoadingButton />
      ) : (
        <>
          <DataTable
            searchKey="Documents"
            columns={columns()}
            data={paginatedData}
            pageNo={pageNo}
            totalPages={totalPages}
            onPageChange={(newPage) => setPageNo(newPage)}
          />
        </>
      )}
    </div>
  );
}

export default DocumentsClient;
