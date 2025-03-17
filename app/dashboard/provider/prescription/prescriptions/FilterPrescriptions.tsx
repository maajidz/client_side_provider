import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrescriptionTableInterface } from "./column";

interface FilterPrescriptions {
  prescriptions: PrescriptionTableInterface[];
  onFilter: (prescriptions: PrescriptionTableInterface[]) => void;
}

function FilterPrescriptions({ prescriptions, onFilter }: FilterPrescriptions) {
  /**
   * * FILTER BY PATIENT
   */
  function filterByPatients(patient: string) {
    let filteredData: PrescriptionTableInterface[] = [];

    if (patient != "all") {
      filteredData = prescriptions.filter(
        (prescription) => prescription.patient === patient
      );
    } else {
      filteredData = prescriptions;
    }

    onFilter(filteredData);
  }

  /**
   * * FILTER BY PROVIDERS
   */
  function filterByProviders(provider: string) {
    let filteredData: PrescriptionTableInterface[] = [];

    if (provider != "all") {
      filteredData = prescriptions.filter(
        (prescription) => prescription.provider === provider
      );
    } else {
      filteredData = prescriptions;
    }

    onFilter(filteredData);
  }

  /**
   * * FILTER BY FROM DATE
   */
  function filterByFromDate(fromDate: string) {
    let filteredData: PrescriptionTableInterface[] = [];

    if (fromDate != "all") {
      filteredData = prescriptions.filter(
        (prescription) => prescription.fromDate === fromDate
      );
    } else {
      filteredData = prescriptions;
    }

    onFilter(filteredData);
  }

  /**
   * * FILTER BY TO DATE
   */
  function filterByToDate(toDate: string) {
    let filteredData: PrescriptionTableInterface[] = [];

    if (toDate != "all") {
      filteredData = prescriptions.filter(
        (prescription) => prescription.toDate === toDate
      );
    } else {
      filteredData = prescriptions;
    }

    onFilter(filteredData);
  }

  return (
    <div className="flex gap-4 flex-row">
      {/* Patients Filter */}
      <Select onValueChange={(value) => filterByPatients(value)}>
        <SelectTrigger className="w-full p-3 rounded-md text-gray-500">
          <SelectValue placeholder="Filter by Patients" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {prescriptions.map((prescription) => (
            <SelectItem key={prescription.patient} value={prescription.patient}>
              {prescription.patient}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Provider Filter */}
      <Select onValueChange={(value) => filterByProviders(value)}>
        <SelectTrigger className="w-full p-3 rounded-md text-gray-500">
          <SelectValue placeholder="Filter by Providers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {prescriptions.map((prescription) => (
            <SelectItem
              key={prescription.provider}
              value={prescription.provider}
            >
              {prescription.provider}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* From Date Filter */}
      <Select onValueChange={(value) => filterByFromDate(value)}>
        <SelectTrigger className="w-full  p-3 rounded-md text-gray-500">
          <SelectValue placeholder="Filter by From Data" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {prescriptions.map((prescription) => (
            <SelectItem
              key={prescription.fromDate}
              value={prescription.fromDate}
            >
              {prescription.fromDate}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* To Date Filter */}
      <Select onValueChange={(value) => filterByToDate(value)}>
        <SelectTrigger className="w-full  p-3 rounded-md text-gray-500">
          <SelectValue placeholder="Filter by To Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {prescriptions.map((prescription) => (
            <SelectItem key={prescription.toDate} value={prescription.toDate}>
              {prescription.toDate}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterPrescriptions;

