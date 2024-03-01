import * as THREE from 'three'
import { Exhibitor } from "./exhibitor"
import { Ship } from "./ship"

export class Lot{
    lotID: string
    zone: number
    conLotID?: string
    exhibitor?: Exhibitor[]
    ships: Ship[] = []
    lotArea: THREE.Mesh
    enabled: boolean = true

    constructor(lotID: string, zone: number, lotArea:THREE.Mesh) {
        this.lotID = lotID
        this.lotArea = lotArea
        this.zone = zone

        this.updateMaterial()

        const lotMaterial = new THREE.MeshPhysicalMaterial()
        lotMaterial.reflectivity = 0
        lotMaterial.transmission = 1.0
        lotMaterial.roughness = 0.2
        lotMaterial.metalness = 0
        lotMaterial.clearcoat = 0.3
        lotMaterial.clearcoatRoughness = 0.25
        lotMaterial.color = new THREE.Color(0x0000ff)
        lotMaterial.ior = 1.2
        lotMaterial.thickness = 4.0

        lotArea.material = lotMaterial
    }

    getShipsCount(): number {
        return this.ships.length
    }

    setEnabled(enabled: boolean){
        this.enabled = enabled
        this.updateMaterial()
    }

    setExhibitor(exhibitor: Exhibitor[]){
        this.exhibitor = exhibitor
        this.updateMaterial()
    }

    updateMaterial(){
        let m = this.lotArea.material as THREE.MeshPhysicalMaterial

        if (this.exhibitor) {
            m.color = new THREE.Color(0x00ff00)

            console.log("Exhibitor in lot " + this.conLotID)
        } 
        else if (!this.enabled){
            m.color = new THREE.Color(0x555555)
        }
        else{

        }

        // Seems to execute asynchronously so timeout first
        setTimeout(() => {
            m.needsUpdate = true;
        }, 1000);
    }
}