import LoadingButton from "@/components/LoadingButton";
import { isInsured } from "@/constants/data";
import { getInsuranceData } from "@/services/insuranceServices";
import { InsuranceResponse } from "@/types/insuranceInterface";
import InsuranceDialog from "./InsuranceDialog";
import React, { useCallback, useEffect, useState } from "react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "./column";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AddOrViewNotes from "./actions/AddOrViewNotes";

interface InsuranceInformationProps {
  userDetailsId: string;
}

const InsuranceInformation = ({ userDetailsId }: InsuranceInformationProps) => {
  // Insurance State
  const [insuranceData, setInsuranceData] = useState<InsuranceResponse>();
  const [isOpenNotesDialog, setIsOpenNotesDialog] = useState(false);

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

  const { toast } = useToast();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // GET Insurance Data
  const fetchInsuranceData = useCallback(async () => {
    setLoading(true);
    try {
      const userInsurance = await getInsuranceData({ userDetailsId });

      if (userInsurance) {
        setInsuranceData(userInsurance);
      } else {
        throw new Error("Error fetching insurance data");
      }
    } catch (error) {
      console.log(error);
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
          onFetchInsuranceData={fetchInsuranceData}
        />
      </div>
      <DefaultDataTable
        title={"Insurance"}
        onAddClick={() => {
          setIsDialogOpen(true);
        }}
        pageNo={1}
        totalPages={1}
        onPageChange={() => {}}
        columns={columns({
          setIsDialogOpen,
          setSelectedInsurance: () => setSelectedInsurance(insuranceData),
          setLoading,
          showToast: () =>
            showToast({
              toast,
              type: "success",
              message: "Deleted successfully",
            }),
          fetchInsuranceData: () => fetchInsuranceData(),
          setIsOpenNotesDialog,
        })}
        data={insuranceData ? [insuranceData] : []}
      />
      <AddOrViewNotes
        isOpen={isOpenNotesDialog}
        onSetIsOpenNotesDialog={setIsOpenNotesDialog}
      />
    </div>
  );
};

export default InsuranceInformation;
