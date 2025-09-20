import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';
export declare class LocationsController {
    private readonly service;
    constructor(service: LocationsService);
    findAll(): Promise<(import("./entities/location.entity").Location & {
        embedUrl: string;
        mapUrl: string;
    })[]>;
    byCountry(country: string): Promise<(import("./entities/location.entity").Location & {
        embedUrl: string;
        mapUrl: string;
    })[]>;
    nearest(latRaw: string, lngRaw: string): Promise<{
        distanceKm: number;
        id: string;
        name: string;
        country: string;
        city: string;
        address: string;
        lat: string;
        lng: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        embedUrl: string;
        mapUrl: string;
    } | null>;
    directions(id: string, latRaw: string, lngRaw: string): Promise<{
        distanceKm: number;
        directionsUrl: string;
        id: string;
        name: string;
        country: string;
        city: string;
        address: string;
        lat: string;
        lng: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        embedUrl: string;
        mapUrl: string;
    }>;
    create(dto: CreateLocationDto): Promise<import("./entities/location.entity").Location>;
    update(id: string, dto: UpdateLocationDto): Promise<import("./entities/location.entity").Location>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
}
