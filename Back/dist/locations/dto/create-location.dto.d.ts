export declare class CreateLocationDto {
    name: string;
    country: string;
    city: string;
    address: string;
    lat: number;
    lng: number;
    isActive?: boolean;
}
declare const UpdateLocationDto_base: import("@nestjs/common").Type<Partial<CreateLocationDto>>;
export declare class UpdateLocationDto extends UpdateLocationDto_base {
}
export {};
