/**
 * Fetches the most recent emails for a user
 * @param userEmail user's email
 * @param maxResults optional limit (default 50)
 */
export declare function fetchEmailsForUser(userEmail: string, maxResults?: number): Promise<{
    subject: string;
    snippet: string;
    id: string;
    internalDate: number;
}[]>;
/**
 * Creates a Gmail label if it doesn't exist, returns label ID
 */
export declare function createLabel(userEmail: string, labelName: string): Promise<string>;
/**
 * Applies a label to a Gmail message
 */
export declare function applyLabel(userEmail: string, messageId: string, labelId: string): Promise<void>;
//# sourceMappingURL=gmailService.d.ts.map