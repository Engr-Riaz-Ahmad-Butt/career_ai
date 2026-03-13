import { faker } from '@faker-js/faker';
import prisma from '../../config/database';
import { Plan, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

type UserOverrides = Partial<Omit<Prisma.UserCreateInput, 'referralCode'>>;

export const createUser = async (overrides: UserOverrides = {}) => {
  const password = await bcrypt.hash('Password123!', 10);
  const data: Prisma.UserCreateInput = {
    email: faker.internet.email(),
    password,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    plan: Plan.FREE,
    credits: 10,
    onboardingComplete: true,
    referralCode: faker.string.alphanumeric(8).toUpperCase(),
    ...overrides,
  };
  return prisma.user.create({ data });
};

export const createProUser = async (overrides: UserOverrides = {}) => {
  return createUser({
    plan: Plan.PRO,
    credits: 100,
    ...overrides,
  });
};

export const createUserWithCredits = async (credits: number, overrides: UserOverrides = {}) => {
  return createUser({
    credits,
    ...overrides,
  });
};
