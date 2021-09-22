import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateRatingComponent } from '../create-rating/create-rating.component';
import { Rating } from '../rating';
import { RatingService } from '../rating.service';

@Component({
  selector: 'app-rating-button',
  templateUrl: './rating-button.component.html',
  styleUrls: ['./rating-button.component.scss']
})
export class RatingButtonComponent implements OnInit {

  @Input("recipientId") recipientId: string;
  @Input("recipientType") recipientType: string;
  @Output("rated") rated: EventEmitter<any> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private ratingService: RatingService,
  ) { }

  ngOnInit() {
  }

  openAddEditRatingDialog(){
    const dialogRef = this.dialog.open(
      CreateRatingComponent, 
      {data: {"recipientId": this.recipientId, "recipientType": this.recipientType}}
    );

    dialogRef.afterClosed().subscribe((result) => {
      this.rated.emit(result);
    });
  }

}
