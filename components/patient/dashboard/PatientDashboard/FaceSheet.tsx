import React, { useCallback, useEffect, useState } from "react";
import styles from "./face_Sheet.module.css";
import { fetchUserInfo } from "@/services/userServices";
import { PatientDetails } from "@/types/userInterface";
import { SupplementInterface } from "@/types/supplementsInterface";
import { getSupplements } from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const FaceSheet = ({ userDetailsId }: { userDetailsId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<PatientDetails>();
  const [supplementData, setSupplementData] = useState<SupplementInterface[]>();

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await fetchUserInfo({ userDetailsId: userDetailsId });
      if (userData) {
        setUserData(userData.userDetails);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  const fetchSupplements = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getSupplements({
        userDetailsId: userDetailsId,
      });

      if (response) {
        setSupplementData(response.data);
      }
    } catch (err) {
      console.log("Error", err);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    fetchUserData();
    fetchSupplements();
  }, [fetchUserData, fetchSupplements]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <ScrollArea className="h-[65dvh]">
        <div className={styles.infoContent}>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Allergies</div>
            {userData?.allergies ? (
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
            <div className={styles.infoLabel}>Diagnoses</div>
            {userData?.diagnoses ? (
              userData?.diagnoses.map((diagnosis, index) => (
                <div className={`${styles.infoTextLabel}`} key={diagnosis.id}>
                  {index === 0 ? "" : ","}
                  {diagnosis.diagnosis_name}[{diagnosis.ICD_Code}]
                </div>
              ))
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Medications</div>
            <div></div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>History</div>
            <ScrollArea className="h-[12.5rem] min-h-10">
              <div>
                <div className={`${styles.infoTextLabel} underline`}>
                  Past Medical History
                </div>
                <div className="flex flex-col gap-3">
                  {userData?.medicalHistory ? (
                    userData?.medicalHistory?.map((medicalHistory) => (
                      <div key={medicalHistory.id}>
                        <div>
                          Medical History Recorded on{" "}
                          {new Date(
                            medicalHistory.updatedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}{" "}
                        </div>
                        <FaceSheetLabels
                          label="GLP Refill Note:"
                          value={medicalHistory.glp_refill_note_practice}
                        />
                        <FaceSheetLabels
                          label="Notes:"
                          value={medicalHistory.notes}
                        />
                      </div>
                    ))
                  ) : (
                    <NoDataRecorded />
                  )}
                </div>
              </div>
              <div>
                <div className={`${styles.infoTextLabel} underline`}>
                  Family History
                </div>
                <div className="flex flex-col gap-3">
                  {userData?.familyHistory ? (
                    userData?.familyHistory?.map((family) => (
                      <div key={family.id}>
                        <div>
                          Family History Recorded on{" "}
                          {new Date(family.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}{" "}
                        </div>
                        <FaceSheetLabels
                          label="Relationship/Deceased:"
                          value={family.relationship}
                        />
                        <FaceSheetLabels
                          label="Age:"
                          value={family?.age.toString()}
                        />
                      </div>
                    ))
                  ) : (
                    <NoDataRecorded />
                  )}
                </div>
              </div>
              <div>
                <div className={`${styles.infoTextLabel} underline`}>
                  Social History
                </div>
                <div className="flex flex-col gap-3">
                  {userData?.socialHistories ? (
                    userData?.socialHistories?.map((socialHistory) => (
                      <div key={socialHistory.id}>
                        <div>
                          Social History Recorded on{" "}
                          {new Date(socialHistory.updatedAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}{" "}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: socialHistory.content,
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <NoDataRecorded />
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Supplements</div>
            <div>
              {supplementData ? (
                <div>
                  {supplementData.map((injections) => (
                    <div key={injections.id}>
                      <FaceSheetLabels
                        label="Address:"
                        value={injections ? injections?.manufacturer : "N/A"}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <NoDataRecorded />
              )}
            </div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Recent Vitals</div>
            <div className="flex flex-col gap-3">
              {userData?.vitals ? (
                userData?.vitals.map((vitals) => (
                  <div key={vitals.id}>
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
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Injections</div>
            {userData?.injections ? (
              <div className="flex flex-col gap-3">
                {userData?.injections.map((injections) => (
                  <div key={injections.id}>
                    <FaceSheetLabels
                      label="Injection Name:"
                      value={
                        injections?.injection_name
                          ? injections.injection_name
                          : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="Dosage:"
                      value={
                        injections?.dosage_quantity
                          ? `${injections.dosage_quantity} ${injections.dosage_unit}`
                          : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="Administrated On:"
                      value={
                        injections?.administered_date
                          ? `${injections.administered_date} ${injections.administered_time} ${injections.frequency}`
                          : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="Comments:"
                      value={injections?.comments ? injections.comments : "N/A"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Latest Labs</div>
            {userData?.labResults ? (
              <div className="flex flex-col gap-3">
                {userData?.labResults.map((labs) => (
                  <div key={labs.id}>
                    <FaceSheetLabels
                      label="Status:"
                      value={labs?.status ? labs.status : "N/A"}
                    />
                    <FaceSheetLabels
                      label="Tags:"
                      value={labs?.tags ? labs.tags : "N/A"}
                    />
                    {labs.files.map((image) => (
                      <Button
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
                ))}
              </div>
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Implanted Devices</div>
            {userData?.implantedDevices ? (
              userData.implantedDevices.map((implantedDevices) => (
                <div key={implantedDevices.id}>
                  <FaceSheetLabels
                    label="UDI:"
                    value={
                      implantedDevices?.UDI ? implantedDevices?.UDI : "N/A"
                    }
                  />
                </div>
              ))
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Vaccines</div>
            {userData?.vaccines ? (
              <div className="flex flex-col gap-3">
                {userData?.vaccines.map((vaccine) => (
                  <div key={vaccine.id}>
                    <FaceSheetLabels
                      label="Vaccine Name:"
                      value={
                        vaccine?.vaccine_name ? vaccine.vaccine_name : "N/A"
                      }
                    />
                    <FaceSheetLabels
                      label="status:"
                      value={vaccine?.status ? vaccine?.status : "N/A"}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Past Visits</div>
            <div></div>
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Contact Details</div>
            {userData ? (
              <div>
                <FaceSheetLabels
                  label="Address:"
                  value={userData?.location ? userData?.location : "N/A"}
                />
                <FaceSheetLabels
                  label="Email:"
                  value={userData?.user.email ? userData?.user.email : "N/A"}
                />
                <FaceSheetLabels
                  label="Phone:"
                  value={
                    userData?.user.phoneNumber
                      ? userData?.user.phoneNumber
                      : "N/A"
                  }
                />
              </div>
            ) : (
              <NoDataRecorded />
            )}
          </div>
          <div className={styles.infoContainer}>
            <div className={styles.infoLabel}>Documents</div>
            <ScrollArea className="h-[12.5rem] min-h-10">
              {userData?.documents ? (
                userData.documents.map((docs) => (
                  <div key={docs.id}>
                    <FaceSheetLabels
                      label="Document Type:"
                      value={docs?.document_type ? docs?.document_type : "N/A"}
                    />
                    <FaceSheetLabels
                      label="Notes:"
                      value={docs?.notes ? docs?.notes : "N/A"}
                    />{" "}
                    {docs.documents.map((image) => (
                      <Button
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
                ))
              ) : (
                <NoDataRecorded />
              )}
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
    <div className="flex flex-row gap-3">
      <div className={styles.infoText}>{label}</div>
      <div className={styles.infoTextLabel}>{value}</div>
    </div>
  );
};

const NoDataRecorded = () => {
  return <div className={styles.infoText}>No Data Recorded</div>;
};
