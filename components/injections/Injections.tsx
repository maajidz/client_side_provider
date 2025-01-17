"use client";

import PageContainer from "@/components/layout/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetchProviderListDetails } from "@/services/registerServices";
import { FetchProviderList } from "@/types/providerDetailsInterface";
import { fetchUserDataResponse } from "@/services/userServices";
import { UserData } from "@/types/userInterface";
import { showToast } from "@/utils/utils";
import InjectionsClient from "./injection-orders/client";
import InjectionOrders from "./injection-orders/InjectionOrders";
import VaccinesClient from "./vaccine-orders/client";
import VaccineOrders from "./vaccine-orders/VaccineOrders";
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "../LoadingButton";

function Injections() {
  const [activeTab, setActiveTab] = useState("injectionOrders");

  // Data State
  const [patientData, setPatientData] = useState<UserData[]>([]);
  const [providersList, setProvidersList] = useState<FetchProviderList[]>([]);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSearchList, setVisibleSearchList] = useState<boolean>(false);

  // Loading State
  const [loading, setLoading] = useState(false);

  // Toast State
  const { toast } = useToast();

  // Fetch User Data
  const fetchUserData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchUserDataResponse({
        pageNo: 1,
        pageSize: 10,
        firstName: searchTerm,
        lastName: searchTerm,
      });

      if (response) {
        setPatientData(response.data);
      } else {
        throw new Error();
      }
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch patients",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [searchTerm, toast]);

  // Fetch Providers Data
  const fetchProvidersData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetchProviderListDetails({ page: 1, limit: 10 });

      setProvidersList(response.data);
    } catch (err) {
      if (err instanceof Error) {
        showToast({
          toast,
          type: "error",
          message: "Could not fetch providers",
        });
      } else {
        showToast({
          toast,
          type: "error",
          message: "An unknown error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Effects
  useEffect(() => {
    fetchUserData();
    fetchProvidersData();
  }, [fetchUserData, fetchProvidersData]);

  const filteredPatients = patientData.filter((patient) =>
    `${patient.user.firstName} ${patient.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-2">
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          <div className="flex items-center justify-between gap-10 border-b border-gray-300 pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="injectionOrders">
                Injection Orders
              </TabsTrigger>
              <TabsTrigger value="vaccineOrders">Vaccine Orders</TabsTrigger>
            </TabsList>
            {activeTab === "injectionOrders" ? (
              <InjectionOrders />
            ) : (
              <VaccineOrders />
            )}
          </div>
          {loading ? (
            <LoadingButton />
          ) : (
            <>
              <TabsContent value="injectionOrders">
                <InjectionsClient
                  providerList={providersList}
                  filteredPatients={filteredPatients}
                  searchTerm={searchTerm}
                  visibleSearchList={visibleSearchList}
                  onSetSearchTerm={setSearchTerm}
                  onSetVisibleSearchList={setVisibleSearchList}
                />
              </TabsContent>
              <TabsContent value="vaccineOrders">
                <VaccinesClient
                  providerList={providersList}
                  filteredPatients={filteredPatients}
                  searchTerm={searchTerm}
                  visibleSearchList={visibleSearchList}
                  onSetSearchTerm={setSearchTerm}
                  onSetVisibleSearchList={setVisibleSearchList}
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default Injections;
