import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Collapse } from 'flowbite';
import type { CollapseOptions, CollapseInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { AppService } from '../app.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit{
  @ViewChild('navbar') navbarElement!: ElementRef<HTMLElement>
  appService: AppService
  
  constructor(appService: AppService){
    this.appService = appService
    
    appService.navbarComponent = this
  }
  
  ngAfterViewInit(): void {
    // set the target element that will be collapsed or expanded (eg. navbar menu)
    const $targetEl = document.getElementById('targetEl');
    
    // optionally set a trigger element (eg. a button, hamburger icon)
    const $triggerEl = document.getElementById('triggerEl');
    
    // optional options with default values and callback functions
    const options = {
      onCollapse: () => {
        console.log('element has been collapsed');
      },
      onExpand: () => {
        console.log('element has been expanded');
      },
      onToggle: () => {
        console.log('element has been toggled');
      },
    };
    
    const instanceOptions = {
      id: 'targetEl',
      override: true
    };

    const collapse = new Collapse(
      $targetEl, 
      $triggerEl, 
      options, 
      instanceOptions
      );
  }
  
}
