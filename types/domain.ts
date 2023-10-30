export interface DomainProps {
    slug: string;
    verified: boolean;
    primary: boolean;
    target?: string;
    type: "redirect" | "rewrite";
  }