import { ReactNode } from "react";

export interface ISubtext {
  subContent: string | ReactNode;
  subFootnote?: ReactNode,
  subNeutral?: boolean;
  subNegative?: boolean;
}

export interface IFeatures {
    text: string;
    subText?: Array<ISubtext>;
    footnote?: ReactNode;
    neutral?: boolean;
    negative?: boolean;
  }
  
 export interface IPricingItems {
    plan: string;
    tagline: string;
    activeMasseuses: number;
    features: Array<IFeatures>;
    cta: string;
  }