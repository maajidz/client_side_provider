import LoadingButton from "@/components/LoadingButton";
import { isInsured } from "@/constants/data";
import { getInsuranceData } from "@/services/insuranceServices";
import { InsuranceResponse } from "@/types/insuranceInterface";
import InsuranceDialog from "./InsuranceDialog";
import InsuranceTable from "./InsuranceTable";
import React, { useCallback, useEffect, useState } from "react";

interface InsuranceInformationProps {
  userDetailsId: string;
}

const InsuranceInformation = ({ userDetailsId }: InsuranceInformationProps) => {
  // Insurance State
  const [insuranceData, setInsuranceData] = useState<InsuranceResponse>();

  // Is Insured State
  const [selectedIsInsured, setSelectedIsInsured] = useState(
    isInsured[0].isInsured
  );

  // Selected Insurance
  const [selectedInsurance, setSelectedInsurance] = useState<
    InsuranceResponse | undefined
  >();

  // Loading State
  const [loading, setLoading] = useState(true);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // GET Insurance Data
  const fetchInsuranceData = useCallback(async () => {
    setLoading(true);
    try {
      const userInsurance = await getInsuranceData({ userDetailsId });

      if (userInsurance) {
        setInsuranceData(userInsurance);
      }
    } catch (error) {
      console.error("Error fetching insurance data:", error);
    } finally {
      setLoading(false);
    }
  }, [userDetailsId]);

  useEffect(() => {
    if (userDetailsId) {
      fetchInsuranceData();
    }
  }, [userDetailsId, fetchInsuranceData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingButton />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-5">
      <div className="flex justify-end">
        <InsuranceDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          userDetailsId={userDetailsId}
          selectedIsInsured={selectedIsInsured}
          selectedInsurance={selectedInsurance}
          setSelectedInsurance={setSelectedInsurance}
          setSelectedIsInsured={setSelectedIsInsured}
        />
      </div>
      <InsuranceTable
        insuranceData={insuranceData}
        setIsDialogOpen={setIsDialogOpen}
        setSelectedInsurance={setSelectedInsurance}
      />
    </div>
  );
};

export default InsuranceInformation;


