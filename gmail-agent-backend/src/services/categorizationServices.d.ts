interface CategorizedGroup {
    category: string;
    emails: any[];
}
export declare function categorizeEmailsStreaming(emails: {
    subject: string;
    snippet: string;
}[], filters: string[]): Promise<CategorizedGroup[]>;
export {};
//# sourceMappingURL=categorizationServices.d.ts.map