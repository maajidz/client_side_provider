import React, { useCallback, useEffect, useState } from "react";
import styles from "./face_Sheet.module.css";
import {
  fetchUserEssentials,
  fetchUserEssentialsDashboard,
} from "@/services/userServices";
import {
  PatientDashboardInterface,
  PatientDetails,
} from "@/types/userInterface";
import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Info, User } from "lucide-react";

const FaceSheet = ({ userDetailsId }: { userDetailsId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<PatientDetails>();
  const [userDashboardData, setUserDashboardData] =
    useState<PatientDashboardInterface>();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUserEssentials({ userDetailsId });
      setUserData(data);
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  const fetchUserDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUserEssentialsDashboard({ userDetailsId });
      setUserDashboardData(data);
    } catch (error) {
      console.log("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchUserData();
    fetchUserDashboardData();
  }, [fetchUserData, fetchUserDashboardData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <LoadingButton />
      </div>
    );
  }

  return (
    <>
      <ScrollArea>
        <div className={styles.infoContent}>
          <div className="flex flex-row gap-4 w-full md:w-full">
            <Card className="flex flex-1">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="Allergies"
                    href="allergies"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2">
                {userData?.allergies && userData?.allergies?.length > 0 ? (
                  userData?.allergies.map((allergies, index) => (
                    <Badge variant="destructive" key={allergies?.id}>
                      {index === 0 ? "" : ""}
                      {allergies?.allergen}
                    </Badge>
                  ))
                ) : (
                  <NoDataRecorded />
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-1">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="Diagnoses"
                    href="diagnoses"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2 w-full">
                {userDashboardData?.diagnoses ? (
                  <div
                    key={userDashboardData?.diagnoses.id}
                    className="flex flex-row justify-between items-center gap-4 flex-1"
                  >
                    <div className="flex flex-row gap-2">
                      <div className="text-sm font-medium">
                        {userDashboardData?.diagnoses?.diagnosisType?.name}
                        {/* <Badge className="inline-flex ml-2">
                          {userDashboardData?.diagnoses.ICD_Code}
                        </Badge> */}
                      </div>
                    </div>
                    <div className={`${styles.infoSub} flex w-fit flex-shrink-0 pt-1`}>
                      {new Date(
                        userDashboardData?.diagnoses.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ) : (
                  <NoDataRecorded />
                )}
              </CardContent>
            </Card>
          </div>

          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Medications"
              href="medications"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userDashboardData?.medicationPrescriptions ? (
                  <div key={userDashboardData?.medicationPrescriptions.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {userDashboardData?.medicationPrescriptions.medicationName.productName} [
                      {userDashboardData?.medicationPrescriptions.medicationName.tradeName}] {""}
                      {userDashboardData?.medicationPrescriptions.medicationName.strength}{" "}
                      {userDashboardData?.medicationPrescriptions.medicationName.doseForm}
                    </div>
                    <div className={styles.infoSub}>
                      {userDashboardData?.medicationPrescriptions.medicationName.route},{""}
                      {userDashboardData?.medicationPrescriptions.directions}
                    </div>
                  </div>
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div>  */}

          <div className="flex flex-col w-full">
            <Card className="flex flex-1 w-full">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="History"
                    href="patientDetails"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full">
                <Tabs
                  defaultValue="medicalHistory"
                  className="flex flex-col gap-4"
                >
                  <TabsList
                    className="flex w-full gap-4 justify-start"
                    variant="underlined"
                  >
                    <TabsTrigger value="medicalHistory" icon={CheckCircle}>
                      Medical History
                    </TabsTrigger>
                    <TabsTrigger value="familyHistory" icon={User}>
                      Family History
                    </TabsTrigger>
                    <TabsTrigger value="socialHistories" icon={Info}>
                      Social Histories
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="medicalHistory" className="px-2">
                    {userDashboardData?.medicalHistory ? (
                      <div
                        key={userDashboardData?.medicalHistory?.id}
                        className="flex flex-col gap-2"
                      >
                        <div className="text-sm font-semibold text-gray-700">
                          Medical History Recorded on{" "}
                          {new Date(
                            userDashboardData?.medicalHistory?.updatedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}{" "}
                        </div>
                        <FaceSheetLabels
                          label="GLP Refill Note:"
                          value={
                            userDashboardData?.medicalHistory
                              .glp_refill_note_practice
                          }

                        />
                        <FaceSheetLabels
                          label="Notes:"
                          value={userDashboardData?.medicalHistory?.notes}

                        />
                      </div>
                    ) : (
                      <NoDataRecorded />
                    )}
                  </TabsContent>

                  <TabsContent value="familyHistory" className="px-2">
                    {userDashboardData?.familyHistory ? (
                      <div
                        key={userDashboardData?.familyHistory?.id}
                        className="flex flex-col gap-2"
                      >
                        <div className="text-sm font-semibold text-gray-700">
                          Family History Recorded on{" "}
                          {new Date(
                            userDashboardData?.familyHistory?.updatedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}{" "}
                        </div>
                        <FaceSheetLabels
                          label="Relationship/Deceased:"
                          value={userDashboardData?.familyHistory?.relationship}
                        />
                        <FaceSheetLabels
                          label="Age:"
                          value={userDashboardData?.familyHistory?.age?.toString()}
                        />
                      </div>
                    ) : (
                      <NoDataRecorded />
                    )}
                  </TabsContent>

                  <TabsContent value="socialHistories" className="px-2">
                    {userDashboardData?.socialHistories ? (
                      <div
                        key={userDashboardData?.socialHistories?.id}
                        className="flex flex-col gap-2"
                      >
                        <div className="text-sm font-semibold text-gray-700">
                          Social History Recorded on{" "}
                          {new Date(
                            userDashboardData?.socialHistories?.updatedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}{" "}
                        </div>
                        <div
                          className="font-medium text-xs"
                          dangerouslySetInnerHTML={{
                            __html: userDashboardData?.socialHistories?.content,
                          }}
                        />
                      </div>
                    ) : (
                      <NoDataRecorded />
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-row gap-4 w-full md:w-full">
            <Card className="flex flex-1">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="Supplements"
                    href="medications"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2">
                {userDashboardData?.supplements ? (
                  <div
                    key={userDashboardData?.supplements?.id}
                    className={styles.dataContainer}
                  >
                    <div className={`${styles.infoTextLabel}`}>
                      {userDashboardData?.supplements?.supplementType?.name} {" - "}
                      {userDashboardData?.supplements?.manufacturer} {""}
                    </div>
                    <div className={styles.infoSub}>
                      {userDashboardData?.supplements?.dosage}{", "}
                      {userDashboardData?.supplements?.unit}{", "}
                      {userDashboardData?.supplements?.frequency}{", "}
                      {userDashboardData?.supplements?.intake_type}
                    </div>
                  </div>
                ) : (
                  <NoDataRecorded />
                )}
              </CardContent>
            </Card>
            <Card className="flex flex-1">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="Medication"
                    href="medications"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2">
                <span className={styles.infoText}>No data recorded</span>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-row gap-4 w-full md:w-full">
          <Card className="flex flex-1">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="Injections"
                    href="injections"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2 w-full">
                {userDashboardData?.injections ? (
                  <div className="flex flex-col gap-3 flex-1">
                    <div
                      key={userDashboardData?.injections?.id}
                      className={`${styles.subContainer} gap-1`}
                    >
                      <span className={styles.infoTextLabel}>
                        {userDashboardData?.injections?.injection_name
                          ? userDashboardData?.injections?.injection_name
                            : "N/A"}
                      </span>
                      <FaceSheetLabels
                        label="Dosage:"
                        value={
                          userDashboardData?.injections?.dosage_quantity
                            ? `${userDashboardData?.injections?.dosage_quantity} ${userDashboardData?.injections.dosage_unit}`
                            : "N/A"
                        }
                      />
                      <FaceSheetLabels
                        label="Administrated On:"
                        value={
                          userDashboardData?.injections?.administered_date
                            ? `
                      ${new Date(
                        userDashboardData?.injections?.administered_date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                      @
                     ${userDashboardData?.injections.administered_time}`
                            : "N/A"
                        }
                      />
                      <FaceSheetLabels
                        label="Frequency:"
                        value={
                          userDashboardData?.injections?.frequency
                            ? userDashboardData?.injections?.frequency
                            : "N/A"
                        }
                      />
                      <FaceSheetLabels
                        label="Comments:"
                        value={
                          userDashboardData?.injections?.comments
                            ? userDashboardData?.injections?.comments
                            : "N/A"
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <NoDataRecorded />
                )}
              </CardContent>
            </Card>
          <Card className="flex flex-1">
            <CardHeader>
              <CardTitle>
                <TitleLinks
                  title="Latest Labs"
                  href="lab_records"
                  userDetailsId={userDetailsId}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-2">
              {userDashboardData?.labResults ? (
                <div
                  key={userDashboardData?.labResults.id}
                  className={styles.dataContainer}
                >
                  <div className={`${styles.infoTextLabel}`}>
                    {userDashboardData?.labResults?.files?.map((image) => (
                      <Button
                        className="p-0"
                        key={image}
                        variant={"link"}
                        onClick={() => {
                          window.open(image, "_blank");
                        }}
                      >
                        {image.split("/")[4]}
                      </Button>
                    ))}
                  </div>
                  <div className={styles.infoSub}>
                    {new Date(
                      userDashboardData?.labResults?.dateTime
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ) : (
                <NoDataRecorded />
              )}
            </CardContent>
          </Card>
          </div>
          {/* <div className={styles.infoContainer}>
            <TitleLinks
              title="Implanted Devices"
              href="patientDetails"
              userDetailsId={userDetailsId}
            />
            {userDashboardData?.implantedDevices ? (
                <div key={userDashboardData?.implantedDevices.id}>
                  <FaceSheetLabels
                    label="UDI:"
                    value={
                      userDashboardData?.implantedDevices?.UDI ? userDashboardData?.implantedDevices?.UDI : "N/A"
                    }
                  />
                </div>
            ) : (
              <NoDataRecorded />
            )}
          </div>  */}
          <div className="flex flex-row gap-4 w-full md:w-full">
          <Card className="flex flex-1">
            <CardHeader>
              <CardTitle>
                <TitleLinks
                  title="Vaccines"
                  href="vaccines"
                  userDetailsId={userDetailsId}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-2">
              {userDashboardData?.vaccines ? (
                <div
                  key={userDashboardData?.vaccines?.id}
                  className={styles.dataContainer}
                >
                  <div className={`${styles.infoTextLabel}`}>
                    {userDashboardData?.vaccines?.vaccine_name}
                  </div>
                  <div className={styles.infoSub}>
                    {new Date(
                      userDashboardData?.vaccines?.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ) : (
                <NoDataRecorded />
              )}
            </CardContent>
          </Card>
          <Card className="flex flex-1">
            <CardHeader>
              <CardTitle>
                <TitleLinks
                  title="Past Visits"
                  href="encounters"
                  userDetailsId={userDetailsId}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-2">
              {userData?.encounter ? (
                userData?.encounter.map((visit) => (
                  <div key={visit?.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {visit?.providerID} {""}
                      {""} {visit.mode}
                    </div>
                    <div className={styles.infoSub}>
                      {new Date(visit?.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <NoDataRecorded />
              )}
            </CardContent>
          </Card>
          </div>
          <div className="flex flex-row gap-4 w-full md:w-full">
            <Card className="flex flex-1">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="Contact Details"
                    href="patientDetails"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2">
                {userData ? (
                  <div>
                    <FaceSheetLabels
                      label="Address:"
                      value={userData?.location ? userData?.location : "N/A"}
                    />
                    <FaceSheetLabels
                      label="Email:"
                      value={
                        userData?.user?.email ? userData?.user?.email : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="Phone:"
                      value={
                        userData?.user?.phoneNumber
                          ? userData?.user?.phoneNumber
                          : "N/A"
                      }
                    />
                  </div>
                ) : (
                  <NoDataRecorded />
                )}
              </CardContent>
            </Card>

            <Card className="flex flex-1">
              <CardHeader>
                <CardTitle>
                  <TitleLinks
                    title="Documents"
                    href="documents"
                    userDetailsId={userDetailsId}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-2">
                {userDashboardData?.documents ? (
                  <div
                    key={userDashboardData?.documents.id}
                    className={styles.dataContainer}
                  >
                    <div className={`${styles.infoTextLabel}`}>
                      {userDashboardData?.documents?.documents.map((image) => (
                        <Button
                          key={image}
                          className="p-0"
                          variant={"link"}
                          onClick={() => {
                            window.open(image, "_blank");
                          }}
                        >
                          {image.split("/")[4]}
                        </Button>
                      ))}
                    </div>
                    <div className={styles.infoSub}>
                      {new Date(
                        userDashboardData?.documents?.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                ) : (
                  <NoDataRecorded />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default FaceSheet;

const FaceSheetLabels = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) => {
  return (
    <div className="flex flex-row items-start ">
      {Icon && <Icon className="mr-2" style={{ width: 14, height: 14 }} />}
      <div className="flex flex-1 text-sm font-medium max-w-[200px] text-gray-600">
        {label}
      </div>
      <div className="flex flex-1 text-sm font-medium">{value}</div>
    </div>
  );
};

const NoDataRecorded = () => {
  return <div className={styles.infoText}>No Data Recorded</div>;
};

const TitleLinks = ({
  title,
  href,
  userDetailsId,
}: {
  title: string;
  href: string;
  userDetailsId: string;
}) => {
  return (
    <Link href={`/dashboard/provider/patient/${userDetailsId}/${href}`}>
      <div>{title}</div>
    </Link>
  );
};
