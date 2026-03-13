import { faker } from '@faker-js/faker';
import prisma from '../../config/database';
import { ResumeStatus, Prisma } from '@prisma/client';

type ResumeOverrides = Partial<Prisma.ResumeCreateInput>;

export const createResume = async (userId: string, overrides: ResumeOverrides = {}) => {
  const data: Prisma.ResumeCreateInput = {
    user: { connect: { id: userId } },
    title: faker.person.jobTitle() + ' Resume',
    template: 'modern',
    status: ResumeStatus.DRAFT,
    version: 1,
    ...overrides,
  };
  return prisma.resume.create({ data });
};

export const createResumeWithContent = async (userId: string, overrides: ResumeOverrides = {}) => {
  return createResume(userId, {
    status: ResumeStatus.COMPLETE,
    summary: faker.lorem.paragraph(),
    experience: [
      {
        company: faker.company.name(),
        position: faker.person.jobTitle(),
        startDate: '2020-01-01',
        description: faker.lorem.sentence(),
      },
    ],
    skills: {
      technical: [faker.lorem.word(), faker.lorem.word()],
      soft: ['Communication', 'Leadership'],
    },
    ...overrides,
  });
};
