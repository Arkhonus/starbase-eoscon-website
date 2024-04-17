export class Exhibitor {
    displayName: string;
    shortName: string;
    company: string;
    description: string;
    exhibitingAsCompany: boolean;
    lots: string[]

    constructor (exhibitorJSON: ExhibitorJSON){
        this.displayName = exhibitorJSON.displayName
        this.shortName = exhibitorJSON.shortName;
        this.description = exhibitorJSON.description
        this.company = exhibitorJSON.company;
        this.exhibitingAsCompany = exhibitorJSON.exhibitingAsCompany;
        this.lots = exhibitorJSON.lots
    }
}

export interface ExhibitorJSON{
    displayName: string
    shortName: string
    description: string
    company: string;
    exhibitingAsCompany: boolean;
    lots: string[]
}