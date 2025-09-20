import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { CreateLocationDto, UpdateLocationDto } from './dto/create-location.dto';
type WithLinks = Location & {
    embedUrl: string;
    mapUrl: string;
};
export declare class LocationsService {
    private readonly repo;
    constructor(repo: Repository<Location>);
    findAll(): Promise<WithLinks[]>;
    findByCountry(country: string): Promise<WithLinks[]>;
    findOne(id: string): Promise<Location | null>;
    create(dto: CreateLocationDto): Promise<Location>;
    update(id: string, dto: UpdateLocationDto): Promise<Location>;
    remove(id: string): Promise<{
        ok: boolean;
    }>;
    nearest(lat: number, lng: number): Promise<{
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
    directions(id: string, originLat: number, originLng: number): Promise<{
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
    private withLinks;
    private haversineKm;
}
export {};
