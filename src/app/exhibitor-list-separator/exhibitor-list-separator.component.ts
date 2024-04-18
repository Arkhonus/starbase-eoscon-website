import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-exhibitor-list-separator',
  standalone: true,
  imports: [],
  template: `
  <h1 class="title_lines mb-4 text-xl font-semibold text-gray-500 dark:text-gray-400">{{label}}</h1>
  `,
  styleUrl: './exhibitor-list-separator.component.css'
})
export class ExhibitorListSeparatorComponent {
  @Input({required: true}) label!: string

  constructor() {

  }
}
