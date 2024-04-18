import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Lot } from '../objects/lot';

@Component({
  selector: 'app-current-lot-display',
  standalone: true,
  imports: [],
  templateUrl: './current-lot-display.component.html',
  styleUrl: './current-lot-display.component.css'
})
export class CurrentLotDisplayComponent {
  @ViewChild('container') containerElement!: ElementRef<HTMLDivElement>
  @ViewChild('currentSegment') segmentElement!: ElementRef<HTMLHeadingElement>
  @ViewChild('currentLot') lotElement!: ElementRef<HTMLHeadingElement>

  appService: AppService;
  currentHoveredLot: Lot | null = null;

  constructor(appService: AppService){
    this.appService = appService;

    this.appService.currentZone.subscribe((currentZone) => {
      this.onZoneChange(currentZone);
    });

    this.appService.hoveredLot.subscribe((hoveredLot) => {
      this.onLotHovered(hoveredLot);
    });
  }

  onLotHovered(hoveredLot: Lot | null){
    this.currentHoveredLot = hoveredLot
    if (hoveredLot == null){
      this.lotElement.nativeElement.classList.add("hidden")
      this.onZoneChange(this.appService.currentZone.getValue())
    }
    else{
      this.lotElement.nativeElement.classList.remove("hidden")

      // Enabled lots can show their lot ID
      if (hoveredLot.enabled){
        this.lotElement.nativeElement.innerHTML = hoveredLot.conLotID!
      }
      else {
        if (hoveredLot.originalShop){
          this.lotElement.nativeElement.innerHTML = hoveredLot.conLotID!
        }
        else if (hoveredLot.exhibitor.length != 0){
          this.lotElement.nativeElement.innerHTML = "Reserve Lot"
        }
        else {
          this.lotElement.nativeElement.innerHTML = "Unused Lot"
        }
      }
    }

    if (this.currentHoveredLot != null) {
      this.segmentElement.nativeElement.innerHTML = this.getZoneHeader(this.currentHoveredLot.zone)
    }
  }

  onZoneChange(currentZone: number){
    if (this.currentHoveredLot == null){
      this.segmentElement.nativeElement.innerHTML = this.getZoneHeader(currentZone)
    }
  }

  getZoneHeader(zone: number): string{
    let temp: string
    if (zone == 0){
      temp = "Gate Shops"
    }
    else {
      temp = `Segment ${zone}`
    }

    return temp;
  }
}
