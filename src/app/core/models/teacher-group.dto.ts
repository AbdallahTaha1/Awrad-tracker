export interface TeacherGroupDto {
  groupId: number;
  groupName: string;
  students: {
    id: number;
    fullName: string;
    email: string;
  }[];
}
