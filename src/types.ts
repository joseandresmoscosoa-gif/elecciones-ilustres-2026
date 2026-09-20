export type Step = "entrada" | "papeleta" | "registro" | "confirmacion";

export interface VoterForm {
  name: string;
  phone: string;
  email: string;
  dataConsent: boolean;
  marketingConsent: boolean;
}

export interface VoteResult {
  couponCode: string;
  candidateName: string;
}
