import { Request, Response } from 'express';
import { ResumeService } from '../services/resume.service';
import { asyncHandler } from '../middleware/error';
import { cacheInvalidations } from '../services/cache-invalidation.service';

const resumeService = new ResumeService();

// Helper: Extract list options from query
function extractListOptions(query: Record<string, unknown>) {
  return {
    page: typeof query.page === 'string' ? parseInt(query.page, 10) : undefined,
    limit: typeof query.limit === 'string' ? parseInt(query.limit, 10) : undefined,
    sortBy: typeof query.sortBy === 'string' ? query.sortBy : undefined,
    order: typeof query.order === 'string' ? query.order : undefined,
  };
}

// GET /resumes
export const listResumes = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const options = extractListOptions(req.query);
  const result = await resumeService.listResumes(req.user.userId, options);

  res.json({ success: true, data: result });
});

// POST /resumes
export const createResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const resume = await resumeService.createResume(req.user.userId, req.body);

  res.status(201).json({ success: true, message: 'Resume created', data: { resume } });
});

// GET /resumes/:id
export const getResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const resume = await resumeService.getResumeById(req.user.userId, req.params.id);

  res.json({ success: true, data: { resume } });
});

// PUT /resumes/:id
export const updateResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const resume = await resumeService.updateResume(req.user.userId, req.params.id, req.body);
  await cacheInvalidations.afterResumeUpdate(req.params.id);

  res.json({ success: true, message: 'Resume updated', data: { resume } });
});

// DELETE /resumes/:id
export const deleteResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  await resumeService.deleteResume(req.user.userId, req.params.id);
  await cacheInvalidations.afterResumeDelete(req.params.id);

  res.json({ success: true, message: 'Resume deleted' });
});

// POST /resumes/:id/duplicate
export const duplicateResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const resume = await resumeService.duplicateResume(req.user.userId, req.params.id);

  res.status(201).json({ success: true, message: 'Resume duplicated', data: { resume } });
});

// GET /resumes/:id/pdf
export const generatePdf = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const result = await resumeService.generatePdf(req.user.userId, req.params.id);

  res.json({ success: true, data: result });
});

// GET /resumes/:id/versions
export const listVersions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const versions = await resumeService.listVersions(req.user.userId, req.params.id);

  res.json({ success: true, data: { versions } });
});

// POST /resumes/:id/restore/:versionId
export const restoreVersion = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const resume = await resumeService.restoreVersion(
    req.user.userId,
    req.params.id,
    req.params.versionId
  );
  await cacheInvalidations.afterResumeUpdate(req.params.id);

  res.json({ success: true, message: 'Resume restored', data: { resume } });
});

// POST /resumes/upload
export const uploadResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');
  if (!req.file) throw new Error('No file uploaded');

  const resume = await resumeService.uploadResume(req.user.userId, req.file, req.body.title);

  res.status(201).json({ success: true, message: 'Resume uploaded and parsed', data: { resume } });
});

// POST /resumes/extract
export const extractResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');
  if (!req.file) throw new Error('No file uploaded');

  const data = await resumeService.extractAndParse(req.user.userId, req.file);

  res.json({ success: true, data });
});

// POST /resumes/:id/optimize
export const optimizeResume = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user?.userId) throw new Error('Unauthorized');

  const { jobDescription } = req.body;
  if (!jobDescription) throw new Error('Job description is required');

  const result = await resumeService.optimizeResume(
    req.user.userId,
    req.params.id,
    jobDescription
  );

  res.json({ success: true, data: result });
});

