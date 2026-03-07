import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000/api/v1'),
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

// Since this runs in the browser, we use public environment variables
const processEnv = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    // In development, we want to see this clearly
    if (process.env.NODE_ENV === 'development') {
        throw new Error('Invalid environment variables. Check console for details.');
    }
}

export const env = parsed.data || {
    NEXT_PUBLIC_API_URL: 'http://localhost:5000/api/v1',
};
