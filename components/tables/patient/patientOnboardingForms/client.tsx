'use client';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { fetchOnboardingUserForms } from '@/services/userServices';
import { UserFormInterface } from '@/types/userInterface';

export const PatientOnboardingFormClient = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<UserFormInterface>()
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('onboarding');
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // const router = useRouter();

  useEffect(() => {
    const fetchAndSetResponse = async (formType: string) => {
      const userFormsData = await fetchOnboardingUserForms({ formType, userDetailsId });
      if (userFormsData) {
        setResponse(userFormsData);
        setTotalPages(1);
      }
      setLoading(false);
    };

    fetchAndSetResponse(selectedType);
  }, [selectedType, pageNo]);

  // const handleTypeChange = (value: string) => {
  //   setSelectedType(value);
  //   setPageNo(1);
  //   setTotalPages(1);
  // };

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
          title={`Patient Onboarding Forms (${response?.data.length})`}
          description="Manage patient onboarding forms"
        />
      </div>
      <Separator />
      {selectedType}
      {/* <Select onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general-form">General form</SelectItem>
          <SelectItem value="diabetes-form">Diabetes form</SelectItem>=
        </SelectContent>
      </Select> */}
      {response?.data && (
        <DataTable
          searchKey="name"
          columns={columns()}
          data={response?.data}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      )}
    </>
  );
};
