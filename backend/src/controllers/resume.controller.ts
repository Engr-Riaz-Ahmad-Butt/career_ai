import { Request, Response } from 'express';
import { ResumeService } from '../services/resume.service';
import { z } from 'zod';

const resumeService = new ResumeService();

const createSchema = z.object({
  title: z.string().min(1),
  template: z.enum(['classic', 'modern', 'creative', 'executive', 'academic']),
  targetRole: z.string().optional(),
  industry: z.string().optional(),
});

const updateSchema = z.object({
  personalInfo: z.any().optional(),
  summary: z.string().optional(),
  experience: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  skills: z.any().optional(),
  projects: z.array(z.any()).optional(),
  certifications: z.array(z.any()).optional(),
  template: z.string().optional(),
  status: z.enum(['DRAFT', 'COMPLETE']).optional(),
  targetRole: z.string().optional(),
  industry: z.string().optional(),
}).passthrough();

const querySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt']).optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const listResumes = async (req: Request, res: Response) => {
  const params = querySchema.parse(req.query);
  const result = await resumeService.listResumes(req.user!.userId, params);
  res.json({ success: true, data: result });
};

export const createResume = async (req: Request, res: Response) => {
  const data = createSchema.parse(req.body);
  const resume = await resumeService.createResume(req.user!.userId, data);
  res.status(201).json({ success: true, message: 'Resume created', data: { resume } });
};

export const getResume = async (req: Request, res: Response) => {
  const resume = await resumeService.getResumeById(req.user!.userId, req.params.id);
  res.json({ success: true, data: { resume } });
};

export const updateResume = async (req: Request, res: Response) => {
  const data = updateSchema.parse(req.body);
  const resume = await resumeService.updateResume(req.user!.userId, req.params.id, data);
  res.json({ success: true, message: 'Resume updated', data: { resume } });
};

export const deleteResume = async (req: Request, res: Response) => {
  await resumeService.deleteResume(req.user!.userId, req.params.id);
  res.json({ success: true, message: 'Resume deleted' });
};

export const duplicateResume = async (req: Request, res: Response) => {
  const resume = await resumeService.duplicateResume(req.user!.userId, req.params.id);
  res.status(201).json({ success: true, message: 'Resume duplicated', data: { resume } });
};

export const generatePdf = async (req: Request, res: Response) => {
  const result = await resumeService.generatePdf(req.user!.userId, req.params.id);
  res.json({ success: true, data: result });
};

export const listVersions = async (req: Request, res: Response) => {
  const versions = await resumeService.listVersions(req.user!.userId, req.params.id);
  res.json({ success: true, data: { versions } });
};

export const restoreVersion = async (req: Request, res: Response) => {
  const resume = await resumeService.restoreVersion(req.user!.userId, req.params.id, req.params.versionId);
  res.json({ success: true, message: 'Resume restored', data: { resume } });
};

export const uploadResume = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const resume = await resumeService.uploadResume(req.user!.userId, req.file, req.body.title);
  res.status(201).json({ success: true, message: 'Resume uploaded and parsed', data: { resume } });
};

export const extractResume = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const data = await resumeService.extractAndParse(req.user!.userId, req.file);
  res.json({ success: true, data });
};

export const optimizeResume = async (req: Request, res: Response) => {
  const { jobDescription } = req.body;
  if (!jobDescription) return res.status(400).json({ success: false, message: 'Job description is required' });

  const result = await resumeService.optimizeResume(req.user!.userId, req.params.id, jobDescription);
  res.json({ success: true, data: result });
};
