import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WarpGate } from "../objects/area"
import { Lot } from "../objects/lot"
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer'
import Stats from 'three/examples/jsm/libs/stats.module'
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-area-display',
  standalone: true,
  imports: [  ],
  templateUrl: './area-display.component.html',
  styleUrl: './area-display.component.css'
})

export class AreaDisplayComponent implements AfterViewInit{
  @ViewChild('areaDisplay') areaDisplay!: ElementRef<HTMLCanvasElement>
  @ViewChild('labelsDisplay') labelsDiv!: ElementRef<HTMLDivElement>
  @ViewChild('container') containerDiv!: ElementRef<HTMLDivElement>
  
  // Scene setup
  gate?: WarpGate
  renderer?: THREE.WebGLRenderer
  camera?: THREE.PerspectiveCamera
  controls?: OrbitControls
  labelRenderer?: CSS2DRenderer
  stats?: Stats
  directionalLight?: THREE.DirectionalLight
  renderer2: Renderer2
  
  doClickOnRelease: boolean = false;
  showStats: boolean = false;
  
  // Raycaster mouse picking
  intersectedObject?: THREE.Object3D | null = null
  highlightedMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0x00ff00,
  })
  
  raycaster = new THREE.Raycaster()
  intersects?: THREE.Intersection[]
  
  mouse = new THREE.Vector2()
  
  appService: AppService
  httpClient: HttpClient
  
  constructor(appService: AppService, httpClient: HttpClient, renderer2: Renderer2){
    this.appService = appService
    this.httpClient = httpClient
    this.renderer2 = renderer2
    this.appService.scene.background = new THREE.CubeTextureLoader()
    .setPath( 'assets/textures/cubeMaps/' )
    .load( [
      'right.png',
      'left.png',
      'top.png',
      'bottom.png',
      'front.png',
      'back.png'
    ] );
  }
  
  ngAfterViewInit(): void {
    let _this = this
    
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight - this.appService.navbarComponent?.navbarElement.nativeElement.offsetHeight!), 0.1, 10000)
    this.camera.position.set(0, 0, 4000)
    
    this.renderer = new THREE.WebGLRenderer({canvas: this.areaDisplay.nativeElement})
    this.renderer.setSize(window.innerWidth, window.innerHeight - this.appService.navbarComponent?.navbarElement.nativeElement.offsetHeight!)
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    let areaName = "gate"
    
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    if (areaName == "gate"){
      // Create the chosen area
      this.gate = new WarpGate(this.appService, this.httpClient, this.labelsDiv.nativeElement, "half", this.renderer2);
      this.gate.group.rotateX(2 * Math.PI/4)
      this.appService.scene.add(this.gate.group);
      
      // Light declaration
      this.setupLighting();
    }
    
    // OrbitControls settings
    this.setupControls(areaName);
    
    let currentZone: number = 0
    let prevZone: number
    
    let lotLabels: { [key: string]: CSS2DObject }
    
    if (areaName == "gate"){
      this.controls.addEventListener('change', function(){
        _this.directionalLight!.position.set(_this.camera!.position.x, 0.5, _this.camera!.position.z)
        
        currentZone = _this.getUserCurrentZone()
        
        // Updates lot labels
        _this.generateLotLabels(currentZone, prevZone, lotLabels)
        
        prevZone = currentZone
      })
    }
    
    // CSS2D Labels
    this.labelRenderer = new CSS2DRenderer({element: this.labelsDiv.nativeElement})
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight - this.appService.navbarComponent?.navbarElement.nativeElement.offsetHeight!)
    this.labelRenderer.domElement.style.pointerEvents = 'none'
    
    document.onreadystatechange = function() {
      // Initialize lots
      //_this.gate!.initLots()
    }
    
    if (this.showStats){
      // Render stats
      this.stats = new Stats()
      this.containerDiv.nativeElement.appendChild(this.stats.dom)
    }
    
    this.renderer.setAnimationLoop(this.animate.bind(this))
  }

  generateLotLabels(currentZone: number, prevZone: number, outLotLabels: { [key: string]: CSS2DObject }): void{
    // Updates lot labels
    this.gate?.lots.forEach((lot) => {
      lot.zoneVisible = (currentZone == lot.zone)
    })

    if (currentZone != prevZone){
      // Function is triggering but labels not refreshing
      // Redesign to hide labels rather than remove
      for(let label in outLotLabels){
        this.appService.scene.remove(outLotLabels[label])
        delete outLotLabels[label]
      }
      
      
      
      for(let label in outLotLabels){
        this.appService.scene.add(outLotLabels[label])
        outLotLabels[label].element.className = "text-white"
      }
      
      console.log("Now looking at zone " + currentZone)
    }
  }

  getUserCurrentZone(): number{
    const forward = new THREE.Vector3(0, 0, 1)

    // Gets signed angle of camera to determine the zone currently being looked at
    const cameraFlatPos = new THREE.Vector3(this.camera!.position.x, 0, this.camera!.position.z)
    
    const angle = this.signedAngleTo(forward, cameraFlatPos) * 180/Math.PI
    //if (angle > -22.5 && angle < 22.5) return 0
    if (angle < -22.5 && angle > -67.5) return 1
    else if (angle < -67.5 && angle > -112.5) return 2
    else if (angle < -112.5 && angle > -157.5) return 3
    else if (angle < -157.5 || angle > 157.5) return 4
    else if (angle > 112.5 && angle < 157.5) return 5
    else if (angle > 67.5 && angle < 112.5) return 6 
    else if (angle > 22.5 && angle < 67.5) return 7 

    return 0
  }
  
  setupControls(areaName: string) {
    if (areaName == "gate"){
      this.controls!.enableDamping = true;
      this.controls!.enablePan = false;
      this.controls!.maxPolarAngle = Math.PI / 3 * 2;
      this.controls!.minPolarAngle = Math.PI / 3;
      this.controls!.minDistance = 3000;
      this.controls!.maxDistance = 5000;
    }
  }
  
  prevHoveredLot?: Lot
  currentLot?: Lot

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.doClickOnRelease = false;

    let temp = this.areaDisplay.nativeElement.getBoundingClientRect().top

    this.mouse.set(
      (event.clientX / this.areaDisplay.nativeElement.clientWidth) * 2 - 1,
      -((event.clientY - temp)/ this.areaDisplay.nativeElement.clientHeight) * 2 + 1
    )

    this.raycaster.setFromCamera(this.mouse, this.camera!)
    
    if (this.gate){
      this.intersects = this.raycaster.intersectObjects(this.appService.pickables, false)
      
      if (this.intersects.length > 0) {
        this.intersectedObject = this.intersects[0].object
      } else {
        this.intersectedObject = null
      }

      if (this.intersectedObject){
        this.appService.pickables.forEach((o: THREE.Mesh, i) => {
          if (this.intersectedObject === o) {
            this.gate!.lots.forEach((lot) => {
              if (lot.lotArea == this.intersectedObject as THREE.Mesh){
                this.currentLot = lot
                if (this.prevHoveredLot != this.currentLot){
                  lot.setHovered(true)
                  this.prevHoveredLot?.setHovered(false)
                }

                this.prevHoveredLot = lot;
              }
            })
          } 
        })

      }else {
        this.prevHoveredLot?.setHovered(false)
        this.prevHoveredLot = undefined
      }
    }
  }
    
  // Mouse Events
  // Prevents dragging from triggering click events
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(){
    this.doClickOnRelease = true
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent){
    switch (event.button){
      case 0: { // Left click
        if (this.doClickOnRelease) {
          // Your select function
          if (this.intersectedObject){
            this.gate!.lots.forEach((lot) => {
              if (lot.lotArea == this.intersectedObject as THREE.Mesh){
                
                // TODO: Open details window
                this.selectLot(lot)
              }
            })
            
          }
          else {
            this.deselectLot()
          }
        };

        break;
      }
      case 1: { // Middle click

        break;
      }
      case 2: { // Right click
        this.deselectLot()
        break;
      }
    }
  }

  selectLot(lot: Lot){
    this.appService.selectedLot.next(lot)
    console.log("Selected lot " + lot.conLotID)
  }

  deselectLot(){
    this.appService.selectedLot.next(null)
    console.log("Deselected")
  }
  
  setupLighting() {
    
    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.appService.scene.add( light );
    
    this.directionalLight!.visible = false;
    
    this.directionalLight!.visible = true;
    
    this.directionalLight!.position.set(0, 0.5, 1);
    this.directionalLight!.lookAt(0, 0, 0);
    this.directionalLight!.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 2);
    
    this.appService.scene.add(this.directionalLight!);
  }
  
  getNormal(u: THREE.Vector3, v: THREE.Vector3): THREE.Vector3 {
    return new THREE.Plane().setFromCoplanarPoints(new THREE.Vector3(), u, v).normal;
  }
  
  signedAngleTo(u: THREE.Vector3, v: THREE.Vector3): number {
    // Get the signed angle between u and v, in the range [-pi, pi]
    const angle = u.angleTo(v);
    const normal = this.getNormal(u, v);
    return normal.y * angle;
  }

  // Render resize
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.camera!.aspect = window.innerWidth / (window.innerHeight - this.appService.navbarComponent?.navbarElement.nativeElement.offsetHeight!)
    this.camera!.updateProjectionMatrix()
    this.renderer!.setSize(window.innerWidth, window.innerHeight - this.appService.navbarComponent?.navbarElement.nativeElement.offsetHeight!)
    this.labelRenderer!.setSize(window.innerWidth, window.innerHeight - this.appService.navbarComponent?.navbarElement.nativeElement.offsetHeight!)
    this.render()
  }
  
  render() {
    this.labelRenderer!.render(this.appService.scene, this.camera!)
    this.renderer!.render(this.appService.scene, this.camera!)
  }
  
  animate() {   
    this.controls!.update()
    
    if (this.showStats){
      this.stats?.update()
    }
    
    this.render()
  }
}