import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Exhibitor } from '../objects/exhibitor';

@Component({
  selector: 'app-exhibitor-card',
  standalone: true,
  imports: [],
  templateUrl: './exhibitor-card.component.html',
  styleUrl: './exhibitor-card.component.css'
})
export class ExhibitorCardComponent implements AfterViewInit{
  @Input({required: true}) exhibitor!: Exhibitor

  @ViewChild('exhibitorLogo') exhibitorLogoElement!: ElementRef<HTMLImageElement>
  @ViewChild('exhibitorName') exhibitorNameElement!: ElementRef<HTMLHeadingElement>
  @ViewChild('exhibitorDesc') exhibitorDescElement!: ElementRef<HTMLParagraphElement>

  constructor(){

  }

  ngAfterViewInit(): void {
    // Renders a bit differently if the display name is the same as the short name
    if (this.exhibitor.displayName == this.exhibitor.shortName){
      this.exhibitorNameElement.nativeElement.innerHTML = `${this.exhibitor.displayName}`;
    }
    else {
      this.exhibitorNameElement.nativeElement.innerHTML = `${this.exhibitor.displayName} (${this.exhibitor.shortName})`;
    }

    this.exhibitorDescElement.nativeElement.innerHTML = `${this.exhibitor.description}`;
  }
}
