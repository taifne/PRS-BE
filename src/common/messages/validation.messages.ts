export const ValidationMessages = {
    required: (field: string) => `"${field}" is required`,
    invalid: (field: string) => `"${field}" invalid`,
    invalidFormat: (field: string) => `"${field}" has invalid format`,
    minLength: (field: string, min: number) =>
        `"${field}" must be at least ${min} characters`,
    maxLength: (field: string, max: number) =>
        `"${field}" must be at most ${max} characters`,
    valueNotAllowed: (field: string, value: any) =>
        `"${field}" value "${value}" is not allowed`,
};