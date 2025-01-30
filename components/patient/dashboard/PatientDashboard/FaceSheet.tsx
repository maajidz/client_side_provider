import React, { useCallback, useEffect, useState } from "react";
import styles from "./face_Sheet.module.css";
import { fetchUserInfo } from "@/services/userServices";
import { PatientDetails } from "@/types/userInterface";
import { getInjection } from "@/services/injectionsServices";
import { InjectionsResponse } from "@/types/injectionsInterface";
import { SupplementInterface } from "@/types/supplementsInterface";
import { getSupplements } from "@/services/chartDetailsServices";
import LoadingButton from "@/components/LoadingButton";
import { ScrollArea } from "@/components/ui/scroll-area";

const FaceSheet = ({ userDetailsId }: { userDetailsId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<PatientDetails>();
  const [injectionsData, setInjectionsData] = useState<InjectionsResponse>();
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

  const fetchInjectionsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getInjection({
        page: 1,
        limit: 10,
        userDetailsId: userDetailsId,
      });

      if (response) {
        setInjectionsData(response);
      }
    } catch (err) {
      console.log(err);
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
    fetchInjectionsData();
    fetchSupplements();
  }, [fetchUserData, fetchInjectionsData, fetchSupplements]);

  if (loading) {
    return <LoadingButton />;
  }

  return (
    <>
      <ScrollArea className="h-[65dvh]">
          <div className={styles.infoContent}>
            <div className={styles.infoContainer}>
              <div className={styles.infoLabel}>Allergies</div>
              {userData?.allergies.map((allergies, index) => (
                <div
                  className={`${styles.infoTextLabel} text-[#fb6e52]`}
                  key={allergies.id}
                >
                  {index === 0 ? "" : ","}
                  {allergies.Allergen}
                </div>
              ))}

              <div></div>
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.infoLabel}>Diagnoses</div>
              <div></div>
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.infoLabel}>Medications</div>
              <div></div>
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.infoLabel}>History</div>
              <div></div>
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
                {userData?.vitals.map((vitals) => (
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
                ))}
              </div>
            </div>
            <div className={styles.infoContainer}>
              <div className={styles.infoLabel}>Injections</div>
              {injectionsData?.data ? (
                <div className="flex flex-col gap-3">
                  {injectionsData.data.map((injections) => (
                    <div key={injections.id}>
                      <FaceSheetLabels
                        label="Injection Name:"
                        value={injections?.injection_name ? injections.injection_name : "N/A"}
                      />
                      <FaceSheetLabels
                        label="Dosage:"
                        value={injections?.dosage_quantity ? `${injections.dosage_quantity} ${injections.dosage_unit}` : "N/A"}
                      />
                      <FaceSheetLabels
                        label="Administrated On:"
                        value={injections?.administered_date ? `${injections.administered_date} ${injections.administered_time} ${injections.frequency}` : "N/A"}
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
