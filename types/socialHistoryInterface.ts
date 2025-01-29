export interface SocialHistoryInterface {
  id: string;
  content: string;
  providerId: string;
  userDetailsId: string;
}

export interface SocialHistoryResponseInterface {
  data: SocialHistoryInterface[];
  total: number;
  page: number;
  limit: number;
}

export type CreateSocialHistoryType = Omit<SocialHistoryInterface, "id">;

export type UpdateSocialHistoryType = CreateSocialHistoryType;
