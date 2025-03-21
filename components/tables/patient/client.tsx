"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { UserData, UserResponseInterface } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

export const PatientClient = () => {
  const [response, setResponse] = useState<UserResponseInterface>();
  const [userResponse, setUserResponse] = useState<UserData[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const pageSize = 10;

  const router = useRouter();

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const userData = await fetchUserDataResponse({
        pageNo: page,
        pageSize: pageSize,
      });
      if (userData) {
        setResponse(userData);
        const filteredData = userData.data.filter((user) => user.patientId);
        setUserResponse(filteredData);
        setTotalPages(Math.ceil(userData.total / userData.pageSize));
      }
    } catch (error) {
      console.error("Failed to fetch patient data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(pageNo);
  }, [pageNo, fetchData]);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/provider/patient/${id}/patientDetails`);
  };

  const handleAddPatientClick = () => {
    router.push(`/dashboard/provider/patient/add_patient`);
  };

  return (
    <>
      {loading ? (
        <TableShimmer />
      ) : (
        <DefaultDataTable
          columns={columns(handleRowClick)}
          onAddClick={handleAddPatientClick}
          title={`Patients (${response?.total})`}
          data={userResponse || []}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      )}
    </>
  );
};
