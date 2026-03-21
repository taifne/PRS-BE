// src/common/constants/messages/user.messages.ts
export const UserMessages = {
    success: {
        fetched: (name?: string) =>
            name ? `User ${name} fetched successfully` : 'User fetched successfully',
        listFetched: (count?: number) =>
            count ? `${count} users fetched successfully` : 'Users fetched successfully',
        created: (name?: string) =>
            name ? `User ${name} created successfully` : 'User created successfully',
        updated: (name?: string) =>
            name ? `User ${name} updated successfully` : 'User updated successfully',
        deleted: (count?: number) =>
            count ? `${count} user(s) deleted successfully` : 'Users deleted successfully',
        roleUpdated: (name?: string) =>
            name ? `Role of user ${name} updated successfully` : 'User role updated successfully',
        passwordChanged: (name?: string) =>
            name ? `Password of user ${name} changed successfully` : 'Password changed successfully',
    },
    error: {
        notFound: (id: string) => `User with ID ${id} not found`,
        invalidIds: 'No valid user IDs provided',
        duplicateEmail: (email: string) => `Email "${email}" is already in use`,
        cannotDeleteAdmin: 'Admin users cannot be deleted',
        passwordMismatch: 'Password does not match',
        roleNotFound: (roleId: string) => `Role with ID ${roleId} not found`,
    },
};