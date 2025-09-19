import { ClassHistoryResponseDto } from "src/classes/dto/class-history-response.dto";
import { ClassAvailableDto } from "src/classes/dto/classes-available.dto";
import { CommentResponseDto } from "src/comments/dto/comment-response.dto";
import { UserProfileDto } from "src/user/dto/user-profile.dto";

export class DashboardDataDto {
  profile: UserProfileDto;
  comments: CommentResponseDto[];
  availableClasses: ClassAvailableDto[];
  classHistory: ClassHistoryResponseDto[];
}