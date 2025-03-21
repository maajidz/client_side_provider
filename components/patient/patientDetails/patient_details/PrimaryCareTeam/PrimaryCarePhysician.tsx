import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { searchProviders } from "@/services/registerServices";
import { PatientCareTeamInterface } from "@/types/userInterface";
import styles from "./patient_care_team.module.css";
import { Trash2Icon } from "lucide-react";
import {
  addPrimaryCarePhysician,
  deletePrimaryCarePhysician,
} from "@/services/primaryCareServices";
import { useToast } from "@/hooks/use-toast";
import { showToast } from "@/utils/utils";

const PrimaryCarePhysician = ({
  careTeam,
  refreshKey,
  userDetailsId,
  onRefresh,
}: {
  careTeam: PatientCareTeamInterface | null;
  refreshKey: number;
  userDetailsId: string;
  onRefresh: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [providers, setProviders] = useState<FetchProviderList[]>([]);
  const [searchPrimaryCarePhysician, setSearchPrimaryCarePhysician] =
    useState("");
  const [selectedPrimaryCarePhysician, setSelectedPrimaryCarePhysician] =
    useState<FetchProviderList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const handlePrimaryCarePhysicianSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchProviders({
        name: searchPrimaryCarePhysician,
      });

      if (response) {
        setProviders(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchPrimaryCarePhysician]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchPrimaryCarePhysician.trim() && !selectedPrimaryCarePhysician) {
        handlePrimaryCarePhysicianSearch();
      } else {
        setProviders([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    searchPrimaryCarePhysician,
    selectedPrimaryCarePhysician,
    handlePrimaryCarePhysicianSearch,
  ]);

  const handlePrimaryCarePhysicianSelect = async (user: FetchProviderList) => {
    setSelectedPrimaryCarePhysician(user);
    setLoading(true);

    try {
      await addPrimaryCarePhysician({
        NameOfPhysician: `${user.firstName} ${user.lastName}`,
        FaxNumberOfPhysician: "",
        PhoneNumberOfPhysician: user.phoneNumber,
        consent: true,
        userDetailsID: userDetailsId,
      });

      showToast({
        toast,
        type: "success",
        message: "Primary care physician added successfully",
      });
      onRefresh((prev) => prev + 1);
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not add primary care physician",
        });
      }
    } finally {
      setLoading(false);
      setProviders([]);
    }
  };

  // * Remove Primary Care Physician
  const removePrimaryCarePhysician = async (id: string) => {
    setLoading(true);

    try {
      await deletePrimaryCarePhysician({ id });

      showToast({
        toast,
        type: "error",
        message: "Primary care physician deleted successfully",
      });
      onRefresh((prev) => prev + 1);
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not remove primary care physician",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      key={refreshKey}
      className="border-gray-100 border flex gap-6 flex-col group p-6 flex-1 rounded-lg"
    >
      <div className=" flex flex-col gap-1">
        <div className="font-semibold text-xs pb-2 text-gray-600">
          Primary Care Physician
        </div>
        {/* {selectedPrimaryCarePhysician ? <div>Edit </div> :  */}
        <div className="relative">
          <Input
            value={searchPrimaryCarePhysician}
            className="bg-white"
            onChange={(e) => {
              setSearchPrimaryCarePhysician(e.target.value);
              setSelectedPrimaryCarePhysician(null);
            }}
            placeholder="Search providers..."
          />

          {loading ? (
            <div>Loading... </div>
          ) : (
            searchPrimaryCarePhysician && (
              <div className="absolute w-full top-8">
                {!selectedPrimaryCarePhysician && providers.length > 0 ? (
                  <div className="mt-2 w-full bg-white shadow-lg rounded-lg z-10">
                    {providers.map((user) => (
                      <div
                        key={user.id}
                        className="rounded-lg px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handlePrimaryCarePhysicianSelect(user)}
                      >
                        <div className="text-[#84012A] text-base font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // No Results Found
                  !selectedPrimaryCarePhysician && (
                    <p className="absolute w-full bg-white p-2 text-xs rounded shadow-lg">
                      No results found.
                    </p>
                  )
                )}
              </div>
            )
          )}
        </div>
      </div>
      <div className={styles.physicianDetailsBox}>
        {careTeam && (
          <PhysicianData
            label="Assigned Physician"
            value={careTeam?.primaryCarePhysician?.NameOfPhysician || ""}
            onRemove={() =>
              removePrimaryCarePhysician(careTeam?.primaryCarePhysician.id)
            }
          />
        )}
      </div>
    </div>
  );
};

export default PrimaryCarePhysician;

const PhysicianData = ({
  label,
  value,
  onRemove,
}: {
  label: string;
  value: string;
  onRemove: () => void;
}) => {
  return (
    <div className="flex gap-1 flex-col">
      <div className="text-xs font-medium text-gray-500 ">{label}</div>
      {value ? (
        <div className="flex text-sm items-center justify-between gap-2 font-semibold">
          {value}
          {value && (
            <Button variant="ghost" onClick={onRemove}>
              <Trash2Icon color="#84012A" />
            </Button>
          )}
        </div>
      ) : (
        <div className="text-xs font-semibold text-gray-500">
          No Assigned Physician found!
        </div>
      )}
    </div>
  );
};
