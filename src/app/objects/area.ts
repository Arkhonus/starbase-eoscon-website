import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Lot } from "./lot"
import { Exhibitor, ExhibitorJSON } from "./exhibitor"
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { Renderer2 } from '@angular/core';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'

interface Area {
    lots: Lot[]

    initLots(): void
    loadLots(): void
    getLots() : Lot[]
}

export class WarpGate implements Area {
    lots: Lot[] = []
    lotsDictionary: Map<string, Lot> = new Map()
    group: THREE.Group = new THREE.Group();
    fillMode: string
    models?: THREE.Object3D[]
    appService: AppService
    httpClient: HttpClient
    labelsDiv: HTMLDivElement
    renderer2: Renderer2
    grids: CSS3DObject[] = []
    gridLabelMaps: Map<string, HTMLElement>[] = []

    gateMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.5,
    })

    // instantiate a loader
    loader = new FBXLoader();

    constructor (appService: AppService, httpClient: HttpClient, labelsDiv: HTMLDivElement, fillMode: string, renderer2: Renderer2){
        this.fillMode = fillMode;
        this.httpClient = httpClient;
        this.appService = appService;
        this.labelsDiv = labelsDiv;
        this.renderer2 = renderer2;
        
        this.loadLots()

        this.appService.currentZone.subscribe(() => {
            this.setGridVisibility();
        })
        this.appService.hoveredLot.subscribe((hoveredLot) => {
            this.updateGridLabelColours(hoveredLot);
        })
    }

    async loadLots(){
        let _this = this

        this.loader.setPath("assets/models/")
        this.models = await Promise.all([
            this.loader.loadAsync("area_gate/gate_shops.fbx"),
            this.loader.loadAsync("area_gate/gate_segment.fbx"),
        ])

        let gateShops = this.models[0]

        this.grids.push(_this.createGridLabels(gateShops, "full", 0))
        // Gate segment 1 has the ship shops
        gateShops.traverse(function(obj) {
            if (obj.name.substring(0,4) == "gate"){
                (obj as THREE.Mesh).material = _this.gateMaterial;
                _this.appService.pickables.push(obj as THREE.Mesh)
            }
            else if (obj.name.substring(0,4) == "shop"){
                const m = obj as THREE.Mesh
                m.geometry.computeBoundingBox()

                // Sets master lot ID
                let lotID = "Shop " + obj.name.substring(obj.name.length-3 , obj.name.length)

                // Creates lot object and pushes to array
                let lot = new Lot(lotID, 0, m, _this.labelsDiv, _this.renderer2)
                _this.appService.pickables.push(m)
                _this.lots.push(lot)
                lot.setEnabled(false)
                lot.conLotID = lot.lotID

                _this.lotsDictionary.set(lot.lotID!, lot)
                
            }
            else {
                (obj as THREE.Mesh).material = _this.gateMaterial;
            } 
        })

        this.group.add(gateShops);

        let gateSegment = this.models[1]

        for(let i = 0; i<7 ; i++){
            let segment = gateSegment.clone()
            this.grids.push(_this.createGridLabels(segment, this.fillMode, i+1))

            if (_this.fillMode == "half"){console.log("Generating gate area in half fill mode")}

            // Traverses the segment and sets materials for the meshes
            segment.traverse(function(obj) {
                // Gate material for gate meshes
                if (obj.name.substring(0,4) == "gate"){
                    const m = obj as THREE.Mesh
                    m.material = _this.gateMaterial
                    _this.appService.pickables.push(obj as THREE.Mesh)
                }
                // Lot material for lot meshes
                else if (obj.name.substring(0,3) == "lot"){
                    const m = obj as THREE.Mesh
                    m.geometry.computeBoundingBox()

                    // Sets master lot ID, con specific ID (conLotID) is different depending on fill mode
                    let lotID = `${i + 1}-` + obj.name.substring(obj.name.length-3 , obj.name.length)
                    let lotRow = lotID.substring(obj.name.length-5 , obj.name.length-4)

                    // Creates lot object and pushes to array
                    let lot = new Lot(lotID, i+1, m, _this.labelsDiv, _this.renderer2)
                    _this.appService.pickables.push(m)
                    _this.lots.push(lot)

                    // Adds to dictionary and sets conLotID depending on fill mode
                    // Half fill mode, only 4 lower rows (G, H, I, J) used and remapped to (A, B, C, D)
                    if (_this.fillMode == "half"){
                        // Reassign lot IDs
                        let lotNum = lotID.substring(obj.name.length-4 , obj.name.length-2)

                        // Lot F3 is A3 in half mode
                        if (lotID.substring(obj.name.length-5 , obj.name.length-2) == "F03"){
                            lot.conLotID = `${i + 1}-` + "A03"
                        }
                        else if (lotRow == "G"){
                            lot.conLotID = `${i + 1}-` + "A" + lotNum
                        }
                        else if (lotRow == "H"){
                            lot.conLotID = `${i + 1}-` + "B" + lotNum
                        }
                        else if (lotRow == "I"){
                            lot.conLotID = `${i + 1}-` + "C" + lotNum
                        }
                        else if (lotRow == "J"){
                            lot.conLotID = `${i + 1}-` + "D" + lotID.substring(obj.name.length-4 , obj.name.length-2)
                        }
                        // All other lots become overflow lots, remapping (A, B, C, D, E, F) to (E, F, G, H, I, J)
                        else if (lotRow == "A"){
                            lot.conLotID = `${i + 1}-` + "E" + lotID.substring(obj.name.length-4 , obj.name.length-2)
                            lot.setEnabled(false)
                        }
                        else if (lotRow == "B"){
                            lot.conLotID = `${i + 1}-` + "F" + lotID.substring(obj.name.length-4 , obj.name.length-2)
                            lot.setEnabled(false)
                        }
                        else if (lotRow == "C"){
                            lot.conLotID = `${i + 1}-` + "G" + lotID.substring(obj.name.length-4 , obj.name.length-2)
                            lot.setEnabled(false)
                        }
                        else if (lotRow == "D"){
                            lot.conLotID = `${i + 1}-` + "H" + lotID.substring(obj.name.length-4 , obj.name.length-2)
                            lot.setEnabled(false)
                        }
                        else if (lotRow == "E"){
                            lot.conLotID = `${i + 1}-` + "I" + lotID.substring(obj.name.length-4 , obj.name.length-2)
                            lot.setEnabled(false)
                        }
                        else if (lotRow == "F"){
                            lot.conLotID = `${i + 1}-` + "J" + lotID.substring(obj.name.length-4 , obj.name.length-2)
                            lot.setEnabled(false)
                        }
                        _this.lotsDictionary.set(lot.conLotID!, lot)
                    }
                    // Full mode, default on invalid input
                    else{
                        if (_this.fillMode != "full"){
                            console.log("Unrecognized fill mode, defaulting to full")
                        }
    
                        lot.conLotID = lot.lotID
                        _this.lotsDictionary.set(lot.conLotID!, lot)
                    }
                }
                // Unrecognized meshes get the gate material
                else {
                    (obj as THREE.Mesh).material = _this.gateMaterial
                } 
            })

            // Rotates the mesh to form each side of the octagon
            segment.rotateOnAxis(new THREE.Vector3(0, 0, 1), 2*Math.PI/8 * (i + 1))
            _this.group!.add(segment)
        }

        this.initLots()
        this.setGridVisibility();
    }

    initLots(){
        let shopsUrl: string = 'assets/json/shops.json';
        this.httpClient.get(shopsUrl).subscribe((response) => {
            let shops = response as ExhibitorJSON[]
            console.log(`${shops.length} shops found`)
            
            shops.forEach((exhibitorJSON) => {
                let shop = new Exhibitor(exhibitorJSON);
                
                shop.lots.forEach((lotID) => {
                    let lot = this.lotsDictionary.get(lotID)

                    if (lot){
                        lot.setExhibitor(shop);
                        lot.originalShop = true
                    }
                })
            })


            this.getFilledLots().forEach((filledLot) => {
                filledLot.initLotLabel(false)
            })
        })

        // TODO: Get from database
        let exhibitorsList: Exhibitor[] = []

        let exhibitorsUrl: string = 'assets/json/exhibitors.json';
        this.httpClient.get(exhibitorsUrl).subscribe((response) => {
            let exhibitors = response as ExhibitorJSON[]
            console.log(`${exhibitors.length} exhibitors found`)
            
            exhibitors.forEach((exhibitorJSON) => {
                let exhibitor = new Exhibitor(exhibitorJSON);
                
                exhibitor.lots.forEach((lotID) => {
                    let lot = this.lotsDictionary.get(lotID)
                    lot?.setExhibitor(exhibitor);
                })

                exhibitorsList.push(exhibitor)
            })

            exhibitorsList.sort((a, b) => (a.displayName > b.displayName) ? 1 : ((b.displayName > a.displayName) ? -1 : 0))
            this.appService.exhibitors.next(exhibitorsList)


            this.getFilledLots().forEach((filledLot) => {
                filledLot.initLotLabel(true)
            })
        })
    }

    getLots() : Lot[]{
        return this.lots
    }

    getFilledLots(): Lot[]{
        let temp: Lot[] = []

        this.lots.forEach((lot) => {
            if (lot.exhibitor.length != 0) temp.push(lot)
        })

        return temp
    }

    createGridLabels(parent: THREE.Object3D, fillMode: string, zone: number): CSS3DObject {
        var grid: HTMLDivElement = this.renderer2.createElement('div'); 
        let elementMap: Map<string, HTMLElement> = new Map<string, HTMLElement>()
        // If fill mode is half, only labels the lower 4 columns

        for(let i = (fillMode == "half") ? 6 : 0; i < 10; i++){
            let temp = this.renderer2.createElement('h1') as HTMLElement;
            this.renderer2.appendChild(grid, temp);

            // Converts number to character, taking fill mode into account
            let label = String.fromCharCode(65 + i - ((fillMode == "half") ? 6 : 0));

            elementMap.set(label, temp)

            temp.innerHTML = label;
            temp.classList.add("absolute", "text-8xl", "text-white");
            temp.style.setProperty("translate", `-60rem ${-51+i*11.2}rem`);
        }

        for(let i = 0; i < 10; i++){
            let temp = this.renderer2.createElement('h1') as HTMLElement;
            this.renderer2.appendChild(grid, temp)

            // Appends 0 to single digit numbers
            let label: string = i<9 ? "0" + (i + 1) : (i + 1).toString()

            elementMap.set(label, temp)

            temp.innerHTML = label;
            temp.classList.add("absolute", "text-8xl", "text-white", "font-normal")
            temp.style.setProperty("translate", `${-51+i*11.2}rem 60rem`)
        }
        // grid.innerHTML = "Hello World"

        // Set screen size
        grid.style.width = '256px';
        grid.style.height = '256px';
        grid.classList.add("flex", "items-center", "justify-center")

        // create a CSS3Dobject and return it.
        var object = new CSS3DObject(grid);
        parent.add(object);
        
        object.position.copy(new THREE.Vector3(0, 2250, 0));
        object.rotation.copy(new THREE.Euler(-Math.PI/2, 0, 0));

        this.gridLabelMaps.push(elementMap)
        return object;
    }
    
    /** Sets visibility of all grids depending on which zone the user is in */
    setGridVisibility(){
        // Check global first
        if (this.appService.gridsVisible.getValue()) {
            console.log("Grids visible global")
            this.grids.forEach((grid, index) => {
                // grid.element.hidden = !(index == this.appService.currentZone.getValue());
                // console.log(grid.element.hidden)
                if (index == this.appService.currentZone.getValue()){
                    grid.element.classList.remove("hidden")
                    grid.element.classList.add("flex")
                }
                else{
                    grid.element.classList.add("hidden")
                    grid.element.classList.remove("flex")
                }
            })
        }
        else {
            console.log("Grids invisible global")
            this.grids.forEach((grid) => {
                grid.element.classList.add("hidden")
                grid.element.classList.remove("flex")
            })
        }
    }

    /** Changes text colour of grid labels depending on hovered lot */
    updateGridLabelColours(currentLot: Lot | null){
        this.resetGridLabelColours()
        // Sets relevant labels to yellow
        if (currentLot != null){
            const rowLabel = this.gridLabelMaps[currentLot.zone].get(currentLot.lotRow)
            rowLabel?.classList.add("text-red-500", "font-bold");
            rowLabel?.classList.remove("text-white", "font-normal");

            const columnLabel = this.gridLabelMaps[currentLot.zone].get(currentLot.lotColumn)
            columnLabel?.classList.add("text-red-500", "font-bold");
            columnLabel?.classList.remove("text-white", "font-normal");
        }
    }

    resetGridLabelColours(){
        this.gridLabelMaps.forEach((elementMap) => {
            let labelElements = Array.from(elementMap.values())

            labelElements.forEach((element) => {
                element.classList.remove("text-red-500", "font-bold");
                element.classList.add("text-white", "font-normal");
            })
        })
    }
}