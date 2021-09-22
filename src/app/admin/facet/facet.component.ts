import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddEditFacetComponent } from './add-edit-facet/add-edit-facet.component';
import { AuthenticationService } from './../../authentication/authentication.service';
import { FacetService } from './facet.service';
import { Facet } from './facet';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.scss']
})
export class FacetComponent implements OnInit {

	facets: Array<Facet>
  isEditPermitted: boolean = false;
  isAddPermitted: boolean = false;

  constructor(
  	private facetService: FacetService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
  	this.facetService.getFacets()
  	.subscribe((facets)=>{
  		this.facets = facets;
  	});

    this.isAddPermitted = this.authenticationService
      .authorizeUser(['CREATE_FACET']);
    this.isEditPermitted = this.authenticationService
      .authorizeUser(['UPDATE_FACET', 'DELETE_FACET']);
  }

  openAddEditFacetDialog(facet){
    const dialogRef = this.dialog.open(AddEditFacetComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.facets.push(result.facet);
        this.snackBar.open(
          result.msg, "Dismiss", {
          duration: 5000
        });
      }
    });
  }
}
