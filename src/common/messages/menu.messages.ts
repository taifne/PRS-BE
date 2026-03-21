// src/common/constants/messages/menu.messages.ts
export const MenuMessages = {
    success: {
        fetched: (name?: string) =>
            name ? `Menu ${name} fetched successfully` : 'Menu fetched successfully',
        listFetched: (count?: number) =>
            count ? `${count} menus fetched successfully` : 'Menus fetched successfully',
        created: (name?: string) =>
            name ? `Menu ${name} created successfully` : 'Menu created successfully',
        updated: (name?: string) =>
            name ? `Menu ${name} updated successfully` : 'Menu updated successfully',
        deleted: (count?: number) =>
            count ? `${count} menu(s) deleted successfully` : 'Menus deleted successfully',
    },
};