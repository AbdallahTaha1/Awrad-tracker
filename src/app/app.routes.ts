import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { StudentDashboardComponent } from './student/dashboard/dashboard.component';
import { GroupListComponent } from './admin/groub/group-list/group-list.component';
import { GroupFormComponent } from './admin/groub/group-form/group-form.component';
import { AssignStudentComponent } from './admin/student-assignment/student-assignment.component';
import { AssignTeacherComponent } from './admin/assign-teacher/assign-teacher.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { LandingComponent } from './pages/landing/landing.component';
import { WerdListComponent } from './admin/werd/werd-list/werd-list.component';
import { WerdFormComponent } from './admin/werd/werd-form/werd-form.component';
import { StudentWeeklyReportComponent } from './student/student-weekly-report/student-weekly-report.component';
import { roleGuard } from './core/guards/role.guard';
import { SalahTrackerComponent } from './student/salah-tracker/salah-tracker.component';
import { AwradTrackerComponent } from './student/awrad-tracker/awrad-tracker.component';
import { ListeningWerdListComponent } from './student/listening-werd/listening-werd-list/listening-werd-list.component';
import { ListeningWerdAddComponent } from './student/listening-werd/listening-werd-add/listening-werd-add.component';
import { QuranTrackingListComponent } from './student/quran-tracking/quran-tracking-list/quran-tracking-list.component';
import { QuranTrackingFormComponent } from './student/quran-tracking/quran-tracking-form/quran-tracking-form.component';
import { ParentsWerdListComponent } from './student/parents-werd/Parents-werd-list/parents-werd-list.component';
import { ParentsWerdFormComponent } from './student/parents-werd/parents-werd-form/parents-werd-form.component';
import { TartelWerdListComponent } from './student/tartel-werd/tartel-werd-list/tartel-werd-list.component';
import { TartelWerdFormComponent } from './student/tartel-werd/tartel-werd-form/tartel-werd-form.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 👇 Student routes (guarded)
  {
    path: 'student',
    canActivate: [roleGuard],
    data: { roles: ['Student'] },
    children: [
      { path: '', component: StudentDashboardComponent },
      { path: 'weekly-report', component: StudentWeeklyReportComponent },
      { path: 'werd', component: AwradTrackerComponent },
      { path: 'salah', component: SalahTrackerComponent },

      { path: 'listening', component: ListeningWerdListComponent },
      { path: 'listening/add', component: ListeningWerdAddComponent },
      { path: 'listening/edit/:id', component: ListeningWerdAddComponent },

      { path: 'quranTracking', component: QuranTrackingListComponent },
      { path: 'quranTracking/add', component: QuranTrackingFormComponent },
      { path: 'quranTracking/edit/:id', component: QuranTrackingFormComponent },

      { path: 'parentsWerd', component: ParentsWerdListComponent },
      { path: 'parentsWerd/add', component: ParentsWerdFormComponent },
      { path: 'tartelWerd', component: TartelWerdListComponent },
      { path: 'tartelWerd/add', component: TartelWerdFormComponent },
    ],
  },

  // 👇 Teacher dashboard (guarded)
  {
    path: 'teacher',
    canActivate: [roleGuard],
    data: { roles: ['Teacher'] },
    loadComponent: () =>
      import('./teacher/teacher-dashboard.component').then(
        (m) => m.TeacherDashboardComponent
      ),
  },

  // 👇 Admin routes (guarded)
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'groups', component: GroupListComponent },
      { path: 'groups/new', component: GroupFormComponent },
      { path: 'groups/edit/:id', component: GroupFormComponent },
      { path: 'students/assign', component: AssignStudentComponent },
      { path: 'teachers/assign', component: AssignTeacherComponent },
      { path: 'werd', component: WerdListComponent },
      { path: 'werd/new', component: WerdFormComponent },
      { path: 'werd/edit/:id', component: WerdFormComponent },
    ],
  },

  // 👇 fallback unauthorized route
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent
      ),
  },
];
