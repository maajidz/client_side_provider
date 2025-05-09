import { insuranceType } from "@/constants/data";
import { getInsuranceData } from "@/services/insuranceServices";
import { InsuranceResponse } from "@/types/insuranceInterface";
import InsuranceDialog from "./InsuranceDialog";
import React, { useCallback, useEffect, useState } from "react";
import { DefaultDataTable } from "@/components/custom_buttons/table/DefaultDataTable";
import { columns } from "./column";
import { showToast } from "@/utils/utils";
import { useToast } from "@/hooks/use-toast";
import AddOrViewNotes from "./actions/AddOrViewNotes";
import TableShimmer from "@/components/custom_buttons/shimmer/TableShimmer";

interface InsuranceInformationProps {
  userDetailsId: string;
}

const InsuranceInformation = ({ userDetailsId }: InsuranceInformationProps) => {
  // Insurance State
  const [insuranceData, setInsuranceData] = useState<InsuranceResponse>();
  const [isOpenNotesDialog, setIsOpenNotesDialog] = useState(false);

  // Is Insured State
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string>(
    insuranceType[0]
  );

  // Selected Insurance
  const [selectedInsurance, setSelectedInsurance] = useState<
    InsuranceResponse | undefined
  >();

  // Loading State
  const [loading, setLoading] = useState<boolean>(true);

  const { toast } = useToast();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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

  return (
    <div className="flex flex-col space-y-4 p-5">
      <div className="flex justify-end">
        <InsuranceDialog
          isOpen={isDialogOpen}
          userDetailsId={userDetailsId}
          selectedIsInsured={selectedInsuranceType}
          selectedInsurance={selectedInsurance}
          setIsOpen={setIsDialogOpen}
          setSelectedInsurance={setSelectedInsurance}
          onFetchInsuranceData={fetchInsuranceData}
          setSelectedIsInsured={setSelectedInsuranceType}
        />
      </div>
      {loading ? (
        <TableShimmer />
      ) : (
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
            showToast: ({ type, message }) => {
              showToast({
                toast,
                type: type === "success" ? "success" : "error",
                message,
              });
            },
            // showToast: (args) => showToast({ toast, ...args }),
            fetchInsuranceData: () => fetchInsuranceData(),
            setIsOpenNotesDialog,
          })}
          data={insuranceData ? [insuranceData] : []}
        />
      )}
      <AddOrViewNotes
        isOpen={isOpenNotesDialog}
        onClose={() => {
          setIsOpenNotesDialog(false);
          fetchInsuranceData();
        }}
        selectedInsurance={insuranceData}
      />
    </div>
  );
};

export default InsuranceInformation;
