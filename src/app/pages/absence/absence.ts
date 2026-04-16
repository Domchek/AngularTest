import { Component, signal, WritableSignal } from '@angular/core';
import { FeedAbsence } from '../../shared/model/feedAbsence';
import { AbsenceData } from '../../shared/model/absenceData';
import { Router } from '@angular/router';
import { Api } from '../../core/api';
import { AppButton } from '../../shared/components/app-button/app-button';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { Pagination } from '../../shared/components/pagination/pagination';
import { DateFilter } from '../../shared/components/date-filter/date-filter';
import { DateRange } from '../../shared/model/dateRange';

@Component({
  selector: 'app-absence',
  imports: [AppButton, PageHeader, Pagination, DateFilter],
  templateUrl: './absence.html',
  styleUrls: ['./absence.css', '../../shared/styles/table.css'],
})
export class Absence {
  public absences: AbsenceData[] = [];
  public filteredAbsences: FeedAbsence[] = [];
  public displayedAbsences: WritableSignal<FeedAbsence[]> = signal([]);
  public limit: number;
  public offset: number;
  public loading: WritableSignal<boolean> = signal(true);
  public leftPage: WritableSignal<boolean> = signal(false);
  public rightPage: WritableSignal<boolean> = signal(true);
  public openAddUserModal: WritableSignal<boolean> = signal(false);
  public openAddAbsenceModal: WritableSignal<boolean> = signal(false);
  public dateFilterStart: WritableSignal<Date> = signal(new Date(Date.now() - 604800000));
  public dateFilterEnd: WritableSignal<Date> = signal(new Date());

  private setFeed(absences: AbsenceData[]) {
    this.offset = 0;
    this.filteredAbsences = absences.map(e => {
      const result: FeedAbsence = {
        id: e.Id,
        fullName: `${e.FirstName} ${e.MiddleName ?? ""} ${e.LastName}`,
        info: e.AbsenceDefinitionName
      };
      return result;
    });

    this.leftPage.set(false);
    this.rightPage.set(this.filteredAbsences.length > this.limit);
    this.displayedAbsences.set(this.filteredAbsences.slice(this.offset, this.offset + this.limit));
  }

  private isValidDate(d?: Date | null): d is Date {
    return d instanceof Date && !isNaN(d.getTime());
  }

  constructor(private readonly api: Api, private router: Router) {
    this.offset = 0;
    this.limit = 50;
    this.loading.set(true);

    this.api.getAbsences(this.dateFilterStart(), this.dateFilterEnd()).then(absences => {
      this.absences = absences;
      this.setFeed(absences);
    }).catch(err => console.error(err)).finally(() => this.loading.set(false));
  }

  filterByDate(range: DateRange) {
    const { start, end } = range;
    if (!this.isValidDate(start) || !this.isValidDate(end)) return;
    if (start > end) return;
    this.dateFilterStart.set(start);
    this.dateFilterEnd.set(end);

    this.loading.set(true);
    this.api.getAbsences(start, end).then(absences => {
      this.absences = absences;
      this.setFeed(absences);
    }).catch(err => console.error(err)).finally(() => this.loading.set(false));
  }

  refreshButton() {
    this.offset = 0;
    this.limit = 50;
    this.loading.set(true);

    this.filteredAbsences = [];
    this.displayedAbsences.set([]);
    this.api.getAbsences(this.dateFilterStart(), this.dateFilterEnd()).then(absences => {
      this.absences = absences;
      this.setFeed(absences);
    }).catch(err => console.error(err)).finally(() => this.loading.set(false));
  }

  onGoBackClick() {
    this.router.navigate(['/users']);
  }

  onPageChange(direction: boolean) {
    if (direction && !this.rightPage()) return;
    if (!direction && !this.leftPage()) return;

    this.offset = this.offset + (direction ? 1 : -1) * this.limit;

    this.rightPage.set(this.offset + this.limit <= this.filteredAbsences.length);

    this.leftPage.set(this.offset - this.limit >= 0);

    this.displayedAbsences.set(this.filteredAbsences.slice(this.offset, this.offset + this.limit));
  }
}
