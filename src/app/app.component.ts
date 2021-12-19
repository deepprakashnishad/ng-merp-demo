import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'
import { StoreSettings } from './admin/store-settings/store-setting';
import { StoreSettingsService } from './admin/store-settings/store-settings.service';
import { SwUpdate } from '@angular/service-worker';
import { PwaService } from './pwa.service';
import { AuthenticationService } from './authentication/authentication.service';
import { StorageService } from './storage.service';
import { CategoryService } from './admin/category/category.service';
import { Category } from './admin/category/category';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shop-manager';
  isShowNavigation = true;
  pwa: PwaService;
  isLoggedIn: boolean;

  constructor(
    private router: Router,
    private storeSettingService: StoreSettingsService,
    private pwaService: PwaService,
    private authenticationService: AuthenticationService,
    private categoryService: CategoryService,
    private storageService: StorageService
  ) {
    this.pwa = this.pwaService;
  }

  ngOnInit() {

    this.authenticationService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });

    this.router.events.subscribe(
      (event: any) => {
        if (event instanceof NavigationEnd) {          
         if (this.router.url.includes('admin')) {
            this.isShowNavigation = false;
         }
         else {
          this.isShowNavigation = true;
         }
        }
      }
    );

    var refreshTimeInMillis = 15*24*60*60*1000;
    var catmap = JSON.parse(localStorage.getItem("cat-map"));
    if(catmap===null || (catmap?.timestamp+refreshTimeInMillis < new Date().getTime())){
      this.categoryService.getCategories().subscribe((categories: Array<Category>)=>{
        var tempMap = {};
        for(var category of categories){
          tempMap[category.id] = category.title;
        }
        localStorage.setItem("cat-map", JSON.stringify({"timestamp": new Date().getTime(), "catMap": tempMap}));
      });
    }

    if (sessionStorage.getItem("storeSettings") === null) {
      this.storeSettingService.getStoreSettings().subscribe(result => {
        var mStoreSettings = StoreSettings.fromJSON(result);
        this.storageService.store("storeSettings", mStoreSettings);
      });
    }
  }

  installPwa(): void {
    this.pwaService.promptEvent.prompt();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
