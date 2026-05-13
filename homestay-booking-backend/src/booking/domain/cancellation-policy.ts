export class CancellationPolicy {
  calculate(
    totalPrice: number,
    checkInDate: string,
  ): {
    penaltyAmount: number;
    refundAmount: number;
    penaltyPercent: number;
  } {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    const daysUntilCheckIn = Math.ceil(
      (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    let penaltyPercent = 0;
    if (daysUntilCheckIn <= 0) penaltyPercent = 100;
    else if (daysUntilCheckIn < 3) penaltyPercent = 50;
    else if (daysUntilCheckIn < 7) penaltyPercent = 30;

    const penaltyAmount = Math.round((totalPrice * penaltyPercent) / 100);
    return {
      penaltyAmount,
      refundAmount: totalPrice - penaltyAmount,
      penaltyPercent,
    };
  }
}
