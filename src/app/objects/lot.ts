import * as THREE from 'three'
import { Exhibitor } from "./exhibitor"
import { Ship } from "./ship"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { Renderer2 } from '@angular/core'

export class Lot{
    lotID: string;
    zone: number;
    conLotID?: string;
    exhibitor: Exhibitor[] = [];
    ships: Ship[] = [];
    lotArea: THREE.Mesh;
    enabled: boolean = true;
    hovered: boolean = false;
    lotColor: number = 0x555555;
    label2D?: CSS2DObject;
    labelsDiv: HTMLDivElement;
    originalShop: boolean;
    
    lotMaterial = new THREE.MeshPhysicalMaterial({
        reflectivity: 0,
        transmission: 1.0,
        roughness: 0.2,
        metalness: 0,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
        color: new THREE.Color(0x0000ff),
        ior: 1.2,
        thickness: 4.0,
    })

    highlightedMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x00ff00,
    })

    constructor(lotID: string, zone: number, lotArea:THREE.Mesh, labelsDiv: HTMLDivElement, private renderer2: Renderer2, originalShop: boolean = false) {
        this.lotID = lotID
        this.lotArea = lotArea
        this.zone = zone
        this.labelsDiv = labelsDiv
        this.originalShop = originalShop

        this.updateMaterial()

        lotArea.material = this.lotMaterial
    }

    getShipsCount(): number {
        return this.ships.length
    }

    get lotRow(): string{
        if (this.conLotID){
            return this.conLotID.substring(this.conLotID.length - 2, this.conLotID.length)
        }
        else {
            return ""
        }
    }

    get lotColumn(): string{
        if (this.conLotID){
            return this.conLotID.substring(this.conLotID.length - 3, this.conLotID.length - 2)
        }
        else {
            return ""
        }
    }


    get lotLabel(): string{
        let exhibitorNames: string = ""

        this.exhibitor?.forEach((exhibitor) => {
            exhibitorNames += exhibitor.shortName + "\n"
        })

        return exhibitorNames
    }

    set zoneVisible(visible: boolean){
        if (this.label2D) {
            this.label2D.element.hidden = !visible
        }
    }

    setEnabled(enabled: boolean){
        this.enabled = enabled
        this.updateMaterial()
    }

    setExhibitor(exhibitor: Exhibitor){
        this.exhibitor?.push(exhibitor)
        this.updateMaterial()
    }

    setHovered(hovered: boolean){
        this.hovered = hovered
        this.updateMaterial()
    }

    initLotLabel(hidden: boolean){
        // If already initialized, return
        if (this.label2D) return;

        // Initialize 2D labels
        const lotLabelDiv = this.renderer2.createElement(
            'div'
        ) as HTMLDivElement
        lotLabelDiv.className = 'lotLabel'
        lotLabelDiv.innerText = this.lotLabel
        lotLabelDiv.hidden = hidden
        this.renderer2.appendChild(this.labelsDiv, lotLabelDiv)
    
        this.label2D = new CSS2DObject(lotLabelDiv)
        let pos: THREE.Vector3 = new THREE.Vector3
        this.lotArea.getWorldPosition(pos)

        this.lotArea.add(this.label2D)
    }

    updateMaterial(){
        //let m = this.lotArea.material as THREE.MeshPhysicalMaterial

        if (this.hovered){
            this.lotArea.material = this.highlightedMaterial
        }
        else if (this.exhibitor.length != 0) {
            this.lotArea.material = this.lotMaterial
            this.lotMaterial.color = new THREE.Color(0x00ff00)
        } 
        else if (!this.enabled){
            this.lotArea.material = this.lotMaterial
            this.lotMaterial.color = new THREE.Color(0x555555)
        }
        else{
            this.lotArea.material = this.lotMaterial

        }
    }
}