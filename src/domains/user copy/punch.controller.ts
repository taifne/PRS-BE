// src/punch/punch.controller.ts
import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { PunchService } from './punch.service';

@Controller('punch')
export class PunchController {
  constructor(private readonly punchService: PunchService) {}
    @Get(':userId/working-hours')
  async getTotalWorkingHours(
    @Param('userId') userId: string,
    @Query('month') month: string, // e.g., "2025-06"
  ): Promise<{ userId: string; month: string; totalHours: number }> {
 
    const totalHours = await this.punchService.getTotalWorkingHoursForMonth(userId, month);
    return {
      userId,
      month,
      totalHours,
    };
  }
  @Post(':userId')
  async punch(@Param('userId') userId: string) {
    return this.punchService.punch(userId);
  }

   @Get('summary/:userId')
  async getPunchSummary(
    @Param('userId') userId: string,
    @Query('month') month: string,
  ) {
    const summary = await this.punchService.getPunchSummaryByMonth(userId, month);
    return summary;
  }
 @Get('working-time/:userId')
  async getTotalWorkingTimeByMonth(
    @Param('userId') userId: string,
    @Query('month') month: string,
  ): Promise<{ totalWorkingTimeMs: number }> {
    if (!month) {
      throw new Error('Query parameter "month" is required in YYYY-MM format');
    }

    const totalMs = await this.punchService.getTotalWorkingTimeByMonth(userId, month);
    return { totalWorkingTimeMs: totalMs };
  }
  @Get(':userId')
  async getPunches(@Param('userId') userId: string) {
    return this.punchService.getPunchesForUser(userId);
  }
    
}
