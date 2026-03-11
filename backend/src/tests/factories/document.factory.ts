import { faker } from '@faker-js/faker';
import prisma from '../../config/database';
import { DocumentType, DocumentStatus } from '@prisma/client';

export const createDocument = async (userId: string, type: DocumentType = DocumentType.COVER_LETTER, overrides: any = {}) => {
  const data = {
    userId,
    type,
    title: `${type.toLowerCase().replace('_', ' ')} for ${faker.company.name()}`,
    content: faker.lorem.paragraphs(3),
    status: DocumentStatus.DRAFT,
    ...overrides,
  };
  return prisma.document.create({ data });
};
