import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rating } from '../rating';
import { RatingService } from '../rating.service';

@Component({
  selector: 'app-create-rating',
  templateUrl: './create-rating.component.html',
  styleUrls: ['./create-rating.component.scss']
})
export class CreateRatingComponent implements OnInit {

	rating: Rating= new Rating();

  constructor(
    private fb: FormBuilder,
  	public dialogRef: MatDialogRef<CreateRatingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ratingService: RatingService
  ) { }

  ngOnInit() {    
  	if(this.data && this.data.rating){
  		
  	}else{
  		this.rating.recipientId = this.data['recipientId'];
		this.rating.recipientType = this.data['recipientType'];
  	}
  }

  save(rating){
  	if(rating.id === undefined || rating.id === null){
  		this.ratingService.add(rating)
  		.subscribe((rating)=>{
  			this.dialogRef.close({rating, msg: `Rating submitted successfully`});
  		});
  	}else{
  		this.ratingService.update(rating)
  		.subscribe((rating)=>{
  			this.dialogRef.close({rating, msg: `Rating submitted successfully`});
  		});
  	}
  }
}
