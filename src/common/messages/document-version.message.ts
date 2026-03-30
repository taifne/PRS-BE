export const DocumentVersionMessages = {
    success: {
        fetched: (name?: string) =>
            name ? `Document Version "${name}" fetched successfully` : 'Document Versionfetched successfully',
        listFetched: (count?: number) =>
            count ? `${count} document(s) Version fetched successfully` : 'Documents Version fetched successfully',
        created: (name?: string) =>
            name ? `Document Version "${name}" created successfully` : 'Document Version created successfully',
        updated: (name?: string) =>
            name ? `Document Version "${name}" updated successfully` : 'Document Version updated successfully',
        deleted: (count?: number) =>
            count ? `${count} document(s) deleted successfully` : 'Documents Version deleted successfully',
    },
    error: {
        notFound: (id?: string) =>
            id ? `Document with ID "${id}" not found` : 'Document not found',
        alreadyExists: (name?: string) =>
            name ? `Document "${name}" already exists` : 'Document already exists',
    },
};