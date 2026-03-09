import { Request, Response } from 'express';
import { ResumeService } from '../services/resume.service';
import { asyncHandler } from '../middleware/error';
import { cacheInvalidations } from '../services/cache-invalidation.service';

const resumeService = new ResumeService();

export const listResumes = asyncHandler(async (req: Request, res: Response) => {
  const result = await resumeService.listResumes(req.user!.userId, req.query as any);
  res.json({ success: true, data: result });
});

export const createResume = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.createResume(req.user!.userId, req.body);
  res.status(201).json({ success: true, message: 'Resume created', data: { resume } });
});

export const getResume = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.getResumeById(req.user!.userId, req.params.id);
  res.json({ success: true, data: { resume } });
});

export const updateResume = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.updateResume(req.user!.userId, req.params.id, req.body);
  // Invalidate cache after update
  await cacheInvalidations.afterResumeUpdate(req.params.id);
  res.json({ success: true, message: 'Resume updated', data: { resume } });
});

export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  await resumeService.deleteResume(req.user!.userId, req.params.id);
  // Invalidate all cached data for this resume
  await cacheInvalidations.afterResumeDelete(req.params.id);
  res.json({ success: true, message: 'Resume deleted' });
});

export const duplicateResume = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.duplicateResume(req.user!.userId, req.params.id);
  res.status(201).json({ success: true, message: 'Resume duplicated', data: { resume } });
});

export const generatePdf = asyncHandler(async (req: Request, res: Response) => {
  const result = await resumeService.generatePdf(req.user!.userId, req.params.id);
  res.json({ success: true, data: result });
});

export const listVersions = asyncHandler(async (req: Request, res: Response) => {
  const versions = await resumeService.listVersions(req.user!.userId, req.params.id);
  res.json({ success: true, data: { versions } });
});

export const restoreVersion = asyncHandler(async (req: Request, res: Response) => {
  const resume = await resumeService.restoreVersion(req.user!.userId, req.params.id, req.params.versionId);
  // Invalidate cache after restore
  await cacheInvalidations.afterResumeUpdate(req.params.id);
  res.json({ success: true, message: 'Resume restored', data: { resume } });
});

export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const resume = await resumeService.uploadResume(req.user!.userId, req.file, req.body.title);
  res.status(201).json({ success: true, message: 'Resume uploaded and parsed', data: { resume } });
});

export const extractResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const data = await resumeService.extractAndParse(req.user!.userId, req.file);
  res.json({ success: true, data });
});

export const optimizeResume = asyncHandler(async (req: Request, res: Response) => {
  const { jobDescription } = req.body;
  if (!jobDescription) return res.status(400).json({ success: false, message: 'Job description is required' });

  const result = await resumeService.optimizeResume(req.user!.userId, req.params.id, jobDescription);
  res.json({ success: true, data: result });
});

