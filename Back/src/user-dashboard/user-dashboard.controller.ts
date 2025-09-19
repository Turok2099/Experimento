import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from 'src/user/users.service';
import { CommentService } from 'src/comments/comments.service';
import { ClassesService } from 'src/classes/classes.service';
import { ClassHistoryService } from 'src/classes/class-history.service';
import { DashboardDataDto } from './dto/user-dashboard-data.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly userService: UsersService,
    private readonly commentService: CommentService,
    private readonly classService: ClassesService,
    private readonly classHistoryService: ClassHistoryService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener datos completos del dashboard' })
  @ApiResponse({ status: 200, description: 'Datos del dashboard obtenidos exitosamente' })
  async getDashboardData(@Request() req): Promise<DashboardDataDto> {
    const userId = req.user.userId;

    const [profile, comments, availableClasses, classHistory] = await Promise.all([
      this.userService.getProfile(userId),
      this.commentService.findByUser(userId),
      this.classService.findAll(),
      this.classHistoryService.findByUser(userId),
    ]);

    return {
      profile,
      comments,
      availableClasses,
      classHistory,
    };
  }
}