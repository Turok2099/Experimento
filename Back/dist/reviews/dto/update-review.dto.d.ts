import { CreateReviewDto } from './create-review.dto';
declare const UpdateReviewDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateReviewDto>>;
export declare class UpdateReviewDto extends UpdateReviewDto_base {
}
export declare class UpdateReviewStatusDto {
    isActive: boolean;
}
export declare class ModerateReviewDto {
    status: 'approved' | 'rejected';
}
export {};
