import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ViewChild, ElementRef, HostBinding ,
  ChangeDetectorRef, OnDestroy, OnInit, AfterViewInit, NgZone } from '@angular/core';
import {Router, RoutesRecognized, ActivationEnd} from '@angular/router';
import { StoreService } from 'src/app/admin/store/store.service';
import { Title } from '@angular/platform-browser';
import {
  transition,
  trigger,
  query,
  style,
  animate,
  group,
  animateChild
} from '@angular/animations';
import { AuthenticationService } from '../../authentication/authentication.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('routerTransition', [
      transition('* <=> *', [    
        query(':leave,:enter', style({ position: 'fixed', opacity: 1 }), { optional: true }),
          query(':leave', [
            style({ opacity:1 }),
            animate('0ms ease-in-out', style({ opacity:0 }))], { optional: true }),
          query(':enter', [
            style({ opacity:0 }),
            animate('0.2s ease-in-out', style({ opacity:1 }))
          ], { optional: true }),
        ])
    ])

  ] // register the animations
})
export class SidenavComponent implements OnDestroy, OnInit, AfterViewInit {

  mobileQuery: MediaQueryList;

  @HostBinding('class.is-open')
  isOpen = true;

  userPermissions = sessionStorage.getItem("permissions");

  filteredRouteList = [];

  private _mobileQueryListener: () => void;
  isLoggedIn: boolean;
  title = 'Shop Admin';
  routeList = [
    { path: '/admin', title: 'Dashboard', permissions: ['SHOP_EDITOR'] },
    { path: '/admin/sale-point', title: 'Sale Point', permissions: ['CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER'] },
    {path: '/admin/my-store', title: 'My Store', permissions:['CREATE_STORE', 'UPDATE_STORE', 'DELETE_STORE']},
    { path: '/admin/store-settings', title: 'Store Settings', permissions: ['MAIN_STORE_CONTROLLER'] },
    {path: '/admin/product', title: 'Product', permissions:['CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT']},
    {path: '/admin/category', title: 'Category', permissions:['CREATE_CATEGORY', 'UPDATE_CATEGORY', 'DELETE_CATEGORY']},
    {path: '/admin/brand', title: 'Brand', permissions:['CREATE_BRAND', 'UPDATE_BRAND', 'DELETE_BRAND']},
    {path: '/admin/facet', title: 'Attributes', permissions:['CREATE_FACET', 'UPDATE_FACET', 'DELETE_FACET']},
    { path: '/admin/banner', title: 'Banner' , permissions:['MAIN_STORE_CONTROLLER']},
    { path: '/admin/create-edit-section', title: 'Section Editor', permissions:['MAIN_STORE_CONTROLLER'] },
    {path: '/admin/permission', title: 'Permissions', permissions:['CREATE_PERMISSION', 'UPDATE_PERMISSION', 'DELETE_PERMISSION']},
    { path: '/admin/role', title: 'Role', permissions:['CREATE_ROLE', 'UPDATE_ROLE', 'DELETE_ROLE'] },
    {path: '/admin/user-report', title: "User Report", permissions:['SHOP_EDITOR']},
    {path: '/admin/person', title: 'Users', permissions:['CREATE_PERSON', 'UPDATE_PERSON', 'DELETE_PERSON']},
    {path: '/admin/static-pages', title: 'Static Page', permissions:['MAIN_STORE_CONTROLLER']},
    {path: '/admin/delivery', title: 'Delivery', permissions:['SHOP_EDITOR']},
    {path: '/admin/order', title: 'Orders', permissions:['CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER']},
    {path: '/admin/pickup-point', title: 'Pickup Points', permissions:['SHOP_EDITOR']},
    {path: '/admin/activity-log', title: 'Activity Logs', permissions:['SHOP_EDITOR']},
  ];

	ngAfterViewInit() {}

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private zone: NgZone,
    private titleService: Title,
    private storeService: StoreService,
    media: MediaMatcher,
    private authenticationService: AuthenticationService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.router.events.subscribe((data) => {
        if (data instanceof RoutesRecognized) {
          this.title = data.state.root.firstChild.data.title;
          this.titleService.setTitle(this.title);
        }        
     });

    this.authenticationService.isLoggedIn.subscribe(value => {
      this.isLoggedIn = value;
    });
    this.filteredRouteList = this.routeList.filter(ele=>{
      for(var permission of ele.permissions){
        if(this.userPermissions.indexOf(permission)>-1){
          return ele;
        }
      }
      return false;
    });

    this.storeService.getMyStores().subscribe(stores=>{
      sessionStorage.setItem("store", JSON.stringify(stores[0]));
    })
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  public toggle() {
    console.log("Hello.I am in toggle");
  	this.isOpen = !this.isOpen;
  }

  logout() {
    this.isLoggedIn = false;
    this.authenticationService.logout()
  }

  login() {
    this.router.navigate(['/login']);
  }

  navigate(url){
    this.zone.run(()=>{
      this.router.navigate([url]);
    });
  }
}
