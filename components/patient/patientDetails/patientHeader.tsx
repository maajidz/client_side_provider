"use client";
import React, { useCallback, useEffect, useState } from "react";
import { PatientDetails } from "@/types/userInterface";
import { fetchUserEssentials } from "@/services/userServices";
import { setUserId } from "@/store/slices/userSlice";
import { calculateAge } from "@/utils/utils";
import LoadingButton from "../../LoadingButton";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar1,
  DollarSign,
  FileHeart,
  HistoryIcon,
  WeightIcon,
} from "lucide-react";

const PatientHeader = ({ userId }: { userId: string }) => {
  const [response, setResponse] = useState<PatientDetails>();
  const [loading, setLoading] = useState(false);
  const [age, setAge] = useState<number>();
  const path = usePathname();

  const breadcrumbItems = [
    { title: "Dashboard", link: "/dashboard" },
    { title: "Patients", link: "/dashboard/provider/patient" },
    { title: `${path.split('/')[5]}`, link: `${path}` },
  ];
  

  const router = useRouter();

  const dispatch = useDispatch();

  const fetchAndSetResponse = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await fetchUserEssentials({ userDetailsId: userId });
      if (userData) {
        setResponse(userData);
        setLoading(false);
        setAge(calculateAge(userData.dob));

        const encounter = userData.encounter.pop();

        let latestChartId = "";
        if (encounter) {
          latestChartId = encounter.chart?.id || "";
        }

        dispatch(
          setUserId({
            chartId: latestChartId,
            email: userData.user.email ?? "",
            firstName: userData.user.firstName ?? "",
            lastName: userData.user.lastName ?? "",
            phoneNumber: userData.user.phoneNumber ?? "",
          })
        );
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  }, [userId, dispatch]);

  useEffect(() => {
    fetchAndSetResponse();
  }, [fetchAndSetResponse]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingButton />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col w-full gap-6"
      onClick={() =>
        router.push(
          `/dashboard/provider/patient/${userId}/patientDetails`
        )
      }
    >
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex flex-row gap-3">
        <Card className="flex flex-row">
          <CardHeader className="flex flex-row justify-between flex-1">
            <div className="flex flex-row gap-2">
              <Avatar className="flex h-11 w-11 items-center justify-center border">
                <AvatarImage src="/avatars/02.png" alt="Avatar" />
                <AvatarFallback>
                  {response?.user.firstName?.charAt(0)}
                  {response?.user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <CardTitle>
                  {response &&
                  response.user &&
                  (response.user.firstName || response.user.lastName)
                    ? `${response?.user?.firstName} ${response?.user?.lastName}`
                    : "N/A"}
                </CardTitle>
                <CardDescription>
                  {response && (response.gender || age)
                    ? `${response?.gender} / ${age}`
                    : "N/A"}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-col items-end text-sm font-medium gap-2">
              <span className="text-gray-500">PID</span>
              <span className="text-gray-900">
                {response?.patientId ? response.patientId : "N/A"}
              </span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Allergies</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            {response && response.allergies
              ? response.allergies.map((allergy, index) => (
                  <Badge variant={"destructive"} key={allergy.id}>
                    {index === 0 ? "" : ""}
                    {allergy.Allergen}
                  </Badge>
                ))
              : "N/A"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Vitals</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 text-sm font-medium">
            <Badge variant={"ghost"}>
              <WeightIcon size={16} className="text-gray-500" />
              <span>
                {response && response?.vitals
                  ? `${
                      response?.vitals[response.vitals.length - 1]?.weightLbs
                    }lbs ${response?.vitals[0]?.weightOzs}ozs`
                  : "N/A"}
              </span>
            </Badge>
            <Badge variant={"ghost"}>
              <FileHeart size={16} className="text-gray-500" />
              <span>
                {response && response?.vitals[0]?.BMI
                  ? `${response?.vitals[0]?.BMI}`
                  : "N/A"}
              </span>
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visits</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 text-sm font-medium items-start flex-row">
            <Badge variant={"ghost"}>
              <HistoryIcon size={16} />
              Last:
              <span>
                {response &&
                  new Date(
                    response.encounter[response.encounter.length - 1].date
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
              </span>
            </Badge>
            <Badge variant={"ghost"}>
              <Calendar1 size={16} />
              Next: N/A
              {/* <span>Mar 04, 2025</span> */}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-1 text-sm font-medium items-center">
            <DollarSign size={16} className="text-gray-500" />
            <span>
              {response && response?.wallet ? response.wallet : "N/A"}
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

{
  /*
<div className={`${styles.infoBox}  bg-[#FFFFEA]`}>
<div className="flex flex-col gap-3">
  <PatientLabelDetails
    label="Height:"
    value={`${response?.vitals[0]?.heightFeets} fts ${response?.vitals[0]?.heightInches} inches`}
  />
  </div>
  </div>
  <div className={`${styles.infoBox}  bg-[#FFF2FF]`}>
  <PatientLabelDetails
    label="Wallet:"
    value={response && response?.wallet ? response.wallet : "N/A"}
  />
  </div> */
}

export default PatientHeader;
