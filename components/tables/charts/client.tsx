'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { columns } from './columns'
import { useEffect, useState } from 'react';
import LoadingButton from '@/components/LoadingButton';
import { UserData } from '@/types/userInterface';
import { fetchUserDataResponse } from '@/services/userServices';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { EncounterSchema, encounterSchema } from '@/schema/encounterSchema';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const CalendarClient = () => {
  const [userResponse, setUserResponse] = useState<UserData[] | undefined>([])
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showEncounterForm, setShowEncounterForm] = useState<boolean>(false);
  const [patient, setPatient] = useState<string>("");
  const [selectedPatient, setSeletedPatient] = useState<UserData | undefined>()

  const router = useRouter();

  const methods = useForm<EncounterSchema>({
    resolver: zodResolver(encounterSchema),
    defaultValues: {
      note: '',
      encounterMode: '',
      chartType: ''
    },
  });

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

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/patient/patientDetails/${id}`);
  };

  useEffect(() => {
    const filteredUsers = userResponse?.filter((user) => {
      const searchTerms = patient.toLowerCase().split(' '); // Split input on spaces
      return searchTerms.every((term) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
      );
    });

    setSeletedPatient(filteredUsers?.[0]);
  }, [patient, userResponse]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  const onSubmit = () => {}

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Chart Notes`}
          description=""
        />
        <Dialog>
          <DialogTrigger>
            <Button
              className='bg-[#84012A] hover:bg-[#555]'
              onClick={() => { }}
            >
              Encounter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Encounter</DialogTitle>
              <DialogDescription>
                <div className='flex flex-col gap-6'>
                  <div className='flex gap-2 items-center'>
                    <label htmlFor="patient-search" className='font-semibold'>Patient:</label>
                    <Input
                      id="patient-search"
                      type='text'
                      placeholder="Search by name or ID..."
                      value={patient}
                      onChange={(e) => {
                        setPatient(e.target.value)
                        setIsOpen(!isOpen)
                      }}
                    />
                  </div>
                  {isOpen && (
                    <div>
                      <div className='mt-4'>
                        {patient && selectedPatient ? (
                          <div className='flex flex-col gap-2'>
                            <p className="font-semibold">Matching Patients:</p>
                            <ul className='border rounded p-2'>
                              {userResponse?.filter((user) => {
                                const searchTerms = patient.toLowerCase().split(' ');
                                return searchTerms.every((term) =>
                                  user.firstName.toLowerCase().includes(term) ||
                                  user.lastName.toLowerCase().includes(term) ||
                                  user.id.toLowerCase().includes(term)
                                );
                              }
                              ).map((user) => (
                                <li
                                  key={user.id}
                                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                                  onClick={() => {
                                    setSeletedPatient(user);
                                    setPatient(`${user.firstName} ${user.lastName}`);
                                    setIsOpen(!isOpen)
                                    setShowEncounterForm(!showEncounterForm)
                                  }}
                                >
                                  {user.firstName} {user.lastName} (ID: {user.id})
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-gray-500">No matching patients found.</p>
                        )}
                      </div>
                      {selectedPatient && (
                        <div className='mt-4 p-4 border rounded bg-gray-50'>
                          <h4 className="font-semibold">Selected Patient Details:</h4>
                          <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                          <p><strong>ID:</strong> {selectedPatient.id}</p>
                          <p><strong>Email:</strong> {selectedPatient.email}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {showEncounterForm && (
                    <div >
                      <div className='flex flex-row gap-2 items-center'>
                        <Label className='w-40'>Encounter with:</Label>
                        <Input placeholder="Provider Name" value={patient} />
                      </div>
                      <Form {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit)}>
                          <FormField
                            control={methods.control}
                            name="encounterMode"
                            render={({ field }) => (
                              <FormItem className='flex gap-2 items-center'>
                                <FormLabel className='w-40'>Encounter Mode:</FormLabel>
                                <FormControl>
                                  <Input placeholder="Encounter Mode" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={methods.control}
                            name="note"
                            render={({ field }) => (
                              <FormItem className='flex flex-row gap-2 items-center'>
                                <FormLabel className='w-40'>Note</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="note" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className='flex justify-center mt-3'>
                            <Button type='submit' className='bg-[#84012A]'>Create</Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

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
