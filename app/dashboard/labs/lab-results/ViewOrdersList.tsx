import LoadingButton from "@/components/LoadingButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getLabOrdersData } from "@/services/chartsServices";
import {
  LabOrdersDataInterface,
  UserEncounterData,
} from "@/types/chartsInterface";
import { Hospital } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function ViewOrdersList({
  patientDetails,
}: {
  patientDetails: UserEncounterData;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<LabOrdersDataInterface>();

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getLabOrdersData({
        userDetailsId: patientDetails?.userDetails.id,
      });
      if (data) {
        setResponse(data);
      }
    } catch (e) {
      console.log("Error", e);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [patientDetails.userDetails.id]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

  if (loading) {
    return (
      <div>
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      <Card className="mt-4 p-4 gap-4 border rounded-lg shadow-lg">
        <CardHeader className="pb-4 text-xl font-semibold text-[#84012A] border-b">
          View Orders
        </CardHeader>
        <div className="flex flex-col">
          {response?.data.length ? (
            response?.data.map((orders) => (
              <CardContent
                className="p-4 mb-4 border rounded-lg shadow-md bg-white"
                key={orders.id}
              >
                {orders.labs.map((lab) => (
                  <div key={lab.id} className="mb-4">
                    <div className="flex items-center gap-4">
                      <Hospital className="h-12 w-12 p-2 text-[#84012A] bg-[#FFE7E7] border rounded-full shadow-md" />
                      <h2 className="text-2xl font-semibold">{lab.name}</h2>
                    </div>
                    {orders.tests.length > 0 && (
                      <>
                        <div className="mt-4 p-6 flex justify-between">
                          <div className="w-full sm:w-auto">
                            <h3 className="text-lg font-semibold text-gray-400">
                              Tests
                            </h3>
                            <ul className="mt-2 space-y-2">
                              {orders.tests.map((test) => (
                                <li
                                  key={test.id}
                                  className="px-4 py-2 text-sm bg-[#FFE7E7] text-gray-700 rounded-lg shadow-md hover:bg-[#FFD2D2] transition-colors"
                                >
                                  {test.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div key={lab.id} className="w-full sm:w-auto">
                            <h3 className="text-lg font-semibold text-gray-400">
                              Created At
                            </h3>
                            <p className="py-2 text-md font-semibold">
                              {new Date(orders.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </CardContent>
            ))
          ) : (
            <div className="m-4 flex flex-row items-center gap-4 text-gray-500">
              <Hospital className="h-16 w-16 text-gray-300" />
              <p className="text-lg">No lab orders available.</p>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}

export default ViewOrdersList;

