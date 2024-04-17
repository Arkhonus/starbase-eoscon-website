import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Lot } from "./lot"
import { Exhibitor, ExhibitorJSON } from "./exhibitor"
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { Renderer2 } from '@angular/core';

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

    gateMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.5,
    })

    // instantiate a loader
    loader = new FBXLoader();

    constructor (appService: AppService, httpClient: HttpClient, labelsDiv: HTMLDivElement, fillMode: string, renderer2: Renderer2){
        this.fillMode = fillMode
        this.httpClient = httpClient
        this.appService = appService
        this.labelsDiv = labelsDiv
        this.renderer2 = renderer2
        
        this.loadLots()
    }

    async loadLots(){
        let _this = this

        this.loader.setPath("assets/models/")
        this.models = await Promise.all([
            this.loader.loadAsync("area_gate/gate_shops.fbx"),
            this.loader.loadAsync("area_gate/gate_segment.fbx"),
        ])

        let gateShops = this.models[0]
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
                    lot?.setExhibitor(shop);
                })
            })


            this.getFilledLots().forEach((filledLot) => {
                filledLot.initLotLabel(false)
            })
        })

        // TODO: Get from database
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
            })


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
}