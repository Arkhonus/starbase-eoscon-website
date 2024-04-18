import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { NgIf } from '@angular/common';
import { Exhibitor } from '../objects/exhibitor';

@Component({
  selector: 'app-exhibitor-details',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './exhibitor-details.component.html',
  styleUrl: './exhibitor-details.component.css'
})
export class ExhibitorDetailsComponent implements AfterViewInit{
  @ViewChild('modal') modalElement!: ElementRef<HTMLDivElement>
  @ViewChild('exhibitorName') exhibitorNameElement!: ElementRef<HTMLElement>
  @ViewChild('exhibitorDesc') exhibitorDescElement!: ElementRef<HTMLElement>
  @ViewChild('taglineDiv') exhibitorTaglineDivElement!: ElementRef<HTMLDivElement>
  @ViewChild('exhibitorTagline') exhibitorTaglineElement!: ElementRef<HTMLElement>

  appService: AppService;
  modal?: ModalInterface
  
  modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses:
          'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
      onHide: () => {
          // console.log('modal is hidden');
      },
      onShow: () => {
          // console.log('modal is shown');
      },
      onToggle: () => {
          // console.log('modal has been toggled');
      },
  };
  
  // instance options object
  instanceOptions: InstanceOptions = {
    id: 'modalEl',
    override: true
  };

  constructor(appService: AppService){
    this.appService = appService;

    this.appService.selectedExhibitor.subscribe((exhibitor) => {
      if (exhibitor != null){
        this.exhibitorNameElement.nativeElement.innerHTML = exhibitor.detailedName

        if (exhibitor.description == ""){
          this.exhibitorDescElement.nativeElement.innerHTML = "This exhibitor has not provided a description."
        }
        else {
          this.exhibitorDescElement.nativeElement.innerHTML = exhibitor.description
        }


        if (exhibitor.tagline == ""){
          this.exhibitorTaglineDivElement.nativeElement.classList.add("hidden")
          // this.exhibitorTaglineDivElement.nativeElement.classList.remove("inline-block")

          this.exhibitorTaglineElement.nativeElement.innerHTML = ""
        }
        else {
          this.exhibitorTaglineDivElement.nativeElement.classList.remove("hidden")
          // this.exhibitorTaglineDivElement.nativeElement.classList.add("inline-block")

          this.exhibitorTaglineElement.nativeElement.innerHTML = exhibitor.tagline
        }

        this.showModal();
      }
      else {
        this.modal?.hide();
      }
    })
  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.modalElement.nativeElement, this.modalOptions, this.instanceOptions);
  }

  showModal(){
    this.modal?.show()
  }

  hideModal(){
    this.appService.selectedExhibitor.next(null)
  }
}
