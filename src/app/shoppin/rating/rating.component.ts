import { SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Rating } from './rating';
import { RatingService } from './rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input("givenTo") givenTo;
  @Input("type") type;
  @Input("ratings") ratings:Array<Rating>=[];
  options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  constructor(
    private ratingService: RatingService
  ) { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['ratings']!=null && changes['ratings']!=undefined && changes.ratings?.currentValue?.length>0){
      this.ratings = changes['ratings']['currentValue'];
      this.ratings = this.ratings.map(ele=>{
        ele.updatedAt = new Date(ele.updatedAt).toLocaleDateString("en-US", this.options);
        return ele;
    });
    }
    
  }

}
