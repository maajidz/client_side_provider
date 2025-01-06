'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { UserData, UserResponseInterface } from '@/types/userInterface';
import { fetchUserDataResponse } from '@/services/userServices';

export const PatientClient = () => {
  const [response, setResponse] = useState<UserResponseInterface>()
  const [userResponse, setUserResponse] = useState<UserData[] | undefined>([])
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const router = useRouter();

  useEffect(() => {
    const fetchAndSetResponse = async (pageNo: number) => {
      const userData = await fetchUserDataResponse({ pageNo: pageNo, pageSize: 10 });
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
    router.push(`/dashboard/patient/patientDetails/${id}`);
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
        <Heading
          title={`Patient (${response?.total})`}
          description=""
        />
      </div>
      <Separator />
      {userResponse && (
        <DataTable
          searchKey="name"
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
