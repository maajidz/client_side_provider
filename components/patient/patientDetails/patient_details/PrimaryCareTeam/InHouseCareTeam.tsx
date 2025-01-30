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

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <div className={styles.infoBox}>
      <div className={styles.infoBoxLabel}>In House Care Team</div>
      <div>
        <Input
          value={searchInHouseCareTeam}
          onChange={(e) => {
            setSearchInHouseCareTeam(e.target.value);
            setSelectedInHouseCareTeam(null);
          }}
          placeholder="Search providers..."
        />
      </div>
      <div className="relative w-full">
        {loading && (
          <p className="absolute bg-white p-2 rounded shadow-lg">Loading...</p>
        )}
        {!selectedInHouseCareTeam && providers.length > 0 ? (
          <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg z-10">
            {providers.map((user) => (
              <div
                key={user.id}
                className="border-2 border-gray-300 rounded-lg p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleInHouseCareSelect(user)}
              >
                <div className="text-[#84012A] text-base font-medium">
                  {user.firstName} {user.lastName}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !selectedInHouseCareTeam &&
          !loading &&
          searchInHouseCareTeam && (
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

export default InHouseCareTeam;
