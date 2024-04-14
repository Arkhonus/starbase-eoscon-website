import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Lot } from '../objects/lot';
import { Drawer } from 'flowbite';

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
  @ViewChild('exhibitorsList') exhibitorsListElement!: ElementRef<HTMLElement>

  appService: AppService
  renderer2: Renderer2
  expanded: boolean = false
  drawer?: Drawer

  currentLot : Lot | null = null

  constructor(appService: AppService, renderer2: Renderer2){
    this.appService = appService
    this.renderer2 = renderer2

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

  updateDetails(lot: Lot | null){
    this.currentLot = lot

    if (lot == null){
      this.drawer?.hide()
    }
    else {
      this.drawer?.show()

      this.lotIdElement.nativeElement.innerHTML = "Lot " + lot.lotID

      if (lot.exhibitor.length == 0){
        this.exhibitorNumberElement.nativeElement.innerHTML = "No exhibitors here"
      }
      else if (lot.exhibitor.length == 1){
        this.exhibitorNumberElement.nativeElement.innerHTML = "Exhibitor here"
      }
      else {
        this.exhibitorNumberElement.nativeElement.innerHTML = "Exhibitors here"
      }

      // Removes all children
      this.exhibitorsListElement.nativeElement.innerHTML = ""

      let listItems: string = ""
      if (lot.exhibitor.length == 0){
        listItems = ""
      }
      else {
        lot.exhibitor.forEach((exhibitor) => {
          let temp: HTMLElement = this.renderer2.createElement('li');

          // Renders a bit differently if the display name is the same as the short name
          if (exhibitor.displayName == exhibitor.shortName){
            temp.innerHTML = `${exhibitor.displayName}`;
          }
          else {
            temp.innerHTML = `${exhibitor.displayName} (${exhibitor.shortName})`;
          }
          temp.className = "text-base text-gray-500 dark:text-gray-400"

          this.renderer2.appendChild(this.exhibitorsListElement.nativeElement, temp);
        })
      }
    }
  }
}
