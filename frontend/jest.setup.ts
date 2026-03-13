import '@testing-library/jest-dom';

// Any global frontend test setup logic goes here
// For example, mocking window.matchMedia or other browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  // @ts-ignore
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    // @ts-ignore
    addListener: jest.fn(), // Deprecated
    // @ts-ignore
    removeListener: jest.fn(), // Deprecated
    // @ts-ignore
    addEventListener: jest.fn(),
    // @ts-ignore
    removeEventListener: jest.fn(),
    // @ts-ignore
    dispatchEvent: jest.fn(),
  })),
});
