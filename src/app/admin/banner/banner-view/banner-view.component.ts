import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Banner } from '../banner';
import { BannerService } from '../banner.service';

@Component({
  selector: 'app-banner-view',
  templateUrl: './banner-view.component.html',
  styleUrls: ['./banner-view.component.scss']
})
export class BannerViewComponent implements OnInit {

  @Input() banner: Banner;
  @Output() imageSelected: EventEmitter<Banner> = new EventEmitter();

  constructor(
    private bannerService: BannerService
  ) { }

  ngOnInit() {
  }

  imageClicked(){
    this.imageSelected.emit(this.banner);
  }

}
