import { Component, ElementRef, EnvironmentInjector, Input, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { AppService } from '../app.service';
import { Drawer } from 'flowbite';
import { Exhibitor } from '../objects/exhibitor';
import { ExhibitorCardComponent } from '../exhibitor-card/exhibitor-card.component';
import { ExhibitorListSeparatorComponent } from '../exhibitor-list-separator/exhibitor-list-separator.component';

@Component({
  selector: 'app-exhibitors-list',
  standalone: true,
  imports: [ ExhibitorListSeparatorComponent ],
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
  renderer2: Renderer2
  drawer?: Drawer;

  constructor(appService: AppService, injector: EnvironmentInjector, renderer2: Renderer2){
    this.appService = appService;
    this.envInjector = injector;
    this.renderer2 = renderer2;

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

  // Populates the list
  initExhibitors(exhibitors: Exhibitor[]){
    let prevFirstLetter: string = ""
    exhibitors.forEach((exhibitor) => {
      let firstLetter = exhibitor.displayName.substring(0,1).toUpperCase()

      // Instantiates a header
      if (firstLetter != prevFirstLetter){
        let heading = this.exhibitorsListElement.createComponent(ExhibitorListSeparatorComponent, {environmentInjector: this.envInjector})
        heading.setInput("label", firstLetter)
      }

      let exhibitorCard = this.exhibitorsListElement.createComponent(ExhibitorCardComponent, {environmentInjector: this.envInjector})
      exhibitorCard.setInput("exhibitor", exhibitor)

      prevFirstLetter = firstLetter
    })
  }

}
