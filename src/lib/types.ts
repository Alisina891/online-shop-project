
export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  type: 'Job' | 'Scholarship' | 'Internship';
  location: string;
  description: string;
  url: string;
  featured?: boolean;
  logoUrl: string;
  category: string;
  closingDate?: string;

  // Job specific fields
  responsibilities?: string[];
  qualifications?: string[];
  postDate?: string;
  reference?: string;
  numberOfVacancies?: number;
  salaryRange?: string;
  yearsOfExperience?: string;
  probationPeriod?: string;
  contractType?: string;
  contractDuration?: string;
  contractExtensible?: boolean;
  minimumEducation?: string;
  gender?: 'Male' | 'Female' | 'Any';
  functionalArea?: string;
  countries?: string[];
  submissionEmail?: string;

  // Scholarship specific fields
  eligibility?: string[];
  awardAmount?: string;

  // Fields from backend
  userId?: string;
  createdAt?: string;
};
export type Category = {
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type Sponsor = {
  name: string;
  logoUrl: string;
};
