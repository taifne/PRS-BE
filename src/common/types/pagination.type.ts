// pagination.type.ts
export interface Meta {
  page: number;
  limit: number;
  total: number;
}

export interface Paginated<T> {
  success: boolean;
  message: string;
  meta: Meta;
  items: T[];
}
