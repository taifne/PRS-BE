export const Messages = {
  success: {
    user: {
      fetched: (name?: string) =>
        name
          ? `User "${name}" fetched successfully`
          : 'User fetched successfully',
      listFetched: (count?: number) =>
        count
          ? `${count} users fetched successfully`
          : 'Users fetched successfully',
      created: (name?: string) =>
        name
          ? `User "${name}" created successfully`
          : 'User created successfully',
      updated: (name?: string) =>
        name
          ? `User "${name}" updated successfully`
          : 'User updated successfully',
      deleted: (count?: number) =>
        count
          ? `${count} user(s) deleted successfully`
          : 'Users deleted successfully',
      roleUpdated: (name?: string) =>
        name
          ? `Role of user "${name}" updated successfully`
          : 'User role updated successfully',
      passwordChanged: (name?: string) =>
        name
          ? `Password of user "${name}" changed successfully`
          : 'Password changed successfully',
    },
    role: {
      fetched: (name?: string) =>
        name
          ? `Role "${name}" fetched successfully`
          : 'Role fetched successfully',
      listFetched: (count?: number) =>
        count
          ? `${count} roles fetched successfully`
          : 'Roles fetched successfully',
      created: (name?: string) =>
        name
          ? `Role "${name}" created successfully`
          : 'Role created successfully',
      updated: (name?: string) =>
        name
          ? `Role "${name}" updated successfully`
          : 'Role updated successfully',
      deleted: (count?: number) =>
        count
          ? `${count} role(s) deleted successfully`
          : 'Roles deleted successfully',
      menusUpdated: (name?: string) =>
        name
          ? `Menus of role "${name}" updated successfully`
          : 'Role menus updated successfully',
    },
    menu: {
      fetched: (name?: string) =>
        name
          ? `Menu "${name}" fetched successfully`
          : 'Menu fetched successfully',
      listFetched: (count?: number) =>
        count
          ? `${count} menus fetched successfully`
          : 'Menus fetched successfully',
      created: (name?: string) =>
        name
          ? `Menu "${name}" created successfully`
          : 'Menu created successfully',
      updated: (name?: string) =>
        name
          ? `Menu "${name}" updated successfully`
          : 'Menu updated successfully',
      deleted: (count?: number) =>
        count
          ? `${count} menu(s) deleted successfully`
          : 'Menus deleted successfully',
    },

    auth: {
      loggedIn: (name?: string) =>
        name
          ? `User "${name}" logged in successfully`
          : 'Logged in successfully',
      loggedOut: 'Logged out successfully',
      tokenRefreshed: 'Token refreshed successfully',
    },
    system: {
      operationCompleted: 'Operation completed successfully',
    },
  },

  error: {
    user: {
      notFound: (id: string) => `User with ID ${id} not found`,
      invalidIds: 'No valid user IDs provided',
      duplicateEmail: (email: string) => `Email "${email}" is already in use`,
      cannotDeleteAdmin: 'Admin users cannot be deleted',
      passwordMismatch: 'Password does not match',
      roleNotFound: (roleId: string) => `Role with ID ${roleId} not found`,
    },
    auth: {
      unauthorized: 'You are not authorized to perform this action',
      invalidCredentials: 'Invalid username or password',
      tokenExpired: 'Authentication token has expired',
      tokenInvalid: 'Invalid authentication token',
    },
    system: {
      internal: 'Internal server error',
      timeout: 'Request timed out, please try again',
      dependencyFailed: 'A dependent service failed, please try again',
    },
    validation: {
      required: (field: string) => `"${field}" is required`,
      invalidFormat: (field: string) => `"${field}" has invalid format`,
      minLength: (field: string, min: number) =>
        `"${field}" must be at least ${min} characters`,
      maxLength: (field: string, max: number) =>
        `"${field}" must be at most ${max} characters`,
      valueNotAllowed: (field: string, value: any) =>
        `"${field}" value "${value}" is not allowed`,
    },
    database: {
      connectionFailed: 'Database connection failed',
      duplicateKey: (key: string) =>
        `Duplicate key error: "${key}" already exists`,
    },
  },
};
