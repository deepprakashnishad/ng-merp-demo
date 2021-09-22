import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { Page } from '../admin/static-page/page';
import { StaticPageService } from '../admin/static-page/static-page.service';

@Component({
  selector: 'app-static-page',
  templateUrl: './static-page.component.html',
  styleUrls: ['./static-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StaticPageComponent implements OnInit {

  page$: Observable<Page>;
  page: Page = new Page();
  html: SafeHtml;

  constructor(
    private route: ActivatedRoute,
    private pageService: StaticPageService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.page$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
      this.pageService.getPageByQuery({'routeName': params.get('routeName')}))
    );

    this.page$.subscribe((page)=>{
      this.page = page;
      this.html = this.sanitizer.bypassSecurityTrustHtml(this.page.htmlText);
    });
  }

}
