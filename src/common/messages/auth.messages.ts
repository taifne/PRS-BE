export const AuthMessages = {
    success: {
        loggedIn: (name?: string) =>
            name ? `User ${name} logged in successfully` : 'Logged in successfully',
        loggedOut: 'Logged out successfully',
        tokenRefreshed: 'Token refreshed successfully',
        getMe: 'Fetch Profile successfully'
    },
    error: {
        unauthorized: 'You are not authorized to perform this action',
        invalidCredentials: 'Invalid username or password',
        tokenExpired: 'Authentication token has expired',
        tokenInvalid: 'Invalid authentication token',
    },
};