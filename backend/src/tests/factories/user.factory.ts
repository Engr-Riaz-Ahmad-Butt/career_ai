import { faker } from '@faker-js/faker';
import prisma from '../../config/database';
import { Plan } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const createUser = async (overrides: any = {}) => {
  const password = await bcrypt.hash('Password123!', 10);
  const data = {
    email: faker.internet.email(),
    password,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    plan: Plan.FREE,
    credits: 10,
    onboardingComplete: true,
    ...overrides,
  };
  return prisma.user.create({ data });
};

export const createProUser = async (overrides: any = {}) => {
  return createUser({
    plan: Plan.PRO,
    credits: 100,
    ...overrides,
  });
};

export const createUserWithCredits = async (credits: number, overrides: any = {}) => {
  return createUser({
    credits,
    ...overrides,
  });
};
