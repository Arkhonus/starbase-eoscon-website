import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Lot } from "./lot"
import { Exhibitor } from "./exhibitor"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

interface Area {
    lots: Lot[]

    initLots(): void
    loadLots(): void
    getLots() : Lot[]
}

export class WarpGate implements Area {
    lots: Lot[] = []
    pickables: THREE.Mesh[] = []
    originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {}
    lotsDictionary: Map<string, Lot> = new Map()
    model?: THREE.Object3D;
    fillMode: string

    // instantiate a loader
    loader = new FBXLoader();

    constructor (fillMode: string){
        this.model = new THREE.Object3D;
        this.fillMode = fillMode
        
        this.loadLots()
        
        return this
    }

    loadLots(){
        let _this = this;

        const gateMaterial = new THREE.MeshStandardMaterial()
        gateMaterial.roughness = 0.5
        //gateMaterial.color = new THREE.Color(0xffffff);

        // load a resource
        this.loader.load(
            // resource URL
            'models/area_gate/gate_shops.fbx',
            // called when resource is loaded
            function ( object ) {
                // Gate segment 1 has the ship shops
                object.traverse(function(obj) {
                    if (obj.name.substring(0,4) == "gate"){
                        (obj as THREE.Mesh).material = gateMaterial;
                    }
                    else if (obj.name.substring(0,3) == "lot"){

                    }
                    else {
                        (obj as THREE.Mesh).material = gateMaterial;
                    } 
                })

                _this.model!.add(object);

            },
            // called when loading is in progresses
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );

        // load a resource
        this.loader.load(
            // resource URL
            'models/area_gate/gate_segment.fbx',
            // called when resource is loaded
            function ( object ) {
                let prevSegment: THREE.Group

                for(let i = 0; i<7 ; i++){
                    let segment 

                    // First segment uses the first spawned object
                    if (i == 0){
                        segment = object
                    }else {
                        segment = prevSegment!.clone()
                    }
                    if (_this.fillMode == "half"){console.log("Generating gate area in half fill mode")}

                    // Traverses the segment and sets materials for the meshes
                    segment.traverse(function(obj) {
                        // Gate material for gate meshes
                        if (obj.name.substring(0,4) == "gate"){
                            const m = obj as THREE.Mesh
                            m.material = gateMaterial
                        }
                        // Lot material for lot meshes
                        else if (obj.name.substring(0,3) == "lot"){
                            const m = obj as THREE.Mesh
                            m.geometry.computeBoundingBox()

                            // Sets master lot ID, con specific ID (conLotID) is different depending on fill mode
                            let lotID = `${i + 1}-` + obj.name.substring(obj.name.length-3 , obj.name.length)
                            let lotRow = lotID.substring(obj.name.length-5 , obj.name.length-4)

                            // Creates lot object and pushes to array
                            let lot = new Lot(lotID, i+1, m)
                            _this.pickables.push(m)
                            _this.originalMaterials[m.name] = (m as THREE.Mesh).material
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

                                // TODO: Set material params for disabled lots
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
                            (obj as THREE.Mesh).material = gateMaterial
                        } 
                    })

                    // Rotates the mesh to form each side of the octagon
                    segment.rotateOnAxis(new THREE.Vector3(0, 0, 1), 2*Math.PI/8)
                    _this.model!.add(segment)

                    prevSegment = segment
                }

            },
            // called when loading is in progresses
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );

    }

    initLots(){
        // TODO: Get from database
        let as = new Exhibitor("Ark's Sparks")
        // let ec = new Exhibitor("Eos Con")

        this.lotsDictionary.get("1-D06")!.setExhibitor([as])
        // this.lotsDictionary.get("1-D06")!.setExhibitor([as, ec])
        // Need to make sure this runs only after the lots have been initialized
    }

    getLots() : Lot[]{
        return this.lots
    }

    getFilledLots(): Lot[]{
        let temp: Lot[] = []

        this.lots.forEach((lot) => {
            if (lot.exhibitor) temp.push(lot)
        })

        return temp
    }

    generateLotLabels(zone: number): { [key: string]: CSS2DObject }{
        let temp: { [key: string]: CSS2DObject } = {}

        this.getFilledLots().forEach((lot) => {
            if (lot.zone == zone){
                // Initialize 2D labels
                const lotLabelDiv = document.createElement(
                    'div'
                ) as HTMLDivElement
                lotLabelDiv.className = 'lotLabel'
    
                let exhibitorNames: string = ""
                lot.exhibitor?.forEach((exhibitor) => {
                    exhibitorNames += exhibitor.name + "\n"
                })
    
                lotLabelDiv.innerText = exhibitorNames
            
                const lotLabel = new CSS2DObject(lotLabelDiv)
                let pos: THREE.Vector3 = new THREE.Vector3
                lot.lotArea.getWorldPosition(pos)
    
                lotLabel.position.copy(pos)
                
                temp[lot.conLotID!] = lotLabel

            }
        })

        return temp
    }
}