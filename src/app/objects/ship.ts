export class Ship {
    name: string;
    type: string;
    size: number;
    description: string;
    properties: Object;
    images: string[]

    constructor (shipJson: ShipJSON){
        this.name = shipJson.name;
        this.type = shipJson.type;
        this.size = shipJson.size;
        this.description = shipJson.description;
        this.properties = shipJson.properties;
        this.images = shipJson.images;
    }

}

export interface ShipJSON {
    name: string;
    type: string;
    size: number;
    description: string;
    properties: Object;
    images: string[]
}
