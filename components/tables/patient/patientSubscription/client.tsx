"use client";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { UserSubscription } from "@/types/userInterface";
import { fetchUserSubscriptions } from "@/services/userServices";

export const PatientSubscriptionClient = ({
  userDetailsId,
}: {
  userDetailsId: string;
}) => {
  const [userSubscription, setUserSubscription] = useState<UserSubscription>();
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchAndSetResponse = async () => {
      try {
        const fetchedSubscriptions = await fetchUserSubscriptions({
          userDetailsId: userDetailsId,
          pageSize: 15,
        });
        console.log("Fetched Subscriptions:", fetchedSubscriptions);
        if (fetchedSubscriptions) {
          setUserSubscription(fetchedSubscriptions);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching Subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetResponse();
  }, [userDetailsId]);

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
          title={`Patient Subscriptions`}
          description="Manage patient subscription"
        />
      </div>
      <Separator />

      {userSubscription?.subscriptions ? (
        <DefaultDataTable
          columns={columns()}
          data={userSubscription.subscriptions}
          pageNo={pageNo}
          totalPages={totalPages}
          onPageChange={(newPage: number) => setPageNo(newPage)}
        />
      ) : (
        <div className="flex flex-col justify-center items-center justify-items-center pt-20">
          User isn&apos;t subscribed to any services
        </div>
      )}
    </>
  );
};
