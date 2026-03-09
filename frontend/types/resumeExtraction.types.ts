export interface ExtractedResumePersonalInfo {
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly location?: string;
}

export interface ExtractedResumeExperience {
  readonly title?: string;
  readonly company?: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly achievements?: readonly string[];
}

export interface ExtractedResumeProject {
  readonly name?: string;
  readonly description?: string;
  readonly technologies?: readonly string[];
}

export interface ExtractedResumeSkills {
  readonly technical?: readonly string[];
  readonly soft?: readonly string[];
}

export interface ResumeExtractedData {
  readonly personalInfo?: ExtractedResumePersonalInfo;
  readonly summary?: string;
  readonly experience?: readonly ExtractedResumeExperience[];
  readonly skills?: ExtractedResumeSkills;
  readonly projects?: readonly ExtractedResumeProject[];
}
