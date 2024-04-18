export class Exhibitor {
    displayName: string;
    shortName: string;
    logo: string;
    company: string;
    tagline: string;
    description: string;
    exhibitingAsCompany: boolean;
    lots: string[]

    constructor (exhibitorJSON: ExhibitorJSON){
        this.displayName = exhibitorJSON.displayName
        this.shortName = exhibitorJSON.shortName;
        this.logo = exhibitorJSON.logo;
        this.tagline = exhibitorJSON.tagline;
        this.description = exhibitorJSON.description
        this.company = exhibitorJSON.company;
        this.exhibitingAsCompany = exhibitorJSON.exhibitingAsCompany;
        this.lots = exhibitorJSON.lots;
    }

    get detailedName(): string{
        return this.displayName == this.shortName ? `${this.displayName}` : `${this.displayName} (${this.shortName})`
    }
}

export interface ExhibitorJSON{
    displayName: string;
    shortName: string;
    logo: string;
    tagline: string;
    description: string;
    company: string;
    exhibitingAsCompany: boolean;
    lots: string[]
}