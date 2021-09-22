import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { ProductSelectorComponent } from '../../product/product-selector/product-selector.component';
import { CreateEditSectionComponent } from './create-edit-section/create-edit-section.component';
import { Section } from './section';
import { SectionService } from './section.service';

@Component({
  selector: 'app-section-editor',
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss']
})
export class SectionEditorComponent implements OnInit {

  sectionList: Array<Section> = [];
  displayedColumns: string[] = ['title', 'text', 'type', 'backgroundColor', 'status', "select", 'action'];
  dataSource: MatTableDataSource<Section>;

  constructor(
    private sectionService: SectionService,
    private notifier: NotifierService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.sectionService.getSections().subscribe(result=>{
      this.sectionList = result;
      this.sectionList = this.sectionList.map(ele=>{
        ele['safeHtmlText'] = this.sanitizer.bypassSecurityTrustHtml(ele.text);
        return ele;
      });
      this.dataSource = new MatTableDataSource<Section>(this.sectionList)
    });
  }

  selectionToggle(event, section: Section){
    section.status = event.checked?"Active":"Inactive";
    delete section.safeHtmlText;
    this.sectionService.update(section).subscribe(result=>{
      this.notifier.notify("success", `${section.title} status changed to ${section.status}`);
    });
  }

  openCreateSectionDialog(){
    const ref = this.dialog.open(CreateEditSectionComponent,
      {
        height: "90%",
        width: "100vw",
        disableClose: true,
        data: {
          title: "Create Section"
        }
      }  
    );

    ref.afterClosed().subscribe(result=>{
      this.sectionList.push(result);
      this.dataSource.data = this.sectionList;
    });
  }

  openEditSectionDialog(section, index){
    const ref = this.dialog.open(CreateEditSectionComponent,
      {
        height: "90%",
        width: "100vw",
        disableClose: true,
        data: {
          title: "Edit Section",
          "section": section
        }
      }  
    );

    ref.afterClosed().subscribe(result=>{
      if(result){
        this.sectionList[index] = result;
        this.dataSource.data = this.dataSource.data;
      }
    });
  }

  openProductSelectorDialog(section, index){
    const ref = this.dialog.open(ProductSelectorComponent,
      {
        height: "90%",
        width: "100vw",
        disableClose: true,
        data: {
          title: "Select Products",
          "section": section
        }
      }  
    );

    ref.afterClosed().subscribe(result=>{
      if(result){
        this.sectionList[index].productIds = result;
        this.sectionService.updateProductIds(this.sectionList[index].id, result).subscribe(result=>{
          if(result){
            this.notifier.notify("success", "Section updated with products");
          }else{
            this.notifier.notify("error", "Failed to update section");
          }
        });
      }
    });
  }
}
