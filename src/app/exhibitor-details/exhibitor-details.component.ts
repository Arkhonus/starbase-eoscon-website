import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Drawer } from 'flowbite';
import { Exhibitor } from '../objects/exhibitor';

@Component({
  selector: 'app-exhibitor-details',
  standalone: true,
  imports: [],
  templateUrl: './exhibitor-details.component.html',
  styleUrl: './exhibitor-details.component.css'
})
export class ExhibitorDetailsComponent implements AfterViewInit{

  appService: AppService;

  constructor(appService: AppService){
    this.appService = appService;
  }

  ngAfterViewInit(): void {
  }
}
