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
      <ScrollArea className="h-[65dvh]">
        <div className={styles.infoContent}>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Allergies"
              href="allergies"
              userDetailsId={userDetailsId}
            />
            {userData?.allergies && userData.allergies.length > 0 ? (
              userData?.allergies.map((allergies, index) => (
                <div
                  className={`${styles.infoTextLabel} text-[#fb6e52]`}
                  key={allergies.id}
                >
                  {index === 0 ? "" : ","}
                  {allergies.Allergen}
                </div>
              ))
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Diagnoses"
              href="diagnoses"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userDashboardData?.diagnoses ? (
                <div
                  key={userDashboardData?.diagnoses.id}
                  className={styles.dataContainer}
                >
                  <div className={`${styles.infoTextLabel}`}>
                    {userDashboardData?.diagnoses.diagnosis_name}[
                    {userDashboardData?.diagnoses.ICD_Code}]{" "}
                  </div>
                  <div className={styles.infoSub}>
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
            </div>
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
          <div className={styles.infoContainer}>
            <TitleLinks
              title="History"
              href="patientDetails"
              userDetailsId={userDetailsId}
            />
            <ScrollArea className="h-[12.5rem] min-h-10">
              <div className={styles.section}>
                <div className={styles.subContainer}>
                  <div className={`${styles.sectionLabel} text-[#FF9504]`}>
                    Past Medical History
                  </div>
                  <div className={styles.subContainer}>
                    {userDashboardData?.medicalHistory ? (
                      <div key={userDashboardData?.medicalHistory.id}>
                        <div
                          className={`${styles.sectionLabel} text-[#444444]`}
                        >
                          Medical History Recorded on{" "}
                          {new Date(
                            userDashboardData?.medicalHistory.updatedAt
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
                          value={userDashboardData?.medicalHistory.notes}
                        />
                      </div>
                    ) : (
                      <NoDataRecorded />
                    )}
                  </div>
                </div>
                <div className={styles.subContainer}>
                  <div className={`${styles.sectionLabel} text-[#FF9504]`}>
                    Family History
                  </div>
                  <div className="flex flex-col gap-3">
                    {userDashboardData?.familyHistory ? (
                      <div key={userDashboardData?.familyHistory.id}>
                        <div
                          className={`${styles.sectionLabel} text-[#444444]`}
                        >
                          Family History Recorded on{" "}
                          {new Date(
                            userDashboardData?.familyHistory.updatedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}{" "}
                        </div>
                        <FaceSheetLabels
                          label="Relationship/Deceased:"
                          value={userDashboardData?.familyHistory.relationship}
                        />
                        <FaceSheetLabels
                          label="Age:"
                          value={userDashboardData?.familyHistory?.age.toString()}
                        />
                      </div>
                    ) : (
                      <NoDataRecorded />
                    )}
                  </div>
                </div>
                <div className={styles.subContainer}>
                  <div className={`${styles.sectionLabel} text-[#FF9504]`}>
                    Social History
                  </div>
                  <div className="flex flex-col gap-3">
                    {userDashboardData?.socialHistories ? (
                      <div key={userDashboardData?.socialHistories.id}>
                        <div
                          className={`${styles.sectionLabel} text-[#444444]`}
                        >
                          Social History Recorded on{" "}
                          {new Date(
                            userDashboardData?.socialHistories.updatedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}{" "}
                        </div>
                        <div
                          className={styles.infoTextLabel}
                          dangerouslySetInnerHTML={{
                            __html: userDashboardData?.socialHistories.content,
                          }}
                        />
                      </div>
                    ) : (
                      <NoDataRecorded />
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Supplements"
              href="medications"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userDashboardData?.supplements ? (
                  <div key={userDashboardData?.supplements.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {userDashboardData?.supplements.supplement} {""}
                      {userDashboardData?.supplements.manufacturer} {""}
                      {userDashboardData?.supplements.dosage} {""}
                      {userDashboardData?.supplements.unit}{" "}
                    </div>
                    <div className={styles.infoSub}>
                      {userDashboardData?.supplements.frequency}, {""}
                      {userDashboardData?.supplements.intake_type}
                      {""}
                    </div>
                  </div>
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Recent Vitals"
              href="vitals"
              userDetailsId={userDetailsId}
            />
            <ScrollArea className="h-[12.5rem] min-h-10">
              <div className={styles.section}>
                {userData?.vitals ? (
                  userData?.vitals.reverse().map((vitals) => (
                    <div
                      key={vitals.id}
                      className={`${styles.subContainer} bg-[#F5F5F5] p-2 rounded`}
                    >
                      <div className={styles.infoSub}>
                        {new Date(vitals.dateTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                      <FaceSheetLabels
                        label="Weight:"
                        value={`${vitals.weightLbs} lbs ${vitals.weightOzs} ozs`}
                      />
                      <FaceSheetLabels
                        label="Height:"
                        value={`${vitals.heightFeets} ' ${vitals.heightInches}`}
                      />
                      <FaceSheetLabels label="BMI:" value={`${vitals.BMI}`} />
                    </div>
                  ))
                ) : (
                  <NoDataRecorded />
                )}
              </div>
            </ScrollArea>
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Injections"
              href="injections"
              userDetailsId={userDetailsId}
            />
            {userDashboardData?.injections ? (
              <div className="flex flex-col gap-3">
                <div
                  key={userDashboardData?.injections.id}
                  className={`${styles.subContainer} bg-[#F5F5F5] p-2 rounded`}
                >
                  <FaceSheetLabels
                    label="Injection Name:"
                    value={
                      userDashboardData?.injections?.injection_name
                        ? userDashboardData?.injections.injection_name
                        : "N/A"
                    }
                  />
                  <FaceSheetLabels
                    label="Dosage:"
                    value={
                      userDashboardData?.injections?.dosage_quantity
                        ? `${userDashboardData?.injections.dosage_quantity} ${userDashboardData?.injections.dosage_unit}`
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
                     ${userDashboardData?.injections.administered_time} ${
                            userDashboardData?.injections.frequency
                          }`
                        : "N/A"
                    }
                  />
                  <FaceSheetLabels
                    label="Comments:"
                    value={
                      userDashboardData?.injections?.comments
                        ? userDashboardData?.injections.comments
                        : "N/A"
                    }
                  />
                </div>
              </div>
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Latest Labs"
              href="lab_records"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userDashboardData?.labResults ? (
                <div
                  key={userDashboardData?.labResults.id}
                  className={styles.dataContainer}
                >
                  <div className={`${styles.infoTextLabel}`}>
                    {userDashboardData?.labResults.files.map((image) => (
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
                      userDashboardData?.labResults.dateTime
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
            </div>
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
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Vaccines"
              href="vaccines"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userDashboardData?.vaccines ? (
                <div
                  key={userDashboardData?.vaccines.id}
                  className={styles.dataContainer}
                >
                  <div className={`${styles.infoTextLabel}`}>
                    {userDashboardData?.vaccines.vaccine_name}
                  </div>
                  <div className={styles.infoSub}>
                    {new Date(
                      userDashboardData?.vaccines.createdAt
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
            </div>
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Past Visits"
              href="encounters"
              userDetailsId={userDetailsId}
            />
            <div className={styles.subContainer}>
              {userData?.encounter ? (
                userData?.encounter.map((visit) => (
                  <div key={visit.id} className={styles.dataContainer}>
                    <div className={`${styles.infoTextLabel}`}>
                      {visit.providerID} {""}
                      {""} {visit.mode}
                    </div>
                    <div className={styles.infoSub}>
                      {new Date(visit.date).toLocaleDateString("en-US", {
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
            </div>
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Contact Details"
              href="patientDetails"
              userDetailsId={userDetailsId}
            />
            {userData ? (
              <div>
                <FaceSheetLabels
                  label="Address:"
                  value={userData?.location ? userData?.location : "N/A"}
                />
                <FaceSheetLabels
                  label="Email:"
                  value={userData?.user?.email ? userData?.user?.email : "N/A"}
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
          </div>
          <div className={styles.infoContainer}>
            <TitleLinks
              title="Documents"
              href="documents"
              userDetailsId={userDetailsId}
            />
            <ScrollArea className="h-[12.5rem] min-h-10">
              <div className={styles.subContainer}>
                {userDashboardData?.documents ? (
                    <div key={userDashboardData?.documents.id} className={styles.dataContainer}>
                      <div className={`${styles.infoTextLabel}`}>
                        {userDashboardData?.documents.documents.map((image) => (
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
                        {new Date(userDashboardData?.documents.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                ) : (
                  <NoDataRecorded />
                )}
              </div>
            </ScrollArea>
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
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex flex-row gap-3 items-baseline">
      <div className={styles.infoText}>{label}</div>
      <div className={styles.infoTextLabel}>{value}</div>
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
      <div
        className={`${styles.infoLabel} hover:text-blue-600 hover:underline`}
      >
        {title}
      </div>
    </Link>
  );
};
