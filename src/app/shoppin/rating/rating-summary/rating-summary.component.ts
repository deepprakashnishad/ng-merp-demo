import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Rating } from '../rating';

@Component({
  selector: 'app-rating-summary',
  templateUrl: './rating-summary.component.html',
  styleUrls: ['./rating-summary.component.scss']
})
export class RatingSummaryComponent implements OnInit {

  @Input("totalRatingCount") totalRatingCount: number=0;
  @Input("totalReviewCount") totalReviewCount: number=0;
  @Input("netRating") netRating: number=0;
  @Input("ratings") ratings: Array<Rating> = [];
  @Input("recipientId") recipientId: string;
  @Input("recipientType") recipientType: string;
  @Input("allowRating") allowRating: boolean = true;
  @Output("rated") rated: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['ratings'] && changes.ratings?.currentValue?.length>0){
      this.ratings = changes['ratings']['currentValue'];
      this.totalRatingCount = this.ratings.length;
      this.totalReviewCount = this.ratings.filter(ele=>ele.comment.length>0).length;
      this.netRating = this.ratings.reduce((r, { stars }) => r + stars, 0) / this.ratings.length;
    }
  }

  ratingDone(event){
  }

}
