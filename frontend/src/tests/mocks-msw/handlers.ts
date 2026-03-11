import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example handler: Mocking a login request
  http.post('*/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      },
      accessToken: 'mock-access-token',
    });
  }),

  // Add more handlers as needed for other API endpoints
];
