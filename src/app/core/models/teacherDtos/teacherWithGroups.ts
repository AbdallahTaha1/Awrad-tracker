import { GroupDto } from '../groupDtos/Group.Dto';

export interface teacherWithGroups {
  id: string;
  fullName: string;
  groups: GroupDto[];
}
