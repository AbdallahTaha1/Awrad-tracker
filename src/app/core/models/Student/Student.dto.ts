export interface StudentDto {
  id: string;
  fullName: string;
  email: string;
  groupId?: number | null;
  groupName?: string | null;
}
