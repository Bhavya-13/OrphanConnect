export interface MoneyNeed {
  id: string;
  orphanageId: string;
  type: "money";
  title: string;
  description: string;
  amountNeeded: number;
  amountRaised: number;
  urgent: boolean;
}

export interface GoodsNeed {
  id: string;
  orphanageId: string;
  type: "goods";
  title: string;
  description: string;
  quantityNeeded: number;
  quantityFulfilled: number;
  unit: string;
  urgent: boolean;
}

export type Need = MoneyNeed | GoodsNeed;

export interface VolunteerRequest {
  id: string;
  orphanageId: string;
  task: string;
  description: string;
  date: string;
  slotsAvailable: number;
  slotsFilled: number;
}

export interface Orphanage {
  id: string;
  name: string;
  location: string;
  state: string;
  story: string;
  childrenCount: number;
  verified: boolean;
  imageUrl: string;
  views: number;
}

export interface Contribution {
  id: string;
  needId: string;
  donorName: string;
  type: "money" | "goods";
  amount?: number;
  quantity?: number;
  createdAt: string;
}

export interface VolunteerSignup {
  id: string;
  volunteerRequestId: string;
  volunteerName: string;
  contact: string;
  createdAt: string;
}
