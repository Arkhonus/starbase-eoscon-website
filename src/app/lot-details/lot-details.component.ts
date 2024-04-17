import { AfterViewInit, Component, ElementRef, EnvironmentInjector, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { AppService } from '../app.service';
import { Lot } from '../objects/lot';
import { Drawer } from 'flowbite';
import { createComponent } from '@angular/core';
import { ExhibitorCardComponent } from '../exhibitor-card/exhibitor-card.component';

@Component({
  selector: 'app-lot-details',
  standalone: true,
  imports: [],
  templateUrl: './lot-details.component.html',
  styleUrl: './lot-details.component.css'
})
export class LotDetailsComponent implements AfterViewInit {
  @ViewChild('drawer') drawerElement!: ElementRef<HTMLDivElement>
  @ViewChild('lotID') lotIdElement!: ElementRef<HTMLElement>
  @ViewChild('exhibitorsHere') exhibitorNumberElement!: ElementRef<HTMLElement>
  @ViewChild('exhibitorsList', {read: ViewContainerRef}) exhibitorsListElement!: ViewContainerRef

  appService: AppService
  renderer2: Renderer2
  expanded: boolean = false
  drawer?: Drawer

  envInjector: EnvironmentInjector

  exhibitorCards: ExhibitorCardComponent[] = []

  currentLot : Lot | null = null

  constructor(appService: AppService, renderer2: Renderer2, injector: EnvironmentInjector){
    this.appService = appService
    this.renderer2 = renderer2
    this.envInjector = injector

  }

  ngAfterViewInit(): void {
    // options with default values
    const options = {
        placement: 'right',
        backdrop: false,
        bodyScrolling: false,
        edge: false,
        edgeOffset: '',
        onHide: () => {
            //console.log('drawer is hidden');
        },
        onShow: () => {
            //console.log('drawer is shown');
        },
        onToggle: () => {
            //console.log('drawer has been toggled');
        },
    };
    
    // instance options object
    const instanceOptions = {
      id: 'drawer-js-example',
      override: true
    };
    this.drawer = new Drawer(this.drawerElement.nativeElement, options, instanceOptions);

    this.appService.selectedLot.subscribe((lot) => this.updateDetails(lot))
    
  }

  hoveredOverComponent(notHovering: boolean){
    this.appService.raycasting.next(notHovering);
  }

  updateDetails(lot: Lot | null){
    this.currentLot = lot

    if (lot == null){
      this.drawer?.hide()
    }
    else {
      this.drawer?.show()

      this.lotIdElement.nativeElement.innerHTML = "Lot " + lot.lotID

      if (lot.exhibitor.length == 0){
        this.exhibitorNumberElement.nativeElement.removeAttribute("hidden")
        this.exhibitorNumberElement.nativeElement.innerHTML = "No exhibitors here"
      }
      else {
        this.exhibitorNumberElement.nativeElement.setAttribute("hidden", "")
      }

      // Removes all children
      this.exhibitorsListElement.clear()

      let listItems: string = ""
      if (lot.exhibitor.length == 0){
        listItems = ""
      }
      else {
        lot.exhibitor.forEach((exhibitor) => {
          let exhibitorCard = this.exhibitorsListElement.createComponent(ExhibitorCardComponent, {environmentInjector: this.envInjector})
          exhibitorCard.setInput("exhibitor", exhibitor)
        })
      }
    }
  }
}
