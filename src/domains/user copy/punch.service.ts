// src/punch/punch.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Punch, PunchDocument } from './punch.schema';
import dayjs from 'dayjs';
import { start } from 'repl';

@Injectable()
export class PunchService {
  constructor(
    @InjectModel(Punch.name) private punchModel: Model<PunchDocument>,
  ) {}

  async punch(userId: string): Promise<Punch> {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let punch = await this.punchModel.findOne({ user: userId, date: dateOnly });

    if (!punch) {
      punch = new this.punchModel({
        user: userId,
        date: dateOnly,
        firstPunchIn: new Date(),
      });
    } else {
      punch.lastPunchOut = new Date();
    }

    return punch.save();
  }

  async getPunchesForUser(userId: string): Promise<Punch[]> {
    return this.punchModel.find({ user: userId }).sort({ date: -1 }).exec();
  }
async generatePunchesForUser(
  userId: string,
  startDateStr = '2025-05-01',
  endDateStr = '2025-06-31',
): Promise<Punch[]> {
  const punches: Punch[] = [];

  let currentDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // Helper to check if weekend (Sun=0, Sat=6)
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Helper to create a date with time (hour, minute)
  const createDateWithTime = (date: Date, hour: number, minuteOffset: number): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minuteOffset, 0);
  };

  // Loop from startDate to endDate inclusive
  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      const dateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

      let punch = await this.punchModel.findOne({ user: userId, date: dateOnly });

      // Generate minute offset ±15 min randomly
      const randomMinuteOffset = () => Math.floor(Math.random() * 31) - 15;

      if (!punch) {
        punch = new this.punchModel({
          user: userId,
          date: dateOnly,
          firstPunchIn: createDateWithTime(dateOnly, 8, randomMinuteOffset()),
          lastPunchOut: createDateWithTime(dateOnly, 17, randomMinuteOffset()),
        });
      } else {
        punch.lastPunchOut = createDateWithTime(dateOnly, 17, randomMinuteOffset());
      }

      punches.push(await punch.save());
    }

    // Increment currentDate by 1 day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return punches;
}


async getTotalWorkingTimeByMonth(
    userId: string,
    month: string, // Format: 'YYYY-MM'
  ): Promise<number> {
    // Validate and parse month input
    const [year, monthIndex] = month.split('-').map(Number);
    if (isNaN(year) || isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
      throw new Error('Invalid month format. Use YYYY-MM');
    }

    // Calculate date range for the month
    const startDate = new Date(Date.UTC(year, monthIndex - 1, 1));
    const endDate = new Date(Date.UTC(year, monthIndex, 1));

    // Aggregate to calculate total milliseconds
    const result = await this.punchModel.aggregate([
      // Stage 1: Filter documents for user and month
      {
        $match: {
          user: userId,
          date: { $gte: startDate, $lt: endDate },
        },
      },
      // Stage 2: Calculate daily working time
      {
        $addFields: {
          dailyMs: {
            $cond: {
              if: {
                $and: [
                  { $ne: ['$firstPunchIn', null] },
                  { $ne: ['$lastPunchOut', null] },
                ],
              },
              then: { $subtract: ['$lastPunchOut', '$firstPunchIn'] },
              else: 0,
            },
          },
        },
      },
      // Stage 3: Sum all daily working times
      {
        $group: {
          _id: null,
          totalMs: { $sum: '$dailyMs' },
        },
      },
    ]);

    // Return total milliseconds (0 if no data)
    return result[0]?.totalMs || 0;
  }
 async getPunchSummaryByMonth(userId: string, month: string): Promise<{
    totalDays: number;
    missingPunches: number;
    lateArrivals: number;
    earlyLeaves: number;
  }> {
    const [year, monthIndex] = month.split('-').map(Number);
    if (isNaN(year) || isNaN(monthIndex) || monthIndex < 1 || monthIndex > 12) {
      throw new Error('Invalid month format. Use YYYY-MM');
    }

    const startDate = new Date(Date.UTC(year, monthIndex - 1, 1));
    const endDate = new Date(Date.UTC(year, monthIndex, 1));

    const punches = await this.punchModel.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate },
    });
    let missingPunches = 0;
    let lateArrivals = 0;
    let earlyLeaves = 0;

    for (const punch of punches) {
      const { firstPunchIn, lastPunchOut } = punch;

      // Missing if either is null
      if (!firstPunchIn || !lastPunchOut) {
        missingPunches++;
        continue;
      }

      const punchIn = new Date(firstPunchIn);
      const punchOut = new Date(lastPunchOut);

      // Get 8:00 AM and 5:00 PM UTC equivalents for comparison
      const dayStart = new Date(punchIn);
      dayStart.setUTCHours(8, 0, 0, 0);

      const dayEnd = new Date(punchOut);
      dayEnd.setUTCHours(17, 0, 0, 0);

      if (punchIn > dayStart) lateArrivals++;
      if (punchOut < dayEnd) earlyLeaves++;
    }

    return {
      totalDays: punches.length,
      missingPunches,
      lateArrivals,
      earlyLeaves,
    };
  }
   async getTotalWorkingHoursForMonth(userId: string, month: string): Promise<number> {
  // month format: 'YYYY-MM', e.g. '2025-06'
  const [yearStr, monthStr] = month.split('-');
  const year = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10); // 1-based month

  // Start of month: YYYY-MM-01 00:00:00.000
  const startOfMonth = new Date(year, monthNum - 1, 1, 0, 0, 0, 0);

  // End of month: last day at 23:59:59.999
  // Trick: create next month 1st day, then subtract 1 ms
  const startOfNextMonth = new Date(year, monthNum, 1, 0, 0, 0, 0);
  const endOfMonth = new Date(startOfNextMonth.getTime() - 1);

  const punches = await this.punchModel.find({
    user: userId,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).exec();

  let totalMilliseconds = 0;
  for (const punch of punches) {
    if (punch.firstPunchIn && punch.lastPunchOut) {
      const duration = punch.lastPunchOut.getTime() - punch.firstPunchIn.getTime();
      if (duration > 0) {
        totalMilliseconds += duration;
      }
    }
  }

  const totalHours = totalMilliseconds / (1000 * 60 * 60); // Convert ms to hours
  return parseFloat(totalHours.toFixed(2));
}

}
