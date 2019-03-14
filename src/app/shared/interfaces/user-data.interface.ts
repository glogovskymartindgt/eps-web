export interface UserDataInterface {
    id?: number;
    login?: string;
    email?: string;
    deviceId?: string;
    roles?: string[];
    masterToken?: string;
    authToken?: string;
}

export interface ProjectInterface {
    id?: number;
    name?: string;
    logo?: string;
    country_1?: string;
    country_2?: string;
    venue_city_1?: string;
    venue_city_2?: string;
    state?: string;
}