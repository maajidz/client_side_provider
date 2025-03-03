import DiagnosesClient from "./client";

const PatientDiagnoses = ({ userDetailsId }: { userDetailsId: string }) => {
  return <DiagnosesClient userDetailsId={userDetailsId} />;
};

export default PatientDiagnoses;
