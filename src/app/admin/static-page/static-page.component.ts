import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Page } from './page';
import { StaticPageService } from './static-page.service';

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss']
})
export class StaticPageComponent implements OnInit {

  page: Page = new Page();
  pages: Array<Page> = [];
  pageForm: FormGroup;

  constructor(
    private pageService: StaticPageService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.pageForm = this.fb.group({
      pageTitle: ['', Validators.required],
      routename: ['', Validators.required],
      isActive: '',
    });

    this.pageService.getPages().subscribe(result=>{
      this.pages = Page.toJson(result);
    });
  }

  newPage(){
    this.page.id = undefined;
    this.page.status = false;
  }

  selectedPageChanged(event){
    this.pageService.getPageByQuery({'id': event.value.id}).subscribe(result=>{
      this.page = result;
      this.pageForm.get("isActive").setValue(this.page.status);
    });
  }

  save(){
    this.page.status = this.pageForm.get("isActive").value;
    if(this.page.id){
      this.pageService.updatePage(this.page).subscribe((result)=>{
        this.notifier.notify("success", result['msg']);
      });
    }else{
      this.pageService.addPage(this.page).subscribe((result)=>{
        this.notifier.notify("success", result['msg']);
      });
    }
  }

  delete(){
    if(this.page.id){
      this.pageService.deletePage(this.page.id).subscribe(result=>{
        this.notifier.notify("success", result['msg']);
        for(var i=0;i<this.pages.length;i++){
          if(this.page.id === this.pages[i].id){
            this.pages.splice(i, 1);
            this.page = new Page();
          }
        }
      });
    }
  }

}
