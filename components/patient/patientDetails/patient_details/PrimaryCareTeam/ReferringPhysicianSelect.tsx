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
    <div className={styles.infoBox}>
      <div className={styles.infoBoxLabel}>Referring Physician</div>
      <div>
        <Input
          value={searchReferringPhysician}
          onChange={(e) => {
            setSearchReferringPhysician(e.target.value);
            setSelectedReferringPhysician(null);
          }}
          placeholder="Search providers..."
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center mt-2">
          <LoadingButton />
        </div>
      )}

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
          !selectedReferringPhysician &&
          !loading &&
          searchReferringPhysician && (
            <p className="absolute bg-white p-2 rounded shadow-lg">
              No results found.
            </p>
          )
        )}
      </div>
      {/* <div>{careTeam?.primaryCarePhysician.NameOfPhysician}</div> */}
    </div>
  );
};

export default ReferringPhysicianSelect;
