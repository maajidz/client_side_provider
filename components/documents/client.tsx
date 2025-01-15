"use client";

import LoadingButton from "@/components/LoadingButton";
import { getDocumentsData } from "@/services/documentsServices";
import { DocumentsInterface } from "@/types/documentsInterface";
import { DataTable } from "../ui/data-table";
import { columns } from "./column";
import FilterDocuments from "./FilterDocuments";
import { useCallback, useEffect, useState } from "react";
import { UserData } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";

function DocumentsClient() {
  // Data State
  const [documentsData, setDocumentsData] = useState<DocumentsInterface[]>([]);
  const [userInfo, setUserInfo] = useState<UserData[]>([]);

  // Filter State
  const [filters, setFilters] = useState({
    reviewer: "all",
    status: "all",
    patient: "",
  });

  // Page State
  const itemsPerPage = 10;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Loading State
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // GET User Data
  const getUserData = useCallback(async () => {
    setLoadingUsers(true);

    try {
      const response = await fetchUserDataResponse({ pageNo });

      if (response) {
        setUserInfo(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingUsers(false);
    }
  }, [pageNo]);

  // GET Documents Data
  const fetchDocumentsData = useCallback(async () => {
    setLoadingDocuments(true);

    try {
      const response = await getDocumentsData(filters.patient);

      if (response) {
        setDocumentsData(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDocuments(false);
    }
  }, [filters.patient]);

  // Effects
  useEffect(() => {
    getUserData();
  }, [getUserData]);

  useEffect(() => {
    if (filters.patient) {
      fetchDocumentsData();
    }
  }, [fetchDocumentsData, filters]);

  useEffect(() => {
    setTotalPages(Math.ceil(documentsData.length / itemsPerPage));
  }, [documentsData.length]);

  const handleFilterChange = (newFilters: {
    reviewer: string;
    status: string;
    patient: string;
  }) => {
    setFilters(newFilters);
    setPageNo(1);
  };

  return (
    <>
      <div className="space-y-4">
        <FilterDocuments
          documentsData={documentsData}
          userInfo={userInfo}
          onFilterChange={handleFilterChange}
        />
      </div>
      {loadingDocuments || loadingUsers ? (
        <LoadingButton />
      ) : (
        <DataTable
          searchKey="Documents"
          columns={columns()}
          data={documentsData}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage) => setPageNo(newPage)}
        />
      )}
    </>
  );
}

export default DocumentsClient;
