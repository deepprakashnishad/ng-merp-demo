import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ViewChild, ElementRef, HostBinding ,
  ChangeDetectorRef, OnDestroy, OnInit, AfterViewInit, NgZone } from '@angular/core';
import {Router, RoutesRecognized, ActivationEnd} from '@angular/router';
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

  private _mobileQueryListener: () => void;
  isLoggedIn: boolean;
  title = 'Shop Admin';
  routeList = [
    { path: '/admin', title: 'Dashboard', permissions: [] },
    { path: '/admin/sale-point', title: 'Sale Point', permissions: ['CREATE_ORDER', 'UPDATE_ORDER', 'DELETE_ORDER'] },
    {path: '/admin/my-store', title: 'My Store', permissions:[]},
    { path: '/admin/store-settings', title: 'Store Settings', permissions: [] },
    {path: '/admin/product', title: 'Product', permissions:[]},
    {path: '/admin/category', title: 'Category'},
    {path: '/admin/brand', title: 'Brand'},
    {path: '/admin/facet', title: 'Attributes'},
    { path: '/admin/banner', title: 'Banner' },
    { path: '/admin/create-edit-section', title: 'Section Editor' },
    {path: '/admin/permission', title: 'Permissions'},
    { path: '/admin/role', title: 'Role' },
    {path: '/admin/user-report', title: "User Report"},
    {path: '/admin/person', title: 'Users'},
    {path: '/admin/static-pages', title: 'Static Page'},
    {path: '/admin/delivery', title: 'Delivery'},
    {path: '/admin/order', title: 'Orders'},
    {path: '/admin/pickup-point', title: 'Pickup Points'},
    {path: '/admin/activity-log', title: 'Activity Logs'},
  ];

	ngAfterViewInit() {}

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private zone: NgZone,
    private titleService: Title,
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
