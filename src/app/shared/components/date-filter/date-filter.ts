import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateRange } from '../../model/dateRange';

@Component({
  selector: 'date-filter',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './date-filter.html',
  styleUrl: './date-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateFilter implements OnInit {
  @Input() defaultStart: Date | null = null;
  @Input() defaultEnd: Date | null = null;
  @Output() onChange = new EventEmitter<DateRange>();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor() {
    this.range.valueChanges.subscribe(value => {
      this.onChange.emit({ start: value.start ?? undefined, end: value.end ?? undefined });
    });
  }

  ngOnInit(): void {
    if (this.defaultStart || this.defaultEnd) {
      this.range.setValue({ start: this.defaultStart, end: this.defaultEnd }, { emitEvent: false });
    }
    const { start, end } = this.range.value;
    this.onChange.emit({ start: start ?? undefined, end: end ?? undefined });
  }
}
