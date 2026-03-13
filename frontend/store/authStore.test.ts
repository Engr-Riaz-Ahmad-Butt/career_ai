import { useAuthStore } from './authStore';

// Reset store between tests
beforeEach(() => {
    useAuthStore.getState().clearAuth();
    useAuthStore.setState({ isLoading: true });
});

describe('authStore', () => {
    describe('initial state', () => {
        it('starts unauthenticated with no token or user', () => {
            const state = useAuthStore.getState();
            expect(state.accessToken).toBeNull();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('setAccessToken', () => {
        it('sets token and marks authenticated', () => {
            useAuthStore.getState().setAccessToken('my-token');

            const state = useAuthStore.getState();
            expect(state.accessToken).toBe('my-token');
            expect(state.isAuthenticated).toBe(true);
        });

        it('setting null token marks unauthenticated', () => {
            useAuthStore.getState().setAccessToken('my-token');
            useAuthStore.getState().setAccessToken(null);

            const state = useAuthStore.getState();
            expect(state.accessToken).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('setUser', () => {
        it('sets user and marks authenticated', () => {
            const user = {
                id: 'user-1',
                email: 'test@example.com',
                credits: 10,
                plan: 'FREE' as const,
            };

            useAuthStore.getState().setUser(user);

            const state = useAuthStore.getState();
            expect(state.user).toEqual(user);
            expect(state.isAuthenticated).toBe(true);
        });

        it('setting null user marks unauthenticated', () => {
            useAuthStore.getState().setUser({
                id: 'user-1',
                email: 'test@example.com',
                credits: 10,
                plan: 'FREE',
            });

            useAuthStore.getState().setUser(null);

            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('updateCredits', () => {
        it('adds credits when amount is positive', () => {
            useAuthStore.getState().setUser({
                id: 'user-1',
                email: 'test@example.com',
                credits: 10,
                plan: 'FREE',
            });

            useAuthStore.getState().updateCredits(5);

            expect(useAuthStore.getState().user?.credits).toBe(15);
        });

        it('deducts credits when amount is negative', () => {
            useAuthStore.getState().setUser({
                id: 'user-1',
                email: 'test@example.com',
                credits: 10,
                plan: 'FREE',
            });

            useAuthStore.getState().updateCredits(-3);

            expect(useAuthStore.getState().user?.credits).toBe(7);
        });

        it('does nothing when user is null', () => {
            // Should not throw
            expect(() => useAuthStore.getState().updateCredits(10)).not.toThrow();
            expect(useAuthStore.getState().user).toBeNull();
        });
    });

    describe('clearAuth', () => {
        it('resets all auth state', () => {
            useAuthStore.getState().setAccessToken('token');
            useAuthStore.getState().setUser({
                id: 'user-1',
                email: 'test@example.com',
                credits: 10,
                plan: 'PRO',
            });

            useAuthStore.getState().clearAuth();

            const state = useAuthStore.getState();
            expect(state.accessToken).toBeNull();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
        });
    });

    describe('setIsLoading', () => {
        it('updates loading state', () => {
            useAuthStore.getState().setIsLoading(false);
            expect(useAuthStore.getState().isLoading).toBe(false);

            useAuthStore.getState().setIsLoading(true);
            expect(useAuthStore.getState().isLoading).toBe(true);
        });
    });
});
