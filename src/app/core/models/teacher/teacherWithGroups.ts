export interface teacherWithGroups {
  id: string;
  fullName: string;
  groups: {
    id: number;
    name: string;
  }[];
}
