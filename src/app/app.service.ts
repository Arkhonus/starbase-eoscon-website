import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { NavbarComponent } from './navbar/navbar.component';
import { Lot } from './objects/lot';
import { BehaviorSubject } from 'rxjs';
import { Exhibitor } from './objects/exhibitor';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  navbarComponent?: NavbarComponent
  scene: THREE.Scene = new THREE.Scene
  pickables: THREE.Mesh[] = []
  exhibitors = new BehaviorSubject<Exhibitor[]>([])

  selectedLot = new BehaviorSubject<Lot | null>(null);
  selectedExhibitor = new BehaviorSubject<Exhibitor | null>(null)
  hoveredLot = new BehaviorSubject<Lot | null>(null);
  currentZone = new BehaviorSubject<number>(0);
  jumpToZone = new BehaviorSubject<number>(0);
  raycasting = new BehaviorSubject<boolean>(true);
  exhibitorsListExpanded = new BehaviorSubject<boolean>(false);
  
  gridsVisible = new BehaviorSubject<boolean>(true);

  constructor() { }
}
