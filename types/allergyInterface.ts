export interface AllergeyRequestInterface {
  allergies: AllergenInterface[]
}

export interface AllergenInterface {
  type: string;
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
  type: string;
  serverity: string;
  observedOn: string;
  Allergen: string;
  status: string;
  reactions: ReactionResponse[];
  userDetailsId: string;
  providerId: string;
}

export interface UpdateAllergenInterface {
  type: string;
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
  id: string
  name: string
  addtionalText: string
  createdAt: string
  updatedAt: string
}
