'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { Payment } from '@/types/userInterface';
import { fetchUserPayments } from '@/services/userServices';

export const PatientPaymentClient = ({ userDetailsId }: { userDetailsId: string }) => {
  const [userPayments, setUserPayments] = useState<
  Payment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchAndSetResponse = async (pageNo: number) => {
      try {
        const fetchedPayments = await fetchUserPayments({ userDetailsId: userDetailsId, pageNo:  pageNo});
        console.log("Fetched Payments:", fetchedPayments);
        if (fetchedPayments) {
          setUserPayments(fetchedPayments);
          setTotalPages(1);
        }
      }
      catch (error) {
        console.error('Error fetching appointments:', error);
      }
      finally {
        setLoading(false)
      }
    };

    fetchAndSetResponse(pageNo);
  }, [userDetailsId, pageNo]);

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
          title={`Patient Payments (${userPayments?.length})`}
          description=""
        />
      </div>
      <Separator />
      {userPayments.length> 0 ? (<DataTable
        searchKey="name"
        columns={columns()}
        data={userPayments}
        pageNo={pageNo}
        totalPages={totalPages}
        onPageChange={(newPage: number) => setPageNo(newPage)}
      />
      ) : (
        <div className='flex flex-col justify-center items-center justify-items-center pt-20'>User hasn&apos;t booked any appointment</div>
      )}
    </>
  );
};
