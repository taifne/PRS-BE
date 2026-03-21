export const DocumentMessages = {
    success: {
        fetched: (name?: string) =>
            name ? `Document "${name}" fetched successfully` : 'Document fetched successfully',
        listFetched: (count?: number) =>
            count ? `${count} document(s) fetched successfully` : 'Documents fetched successfully',
        created: (name?: string) =>
            name ? `Document "${name}" created successfully` : 'Document created successfully',
        updated: (name?: string) =>
            name ? `Document "${name}" updated successfully` : 'Document updated successfully',
        deleted: (count?: number) =>
            count ? `${count} document(s) deleted successfully` : 'Documents deleted successfully',
    },
    error: {
        notFound: (id?: string) =>
            id ? `Document with ID "${id}" not found` : 'Document not found',
        alreadyExists: (name?: string) =>
            name ? `Document "${name}" already exists` : 'Document already exists',
    },
};