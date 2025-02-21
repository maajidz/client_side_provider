"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import LoadingButton from "@/components/LoadingButton";
import { UserData, UserResponseInterface } from "@/types/userInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import DefaultButton from "@/components/custom_buttons/buttons/DefaultButton";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";

export const PatientClient = () => {
  const [response, setResponse] = useState<UserResponseInterface>();
  const [userResponse, setUserResponse] = useState<UserData[] | undefined>([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchAndSetResponse = async (pageNo: number) => {
      const userData = await fetchUserDataResponse({
        pageNo: pageNo,
        pageSize: 10,
      });
      if (userData) {
        setResponse(userData);
        setUserResponse(userData.data);
        setTotalPages(Math.ceil(userData.total / userData.pageSize));
      }
      setLoading(false);
    };

    fetchAndSetResponse(pageNo);
  }, [pageNo]);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/provider/patient/${id}/patientDetails`);
  };

  const handleAddPatientClick = () => {
    router.push(`/dashboard/provider/patient/add_patient`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Patients (${response?.total})`} description="" />
        <DefaultButton onClick={handleAddPatientClick}>
          Add Patient
        </DefaultButton>
      </div>
      {userResponse && (
        <DefaultDataTable
          columns={columns(handleRowClick)}
          data={userResponse}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      )}
    </>
  );
};
