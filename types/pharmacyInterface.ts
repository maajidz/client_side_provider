export interface PharmacyInterface {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  userDetailsID: string;
  createdAt: string;
  updatedAt: string;
}

// Params interface
export interface PharmacyRequestInterface {
  name?: string;
  /** *
   * * Supposed to be 'city'
   */
  type?: string;
  address?: string;
  contact?: string;
  zipCode?: string;
}

export interface AddPharmacyInterface {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
  userDetailsID: string;
}

export interface UserPharmacyInterface {
	id: string;
	name: string;
	address: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
	phoneNumber: string;
	userDetailsID: string;
	createdAt: string;
	updatedAt: string;
}