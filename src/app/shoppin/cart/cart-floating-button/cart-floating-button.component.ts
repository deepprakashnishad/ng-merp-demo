import { Component, OnInit, HostBinding, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-cart-floating-button',
  templateUrl: './cart-floating-button.component.html',
  styleUrls: ['./cart-floating-button.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1,
        transform: 'scale(1)',
      })),
      state('closed', style({
        opacity: 0,
        transform: 'scale(0)',
        height: 0,
        width: 0
      })),
      transition('open => closed', [
        animate('300ms')
      ]),
      transition('closed => open', [
        animate('300ms')
      ]),
    ]),
  ]
})
export class CartFloatingButtonComponent implements OnInit {

  isActive: boolean = false;
  @Input("isAbsolute") isAbsolute: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  toggleCart(){
    this.isActive = !this.isActive;
  }
}
