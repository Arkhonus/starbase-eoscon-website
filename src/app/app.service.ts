import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { NavbarComponent } from './navbar/navbar.component';
import { Lot } from './objects/lot';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  navbarComponent?: NavbarComponent
  scene: THREE.Scene = new THREE.Scene
  pickables: THREE.Mesh[] = []

  selectedLot = new BehaviorSubject<Lot | null>(null)
  jumpToZone = new BehaviorSubject<number>(0)

  constructor() { }
}
