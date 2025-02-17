'use client';
import { DefaultDataTable } from '@/components/custom_buttons/table/DefaultDataTable';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { fetchUserForms } from '@/services/userServices';
import { UserFormInterface } from '@/types/userInterface';

export const PatientFormClient = ({ userDetailsId }: { userDetailsId: string }) => {
  const [response, setResponse] = useState<UserFormInterface>()
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('general-form');
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);


  useEffect(() => {
    const fetchAndSetResponse = async (formType: string) => {
      setLoading(true);
      const userFormsData = await fetchUserForms({ formType, userDetailsId });
      if (userFormsData) {
        setResponse(userFormsData);
      }
      setLoading(false);
    };

    fetchAndSetResponse(selectedType);
    console.log('Selected form type:', selectedType);
  }, [selectedType, pageNo, userDetailsId]);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    console.log(selectedType)
    setPageNo(1);
    setTotalPages(1);
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
          title={`Patient Forms (${response?.data.length})`}
          description="Manage patient forms"
        />
      </div>
      <Separator />
      <Select onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general-form">General form</SelectItem>
          <SelectItem value="diabetes-form">Diabetes form</SelectItem>=
        </SelectContent>
      </Select>
      {response?.data && (
        <DefaultDataTable
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
