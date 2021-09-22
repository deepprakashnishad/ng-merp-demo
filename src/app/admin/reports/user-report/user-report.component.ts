import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Person } from "../../../person/person";
import { PersonService } from "../../../person/person.service";

@Component({
  templateUrl: "user-report.component.html",
  styleUrls: ["./user-report.component.scss"]
})
export class UserReportComponent implements AfterViewInit {

  persons: Array<Person> = [];

  displayedColumns: Array<string> = ["name", "mobile", "email"];
  dataSource: MatTableDataSource<Person>;

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private personService: PersonService
  ) {
    this.personService.getTotalCustomers().subscribe(result => {
      this.resultsLength = result;
    })

    this.dataSource = new MatTableDataSource<Person>(this.persons)
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.personService.getCustomers(this.paginator.pageSize, this.paginator.pageIndex * this.paginator.pageSize)
            .pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null || data.length===0) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          return data;
        })
    ).subscribe(data => {
      this.persons = Person.fromJSONArray(data);
      this.dataSource.data = this.persons;
    });
  }
}
