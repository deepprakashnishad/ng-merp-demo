import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Section } from 'src/app/admin/shoppin/section-editor/section';
import { SectionService } from 'src/app/admin/shoppin/section-editor/section.service';
import { Banner } from '../../admin/banner/banner';
import { BannerService } from '../../admin/banner/banner.service';

import SwiperCore, { EffectFlip, Pagination, Navigation, Autoplay, Swiper } from "swiper/core";

// install Swiper modules
SwiperCore.use([EffectFlip, Pagination, Navigation, Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

	banners: Array<Banner> = [];
  sections: Array<Section> = [];
  //swiper = new Swiper('.swiper-container', {
  //  speed: 1000,
  //  direction: 'horizontal',
  //  slidesPerView: 1,
  //  navigation:
  //  {
  //    nextEl: '.swiper-button-next',
  //    prevEl: '.swiper-button-prev',
  //  },
  //  pagination:
  //  {
  //    el: '.swiper-pagination',
  //    dynamicBullets: true,
  //  },
  //  keyboard:
  //  {
  //    enabled: true,
  //    onlyInViewport: false,
  //  },
  //  mousewheel:
  //  {
  //    invert: true,
  //  },
  //  loop: true,
  //  autoplay: {
  //    delay: 2000,
  //    disableOnInteraction: false,
  //  },
  //});

	routeList = [
	    {path: '/admin/product', title: 'Product', permissions:[]},
	    {path: '/admin/category', title: 'Category'},
	    {path: '/admin/brand', title: 'Brand'},
	    {path: '/admin/facet', title: 'Attributes'},
	    // {path: '/admin/inventory', title: 'Inventory'},
	    {path: '/permission', title: 'Permissions'},
	    {path: '/role', title: 'Role'},
	    {path: '/person', title: 'Users'},
	    // {path: '/admin/price', title: 'Price'},
	    // {path: '/admin/store', title: 'Store'},
	];

  constructor(
	  private bannerService: BannerService,
	  private sectionService: SectionService
  ) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
	this.bannerService.getBanners().subscribe(result=>{
		this.banners = result;
  });

  

	this.sectionService.getSections("status=Active").subscribe(result=>{
		this.sections = result;
	});
  }

}
