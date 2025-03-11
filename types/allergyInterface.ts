export interface AllergeyRequestInterface {
  allergies: AllergenInterface[];
}

export interface AllergenInterface {
  typeId: string;
  severity: string;
  observedOn: string;
  allergen: string;
  status: string;
  reactions: Reaction[];
  userDetailsId: string;
  providerId: string;
}

export interface AllergenResponseInterfae {
  id: string;
  severity: string;
  observedOn: string;
  allergen: string;
  status: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  reactions: ReactionResponse[];
  type: AllergyType;
  allergyType: {
    name: string;
    description: string;
  };
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
