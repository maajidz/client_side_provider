import React, { useCallback, useEffect, useState } from "react";
import styles from "./patient_care_team.module.css";
import { Input } from "@/components/ui/input";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { searchProviders } from "@/services/registerServices";
import LoadingButton from "@/components/LoadingButton";

const ReferringPhysicianSelect = () => {
  const [providers, setProviders] = useState<FetchProviderList[]>([]);
  const [searchReferringPhysician, setSearchReferringPhysician] = useState("");
  const [selectedReferringPhysician, setSelectedReferringPhysician] =
    useState<FetchProviderList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleReferringPhysicianSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchProviders({
        name: searchReferringPhysician,
      });

      if (response) {
        setProviders(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchReferringPhysician]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchReferringPhysician.trim() && !selectedReferringPhysician) {
        handleReferringPhysicianSearch();
      } else {
        setProviders([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    searchReferringPhysician,
    selectedReferringPhysician,
    handleReferringPhysicianSearch,
  ]);

  const handleReferringPhysicianSelect = (user: FetchProviderList) => {
    setSelectedReferringPhysician(user);
    setProviders([]);
  };

  return (
    <div className="border-gray-100 border group p-6 flex-1 rounded-lg">
      <div className=" flex flex-col gap-1">
      <div className="font-semibold text-xs pb-2 text-gray-600">Referring Physician</div>
      {/* {selectedReferringPhysician ? <div>Edit </div> :  */}
        <div>
          <Input
            value={searchReferringPhysician}
            className="bg-white"
            onChange={(e) => {
              setSearchReferringPhysician(e.target.value);
              setSelectedReferringPhysician(null);
            }}
            placeholder="Search providers..."
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center mt-2">
          <LoadingButton />
        </div>
      )}

      {!loading && searchReferringPhysician && (
        <div className="relative w-full">
          {!selectedReferringPhysician && providers.length > 0 ? (
            <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10">
              {providers.map((user) => (
                <div
                  key={user.id}
                  className="border-2 border-gray-300 rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleReferringPhysicianSelect(user)}
                >
                  <div className="text-[#84012A] text-base font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results Found
            !selectedReferringPhysician && (
              <p className="absolute text-xs bg-white p-2 rounded shadow-lg">
                No results found.
              </p>
            )
          )}
        </div>
      )}

      <div className={styles.physicianDetailsBox}>
        {/* <div>{careTeam?.referringPhysician.NameOfPhysician}</div> */}
      </div>
    </div>
  );
};

export default ReferringPhysicianSelect;
