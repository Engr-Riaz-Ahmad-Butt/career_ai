import { faker } from '@faker-js/faker';
import prisma from '../../config/database';
import { ResumeStatus } from '@prisma/client';

export const createResume = async (userId: string, overrides: any = {}) => {
  const data = {
    userId,
    title: faker.person.jobTitle() + ' Resume',
    template: 'modern',
    status: ResumeStatus.DRAFT,
    ...overrides,
  };
  return prisma.resume.create({ data });
};

export const createResumeWithContent = async (userId: string, overrides: any = {}) => {
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
