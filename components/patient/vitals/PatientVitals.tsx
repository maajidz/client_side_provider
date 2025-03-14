import ViewPatientVitals from "./ViewPatientVitals";

const PatientVitals = ({ userDetailsId }: { userDetailsId: string }) => {
  return (
    <ViewPatientVitals userDetailsId={userDetailsId} />
  );
};

export default PatientVitals;
