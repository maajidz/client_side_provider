export interface ImplantedDevices {
  id: string;
  UDI: string;
  implant_name: string;
  implant_date: string;
  status: string;
  brand_name: string;
  version_or_model: string;
  company_name: string;
  mri_compatible: boolean;
  latex_content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateImplantedDevices {
  UDI: string;
  userDetailsId: string;
  providerId: string;
}

export interface ImplantDeviceResponse {
  total: number;
  page: string;
  limit: string;
  organizedData: Device[];
}

export interface Device {
  id: string;
  UDI: string;
  providerId: string;
  created_at: string;
  updated_at: string;
  device_type: ImplantedDevices;
}
