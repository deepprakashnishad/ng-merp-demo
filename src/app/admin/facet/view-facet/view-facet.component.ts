import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Facet } from './../facet';
import { FacetService } from './../facet.service';
import { AddEditFacetComponent } from './../add-edit-facet/add-edit-facet.component';

@Component({
  selector: 'app-view-facet',
  templateUrl: './view-facet.component.html',
  styleUrls: ['./view-facet.component.scss']
})
export class ViewFacetComponent implements OnInit {

	@Input() facets: Array<Facet>;
	@Input() isEditPermitted: boolean = false;

	filterStr:string = '';

  constructor(
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    private facetService: FacetService
  ) { }

  ngOnInit() {
  }

  openAddEditFacetDialog(facet){
  	const dialogRef = this.dialog.open(AddEditFacetComponent, {
      data: {
        facet: facet
      }
    });

  	dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  deleteFacet(facet){
    const index = this.facets.indexOf(facet);
    this.facetService.deleteFacet(facet.id)
    .subscribe(facet=>{
      this.facets.splice(index, 1);
      this.openSnackBar('Facet deleted successfully', 'Dismiss');
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }
}
