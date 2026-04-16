export interface TokenInfo {
    access_token: string;
    expires_in: number;
    loggedIn?: Date;
    token_type: string;
    scope: string;
}