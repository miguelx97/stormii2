export enum UnitMeasure {
    Metric = 'metric',
    Miles = 'miles'
}

export class MeasuresService {
    public readonly SOUND_SPEED_m_s: number = 340;
    private currentUnitMeasure: UnitMeasure = UnitMeasure.Metric;

    setCurrentUnitMeasure(currentUnitMeasure: UnitMeasure): void {
        this.currentUnitMeasure = currentUnitMeasure;
    }

    getCurrentUnitMeasure(): UnitMeasure {
        return this.currentUnitMeasure;
    }

    metersToCurrentUnitMeasure(distance_m: number): string {
        let distanceResult: string;

        switch (this.currentUnitMeasure) {
            case UnitMeasure.Miles: {
                let miles = distance_m * 0.000621371;
                miles = Math.round(miles * 1000) / 1000;
                distanceResult = `${miles} Mi`;
                break;
            }
            default: {
                const km = Math.trunc(distance_m / 1000);
                const meters = Math.trunc(distance_m - (km * 1000));
                distanceResult = `${km} Km ${meters} m`;
                break;
            }
        }
        return distanceResult;
    }

    thunderSecondsToMeters(time_s: number): number {
        return time_s * this.SOUND_SPEED_m_s;
    }

    millisecondsToSeconds(time_ms: number): number {
        return time_ms / 1000;
    }

    calculateDistanceFromThunder(time_ms: number): {
        timeInSeconds: number;
        distanceInMeters: number;
        distanceFormatted: string;
    } {
        const timeInSeconds = this.millisecondsToSeconds(time_ms);
        const distanceInMeters = this.thunderSecondsToMeters(timeInSeconds);
        const distanceFormatted = this.metersToCurrentUnitMeasure(distanceInMeters);

        return {
            timeInSeconds,
            distanceInMeters,
            distanceFormatted
        };
    }
}

// Singleton instance
export const measuresService = new MeasuresService();
