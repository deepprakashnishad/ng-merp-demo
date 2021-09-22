import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { Section } from '../section';
import { SectionService } from '../section.service';

@Component({
  selector: 'app-create-edit-section',
  templateUrl: './create-edit-section.component.html',
  styleUrls: ['./create-edit-section.component.scss']
})
export class CreateEditSectionComponent implements OnInit {

  title: string = "Create Section";
  section: Section = new Section();
  uploadPath: string;

  constructor(
    public dialogRef: MatDialogRef<CreateEditSectionComponent>,
    private sectionService: SectionService,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.title = this.data.title;

    if(this.title.indexOf("Create")===-1 && this.data.section){
      this.section = this.data.section;
      this.uploadPath = `categories/${this.section.id}`;
    }
  }

  saveSection(){
    if(this.section.id){
      this.sectionService.update(this.section).subscribe(result=>{
        this.notifier.notify("success", "Section updated successfully");
        this.dialogRef.close(this.section);
      }, (err)=>{
        this.notifier.notify("error", "Failed to submit section");
      });
    }else{
      this.sectionService.add(this.section).subscribe(result=>{
        this.section.id  = result['id'];
        this.notifier.notify("success", "Section created successfully");
        this.dialogRef.close(this.section);
      });
    }
  }

  uploadCompleted($event){
    this.section.imgs = $event;
  }
}
