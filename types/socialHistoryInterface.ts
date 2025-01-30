export interface SocialHistoryInterface {
  id: string;
  content: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  userDetailsId: string;
}

export interface SocialHistoryResponseInterface {
  data: SocialHistoryInterface[];
  total: number;
  page: number;
  limit: number;
}

export type CreateSocialHistoryType = {
  content: string;
  providerId: string;
  userDetailsId: string;
};

export type UpdateSocialHistoryType = CreateSocialHistoryType;
