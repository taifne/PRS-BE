// src/common/constants/messages/role.messages.ts
export const RoleMessages = {
    success: {
        fetched: (name?: string) =>
            name ? `Role ${name} fetched successfully` : 'Role fetched successfully',
        listFetched: (count?: number) =>
            count ? `${count} roles fetched successfully` : 'Roles fetched successfully',
        created: (name?: string) =>
            name ? `Role ${name} created successfully` : 'Role created successfully',
        updated: (name?: string) =>
            name ? `Role ${name} updated successfully` : 'Role updated successfully',
        deleted: (count?: number) =>
            count ? `${count} role(s) deleted successfully` : 'Roles deleted successfully',
        menusUpdated: (name?: string) =>
            name ? `Menus of role ${name} updated successfully` : 'Role menus updated successfully',
    },
};