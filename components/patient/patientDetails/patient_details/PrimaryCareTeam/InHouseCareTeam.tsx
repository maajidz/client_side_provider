import React, { useCallback, useEffect, useState } from "react";
import styles from "./patient_care_team.module.css";
import { Input } from "@/components/ui/input";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { searchProviders } from "@/services/registerServices";
import LoadingButton from "@/components/LoadingButton";

const InHouseCareTeam = () => {
  const [providers, setProviders] = useState<FetchProviderList[]>([]);
  const [searchInHouseCareTeam, setSearchInHouseCareTeam] = useState("");
  const [selectedInHouseCareTeam, setSelectedInHouseCareTeam] =
    useState<FetchProviderList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleInHouseCareTeamSearch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await searchProviders({
        name: searchInHouseCareTeam,
      });

      if (response) {
        setProviders(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchInHouseCareTeam]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchInHouseCareTeam.trim() && !selectedInHouseCareTeam) {
        handleInHouseCareTeamSearch();
      } else {
        setProviders([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    searchInHouseCareTeam,
    selectedInHouseCareTeam,
    handleInHouseCareTeamSearch,
  ]);

  const handleInHouseCareSelect = (user: FetchProviderList) => {
    setSelectedInHouseCareTeam(user);
    setProviders([]);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg flex-1 gap-6 flex-col flex">
      <div className=" flex flex-col gap-1">
      <div className="font-semibold text-xs pb-2 text-gray-600 uppercase tracking-wider ">In House Care Team</div>
      {/* {selectedInHouseCareTeam ? <div>Edit </div> :  */}
        <div>
          <Input
            value={searchInHouseCareTeam}
            className="bg-white"
            onChange={(e) => {
              setSearchInHouseCareTeam(e.target.value);
              setSelectedInHouseCareTeam(null);
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

      {!loading && searchInHouseCareTeam && (
        <div className="relative w-full">
          {!selectedInHouseCareTeam && providers.length > 0 ? (
            <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10">
              {providers.map((user) => (
                <div
                  key={user.id}
                  className="border-2 border-gray-300 rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleInHouseCareTeamSelect(user)}
                >
                  <div className="text-[#84012A] text-base font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results Found
            !selectedInHouseCareTeam && (
              <p className="absolute bg-white p-2 rounded shadow-lg">
                No results found.
              </p>
            )
          )}
        </div>
      )}

      <div className={styles.physicianDetailsBox}>
      {/* <div>“{careTeam?.inHouseCareTeam.NameOfPhysician}</div> */}
      </div>
    </div>
  );
};

export default InHouseCareTeam;