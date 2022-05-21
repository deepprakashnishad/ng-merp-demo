import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../loader.service';
import { LoaderState } from '../loader';


@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent 
  implements OnInit, OnDestroy {

    @Input() loaderType: string = "bar";

	show = false;
  private subscription: Subscription;
  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked(){
    this.cdr.detectChanges();
  }

}
