export const ROUTES = {
  ADMINISTRATION: {
    ROOT: 'administration',
    USER: 'users',
    AUTH: 'auth',
    ROLE: 'roles',
    MENU: 'menus',
  },
  INVENTORY: {
    ROOT: 'inventory',
    SUPPLIER: 'suppliers',
    MEDICINE: 'medicines',
    CATEGORY: 'categories',
    ORDER: 'orders',
    ORDER_DETAIL: 'order-details',
  },
  HR: {
     ROOT: 'hr',
    PUNCH: 'punches',
  },
  RESUME: {
    ROOT: 'resume',
     RESUME: 'template',
  },
  EDUCATION: {
    ROOT: 'el-builder',
    VOCABULARY: 'vocabularies',
    QUIZ: 'quizzes',
  },
} as const;
