export declare function updateImpactMetrics(): Promise<void>;
export declare function createNotification(userId: string, title: string, body: string, type: string, data?: Record<string, string>): Promise<void>;
export declare function awardPoints(userId: string, points: number, reason: string, referenceId?: string | null): Promise<void>;
export declare function getUserEmail(userId: string): Promise<string | null>;
//# sourceMappingURL=helpers.d.ts.map