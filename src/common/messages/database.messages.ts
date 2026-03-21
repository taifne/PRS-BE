// src/common/constants/messages/database.messages.ts
export const DatabaseMessages = {
    connectionFailed: 'Database connection failed',
    duplicateKey: (key: string) => `Duplicate key error: "${key}" already exists`,
    notFound: (entity: string, id?: string) =>
        id ? `${entity} with ID ${id} not found` : `${entity} not found`,
    createFailed: (entity: string) => `Failed to create ${entity}`,
    updateFailed: (entity: string, id?: string) =>
        id ? `Failed to update ${entity} with ID ${id}` : `Failed to update ${entity}`,
    deleteFailed: (entity: string, id?: string) =>
        id ? `Failed to delete ${entity} with ID ${id}` : `Failed to delete ${entity}`,
};