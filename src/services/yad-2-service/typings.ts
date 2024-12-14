export interface Location {
    id?: number;
    fullTitleText: string;
    cityId?: string;
    hoodId?: string;
    areaId: string;
}

export interface CitySearchResponse {
    areas: Location[];
    cities: Location[];
    hoods: Location[];
    streets: any[];
    topAreas: any[];
}