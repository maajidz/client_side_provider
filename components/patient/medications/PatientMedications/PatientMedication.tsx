import ViewPatientMedications from "./ViewPatientMedications";

const PatientMedication = ({
  userDetailsId,
  onSetQuickRxVisible,
}: {
  userDetailsId: string;
  onSetQuickRxVisible: (visible: boolean) => void;
}) => {
  return (
    <ViewPatientMedications
      userDetailsId={userDetailsId}
      onSetQuickRxVisible={onSetQuickRxVisible}
    />
  );
};

export default PatientMedication;
