'use client';

import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns'
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { UserData } from '@/types/userInterface';
import { fetchUserDataResponse } from '@/services/userServices';

export const LabResultsClient = () => {
  const [userResponse, setUserResponse] = useState<UserData[] | undefined>([])
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchAndSetResponse = async (pageNo: number) => {
      const userData = await fetchUserDataResponse({ pageNo: pageNo });
      if (userData) {
        setUserResponse(userData.data);
        setTotalPages(Math.ceil(userData.total / userData.pageSize));
      }
      setLoading(false);
    };

    fetchAndSetResponse(pageNo);
  }, [pageNo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      {userResponse && (
        <DataTable
          searchKey="name"
          columns={columns()}
          data={userResponse}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      )}

    </>
  );
};
