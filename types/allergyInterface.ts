export interface AllergeyRequestInterface {
  allergies: AllergenInterface[];
}

export interface AllergenInterface {
  typeId: string;
  serverity: string;
  observedOn: string;
  Allergen: string;
  status: string;
  reactions: Reaction[];
  userDetailsId: string;
  providerId: string;
}

export interface AllergenResponseInterfae {
  id: string;
  typeId: string;
  serverity: string;
  observedOn: string;
  Allergen: string;
  status: string;
  reactions: ReactionResponse[];
  userDetailsId: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  allergyType: AllergyType;
  providerName: string;
}

export interface UpdateAllergenInterface {
  typeId: string;
  serverity: string;
  observedOn: string;
  Allergen: string;
  status: string;
  reactions?: Reaction[];
}

export interface Reaction {
  name: string;
  additionalText: string;
}

export interface ReactionResponse {
  id: string;
  name: string;
  addtionalText: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllergyTypeResponse {
  total: number;
  page: string;
  limit: string;
  allergyTypes: AllergyType[];
}

export interface AllergyType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
