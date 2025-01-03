import LoadingButton from "@/components/LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { fetchUserDataResponse } from "@/services/userServices";
import { UserEncounterData } from "@/types/chartsInterface";
import { UserData } from "@/types/userInterface";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ViewOrdersList from "./ViewOrdersList";

function LabResults({ patientDetails }: { patientDetails: UserEncounterData }) {
  const [userData, setUserData] = useState<UserData[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<string>("");
  const [selectedPatient, setSeletedPatient] = useState<UserData | undefined>();
  const [pageNo] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchAndSetResponse = async (pageNo: number) => {
      try {
        const userData = await fetchUserDataResponse({ pageNo: pageNo });
        if (userData) {
          setUserData(userData.data);
        }
      } catch (error) {
        console.log("There was an error: ", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetches first 15 patients on page 1.
    fetchAndSetResponse(pageNo);
  }, [pageNo]);

  useEffect(() => {
    const filteredUsers = userData?.filter((user) => {
      const searchTerms = patient.toLowerCase().split(" ");
      return searchTerms.every(
        (term) =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.id.toLowerCase().includes(term)
      );
    });

    setSeletedPatient(filteredUsers?.[0]);
  }, [patient, userData]);

  const handleSelectedPatient = (patientId: string) => {
    setLoading(true);
    router.push(`labs/lab-results/${patientId}`);
  };

  if (loading) return <LoadingButton />;

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title="Lab Results"
          description="A list of lab results of the patients"
        />
        <Dialog>
          <DialogTrigger className="flex items-center px-4 py-2 text-white bg-[#84012A] rounded-md hover:bg-[#6C011F]">
            <PlusIcon className="w-4 h-4 mr-2" />
            Lab Results
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lab Results</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 items-center">
                <label htmlFor="patient-search" className="font-semibold">
                  Patient:
                </label>
                <Input
                  id="patient-search"
                  type="text"
                  placeholder="Search by name or ID..."
                  value={patient}
                  onChange={(event) => {
                    setPatient(event.target.value);
                    setIsOpen(!isOpen);
                  }}
                />
              </div>
            </div>
            {isOpen && (
              <div>
                <div className="mt-4">
                  {patient && selectedPatient ? (
                    <div className="flex flex-col gap-2">
                      <p className="font-semibold">Matching Patients:</p>
                      <ul className="border rounded p-2">
                        {userData
                          ?.filter((user) => {
                            const searchTerms = patient
                              .toLowerCase()
                              .split(" ");
                            return searchTerms.every(
                              (term) =>
                                user.firstName.toLowerCase().includes(term) ||
                                user.lastName.toLowerCase().includes(term) ||
                                user.id.toLowerCase().includes(term)
                            );
                          })
                          .map((user) => (
                            <li
                              key={user.id}
                              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                              onClick={() => {
                                setSeletedPatient(user);
                                setPatient(
                                  `${user.firstName} ${user.lastName}`
                                );
                                setIsOpen(!isOpen);
                                handleSelectedPatient(user.id);
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
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <ViewOrdersList patientDetails={patientDetails} />
    </>
  );
}

export default LabResults;

