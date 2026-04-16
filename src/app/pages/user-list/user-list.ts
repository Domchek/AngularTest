import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { User } from '../../shared/model/user';
import { Api } from '../../core/api';
import { AppButton } from '../../shared/components/app-button/app-button';
import { FeedUser } from '../../shared/model/feedUser';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { Router } from '@angular/router';
import { SearchInput } from '../../shared/components/search-input/search-input';
import { ButtonGrid } from '../../shared/components/button-grid/button-grid';
import { Pagination } from '../../shared/components/pagination/pagination';
import { Modal } from '../../shared/components/modal/modal';
import { ButtonAction } from '../../shared/model/buttonAction';
import { email, form, required, submit } from '@angular/forms/signals';
import { AddUser } from '../../shared/model/addUser';
import { AppInput } from '../../shared/components/input/input';
import { FeedAbsenceDefinitionData } from '../../shared/model/feedAbsenceDefinitionData';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateFilter } from '../../shared/components/date-filter/date-filter';
import { DateRange } from '../../shared/model/dateRange';
import { Alert } from '../../shared/components/alert/alert';

@Component({
  selector: 'app-user-list',
  imports: [AppButton, PageHeader, SearchInput, ButtonGrid, Pagination, Modal, AppInput, DateFilter, Alert, MatInputModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css', '../../shared/styles/table.css'],
})

export class UserList {
  public users: User[] = [];
  public filteredUsers: FeedUser[] = [];
  public displayedUsers: WritableSignal<FeedUser[]> = signal([]);
  public limit: number;
  public offset: number;
  public actions: ButtonAction[];
  public absenceCorrect: WritableSignal<boolean> = signal(false);
  public loading: WritableSignal<boolean> = signal(true);
  public leftPage: WritableSignal<boolean> = signal(false);
  public rightPage: WritableSignal<boolean> = signal(true);
  public openAddUserModal: WritableSignal<boolean> = signal(false);
  public openAddAbsenceModal: WritableSignal<boolean> = signal(false);
  public absences: WritableSignal<FeedAbsenceDefinitionData[]> = signal([]);
  public currentUser: WritableSignal<string | null> = signal(null);
  public currentAbsence: WritableSignal<FeedAbsenceDefinitionData | null> = signal(null);
  public abs: WritableSignal<string | null> = signal(null);
  public dateAbsenceStart: WritableSignal<Date | null> = signal(null);
  public dateAbsenceEnd: WritableSignal<Date | null> = signal(null);
  public absenceError: WritableSignal<string | null> = signal(null);
  public absenceSubmitting: WritableSignal<boolean> = signal(false);

  private scoreSearch(field: string, word: string): number {
    if (!field || !word) return 0;
    if (field === word) return 4;
    if (field.startsWith(word)) return 2;
    if (field.includes(word)) return 1;
    return 0;
  }
  private setFeed(users: User[], value?: string) {
    console.log(value);
    this.offset = 0;
    this.filteredUsers = users.map(e => {
      const result: FeedUser = {
        id: e.Id,
        email: e.Email,
        firstName: e.FirstName,
        lastName: e.LastName,
        fullName: e.FullName,
        sortBySearch: 0
      };
      return result;
    });

    if (value?.trim()) {
      const words = value.trim().toLocaleLowerCase().split(/\s+/);

      this.filteredUsers = this.filteredUsers.map(user => {
        const first = user.firstName?.toLocaleLowerCase() ?? '';
        const last = user.lastName?.toLocaleLowerCase() ?? '';

        let total = 0;
        for (const word of words)
          total += Math.max(this.scoreSearch(first, word), this.scoreSearch(last, word));

        user.sortBySearch = total;
        return user;
      }).filter(u => u.sortBySearch > 0).sort((a, b) => b.sortBySearch - a.sortBySearch);
    }

    this.leftPage.set(false);
    this.rightPage.set(this.filteredUsers.length > this.limit);
    this.displayedUsers.set(this.filteredUsers.slice(this.offset, this.offset + this.limit));
  }

  constructor(private readonly api: Api, private router: Router) {
    this.offset = 0;
    this.limit = 50;
    this.actions = [{
      name: "absence", icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.06152 12C5.55362 8.05369 8.92001 5 12.9996 5C17.4179 5 20.9996 8.58172 20.9996 13C20.9996 17.4183 17.4179 21 12.9996 21H8M13 13V9M11 3H15M3 15H8M5 18H10" stroke="#e4cd49" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>` }];
    this.loading.set(true);

    this.api.getUsers().then(users => {
      this.users = users;
      this.setFeed(users);
    }).catch(err => console.error(err));

    this.api.getUserAbsenceDefinitions().then(absences => this.absences.set(
      absences.filter(e => e.IsActive).map(e => ({
        id: e.Id,
        name: e.Name,
        iconId: e.IconId,
        createdOn: e.CreatedOn,
        code: e.Code,
        categoryDefinitionName: e.CategoryDefinitionName
      }))
    )).catch(err => console.error(err));

    setTimeout(() => this.loading.set(false), 1500);
  }

  search(value: string) {
    this.setFeed(this.users, value);
  }

  onAbsenceClick() {
    this.router.navigate(['/absence']);
  }

  addUser() {
    this.openAddUserModal.set(true);
  }

  onPageChange(direction: boolean) {
    if (direction && !this.rightPage()) return;
    if (!direction && !this.leftPage()) return;

    this.offset = this.offset + (direction ? 1 : -1) * this.limit;

    this.rightPage.set(this.offset + this.limit <= this.filteredUsers.length);

    this.leftPage.set(this.offset - this.limit >= 0);

    this.displayedUsers.set(this.filteredUsers.slice(this.offset, this.offset + this.limit));
  }

  actionClick(name: string, id: string) {
    switch (name) {
      case "absence":
        this.currentUser.set(id);
        this.openAddAbsenceModal.set(true);
        break;
    }
  }

  loginModel = signal<AddUser>({ firstName: '', lastName: '', email: '' });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.firstName, { message: 'First name is required' });
    required(fieldPath.lastName, { message: 'Last name is required' });
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Email is invalid' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      const data = this.loginModel();
      try {
        await this.api.createUser(data);
        this.openAddUserModal.set(false);
        location.reload();
      } catch (err) {
        console.error(err);
      }
      return undefined;
    });
  }

  public absenceFormFilled: Signal<boolean> = computed(() => {
    const absence = this.currentAbsence();
    const start = this.dateAbsenceStart();
    const end = this.dateAbsenceEnd();

    if (!absence) return false;
    if (!this.isValidDate(start)) return false;
    if (!this.isValidDate(end)) return false;
    if (start > end) return false;
    return true;
  });

  private isValidDate(d?: Date | null): d is Date {
    return d instanceof Date && !isNaN(d.getTime());
  }

  addAbsenceType(e: MatSelectChange<FeedAbsenceDefinitionData>) {
    this.currentAbsence.set(e.value);
  }

  addAbsenceDates(range: DateRange) {
    const { start, end } = range;
    this.dateAbsenceStart.set(this.isValidDate(start) ? start : null);
    this.dateAbsenceEnd.set(this.isValidDate(end) ? end : null);
    this.absenceCorrect.set(
      this.isValidDate(start) && this.isValidDate(end) && start <= end
    );
  }

  async addUserAbsence() {
    const user = this.currentUser();
    const absence = this.currentAbsence();
    const start = this.dateAbsenceStart();
    const end = this.dateAbsenceEnd();
    if (!user || !absence) return;

    const days: Date[] = [];
    if (this.isValidDate(start) && this.isValidDate(end)) {
      const cursor = this.stripTime(start);
      const last = this.stripTime(end);
      while (cursor.getTime() <= last.getTime()) {
        days.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
      }
    } else
      return;

    this.absenceError.set(null);
    this.absenceSubmitting.set(true);
    try {
      for (const day of days)
        await this.api.createUserAbsence(user, absence.id, day);

      this.closeAbsenceModal();
    } catch (err) {
      console.error(err);
      this.absenceError.set(err instanceof Error ? err.message : 'Failed to add absence');
    } finally {
      this.absenceSubmitting.set(false);
    }
  }

  private stripTime(d: Date): Date {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  closeAbsenceModal() {
    this.currentUser.set(null);
    this.currentAbsence.set(null);
    this.dateAbsenceStart.set(null);
    this.dateAbsenceEnd.set(null);
    this.absenceError.set(null);
    this.openAddAbsenceModal.set(false);
  }
}
