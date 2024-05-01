export namespace PredictionUtil {
  function calculateGrowthRate(
    previousConsumption: number,
    consumption: number,
  ): number {
    return (consumption - previousConsumption) / previousConsumption;
  }

  export function calculateAverageEmissionGrowthRate(
    historicConsumption: {
      year: number;
      consumption: number;
    }[],
  ) {
    let sumOfGrowthRates = 0;
    for (let i = 1; i < historicConsumption.length; i++) {
      const growthRate = calculateGrowthRate(
        historicConsumption[i - 1].consumption,
        historicConsumption[i].consumption,
      );

      sumOfGrowthRates += growthRate;
    }

    return sumOfGrowthRates / historicConsumption.length - 1;
  }

  export function calculatePredictedConsumption(
    lastYearConsumedValue: number,
    averageGrowthRate: number,
  ): number {
    const BASE_VALUE = 1; // Assume consumption used is 100%
    return lastYearConsumedValue * (BASE_VALUE + averageGrowthRate);
  }
}
