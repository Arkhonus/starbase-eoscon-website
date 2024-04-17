import { Component, ElementRef, EnvironmentInjector, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { AppService } from '../app.service';
import { Drawer } from 'flowbite';
import { Exhibitor } from '../objects/exhibitor';
import { ExhibitorCardComponent } from '../exhibitor-card/exhibitor-card.component';

@Component({
  selector: 'app-exhibitors-list',
  standalone: true,
  imports: [],
  templateUrl: './exhibitors-list.component.html',
  styleUrl: './exhibitors-list.component.css'
})
export class ExhibitorsListComponent {
  @ViewChild('exhibitorsList', {read: ViewContainerRef}) exhibitorsListElement!: ViewContainerRef
  @ViewChild('exhibitorsListDiv') exhibitorsListDiv!: ElementRef<HTMLDivElement>
  @ViewChild('drawer') drawerElement!: ElementRef<HTMLDivElement>
  @Input('expand') expand!: boolean;

  envInjector: EnvironmentInjector

  appService: AppService;
  drawer?: Drawer;

  constructor(appService: AppService, injector: EnvironmentInjector){
    this.appService = appService;
    this.envInjector = injector

    this.appService.exhibitorsListExpanded.subscribe((expand) => {
      if (expand) this.drawer?.show()
      else this.drawer?.hide()
    })
    this.appService.exhibitors.subscribe((exhibitors) => {
      this.initExhibitors(exhibitors)
    })
  }

  ngAfterViewInit(): void {
    // options with default values
    const options = {
      placement: 'top',
      backdrop: false,
      bodyScrolling: false,
      edge: false,
      edgeOffset: '',
      onHide: () => {
          // console.log('drawer is hidden');
      },
      onShow: () => {
          // console.log('drawer is shown');
      },
      onToggle: () => {
          // console.log('drawer has been toggled');
      },
    };
    
    // instance options object
    const instanceOptions = {
      id: 'drawer-js-example',
      override: true
    };
    this.drawer = new Drawer(this.drawerElement.nativeElement, options, instanceOptions);
    this.drawer.hide()

    // this.exhibitorsListDiv.nativeElement.style.setProperty("column-fill", "auto");
  }

  


  hoveredOverComponent(notHovering: boolean){
    this.appService.raycasting.next(notHovering);
  }

  initExhibitors(exhibitors: Exhibitor[]){
    exhibitors.forEach((exhibitor) => {
      let exhibitorCard = this.exhibitorsListElement.createComponent(ExhibitorCardComponent, {environmentInjector: this.envInjector})
      exhibitorCard.setInput("exhibitor", exhibitor)
    })
  }

}
