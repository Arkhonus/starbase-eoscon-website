import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Exhibitor } from '../objects/exhibitor';
import { AppService } from '../app.service';

@Component({
  selector: 'app-exhibitor-card',
  standalone: true,
  imports: [],
  templateUrl: './exhibitor-card.component.html',
  styleUrl: './exhibitor-card.component.css'
})
export class ExhibitorCardComponent implements AfterViewInit{
  @Input({required: true}) exhibitor!: Exhibitor

  appService: AppService

  @ViewChild('exhibitorLogo') exhibitorLogoElement!: ElementRef<HTMLImageElement>
  @ViewChild('exhibitorName') exhibitorNameElement!: ElementRef<HTMLHeadingElement>
  @ViewChild('exhibitorDesc') exhibitorDescElement!: ElementRef<HTMLParagraphElement>

  constructor(appService: AppService){
    this.appService = appService;
  }

  ngAfterViewInit(): void {
    // Renders a bit differently if the display name is the same as the short name
    this.exhibitorNameElement.nativeElement.innerHTML = this.exhibitor.detailedName
    this.exhibitorDescElement.nativeElement.innerHTML = `${this.exhibitor.description}`;

    if (this.exhibitor.logo != ""){
      //this.exhibitorLogoElement.nativeElement.classList.remove("hidden");
      this.exhibitorLogoElement.nativeElement.src = this.exhibitor.logo
    }
    else {
      //this.exhibitorLogoElement.nativeElement.classList.add("hidden");
      //this.exhibitorLogoElement.nativeElement.src = ""
    }
  }

  selectExhibitor(){
    this.appService.selectedExhibitor.next(this.exhibitor)
  }
}
