import { Injectable } from "@angular/core";
import { User } from "../shared/model/user";
import { TokenInfo } from "../shared/model/tokenInfo";
import { AbsenceData } from "../shared/model/absenceData";
import { AddUser } from "../shared/model/addUser";
import { AbsenceDefinitionData } from "../shared/model/absenceDefinitionData";
@Injectable({ providedIn: "root" })
export class Api {
    private readonly url: string = "https://api4.allhours.com/api/v1/";
    private readonly urlAuth: string = "/auth/";
    token?: string;
    tokenInfo?: TokenInfo;

    constructor() {
        this.token = localStorage.getItem("token") ?? undefined;
        const raw = localStorage.getItem("tokenInfo");
        this.tokenInfo = raw ? JSON.parse(raw) : undefined;
    }

    private clearSession(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenInfo");
        this.token = undefined;
        this.tokenInfo = undefined;
    }

    verify(): boolean {
        if (!this.token || !this.tokenInfo?.loggedIn || !this.tokenInfo.expires_in) {
            this.clearSession();
            return false;
        }
        const seconds = (Date.now() - new Date(this.tokenInfo.loggedIn).getTime()) / 1000;
        if (seconds > this.tokenInfo.expires_in) {
            this.clearSession();
            return false;
        }
        return true;
    }

    private getHeaders(contentType?: string): [string, string][] | undefined {
        const headers: [string, string][] = [];
        if (this.token)
            headers.push(["Authorization", `${this.tokenInfo?.token_type} ${this.token}`]);
        if (contentType)
            headers.push(["Content-Type", contentType]);
        return headers;
    }

    private async parseError(response: Response): Promise<string> {
        try {
            const err = await response.json();
            if (err.status == 401)
                throw new Error("Unauthorized");
            return err.message || err.statusText;
        }
        catch (e) {
            console.error(e);
        }
        throw "Invalid response";
    }

    private async get<T>(url: string, urlParams?: URLSearchParams, abort?: AbortController): Promise<T> {
        if (!this.verify()) throw new Error("Unauthorized");
        if (urlParams && 0 < urlParams.size)
            url += "?" + urlParams.toString();
        const response = await fetch(`${this.url}${url}`, {
            headers: this.getHeaders(),
            signal: abort?.signal
        });
        if (!response.ok)
            throw new Error(await this.parseError(response));
        return await response.json();
    }

    private async post<T>(url: string, data?: unknown, auth?: boolean): Promise<T> {
        if (!this.verify()) throw new Error("Unauthorized");
        const response = await fetch(`${auth ? this.urlAuth : this.url}${url}`, {
            method: "POST",
            headers: this.getHeaders("application/json"),
            body: data ? JSON.stringify(data) : undefined
        });
        if (!response.ok)
            throw new Error(await this.parseError(response));
        return await response.json();
    }

    private async publicPost<T>(url: string, data?: unknown, auth?: boolean): Promise<T> {
        let body: BodyInit | undefined;
        if (data)
            body = auth ? new URLSearchParams(data as Record<string, string>).toString() : JSON.stringify(data);
        const response = await fetch(`${auth ? this.urlAuth : this.url}${url}`, {
            method: "POST",
            headers: this.getHeaders(auth ? "application/x-www-form-urlencoded" : "application/json"),
            body
        });
        if (!response.ok)
            throw new Error(await this.parseError(response));
        return await response.json();
    }

    async createSession(client_id: string, client_secret: string): Promise<TokenInfo> {
        return await this.publicPost("connect/token", { grant_type: "client_credentials", client_id, client_secret, scope: "api" }, true);
    }

    setToken(tokenInfo: TokenInfo) {
        this.token = tokenInfo.access_token;
        tokenInfo.loggedIn = new Date();
        this.tokenInfo = tokenInfo;
        localStorage.setItem("token", tokenInfo.access_token);
        localStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
    }

    async getUsers(searchTerm?: string): Promise<User[]> {
        const params = new URLSearchParams();
        if (searchTerm && typeof searchTerm === "string")
            params.append("searchTerm", searchTerm);

        return this.get("Users", params);
    }

    async createUser(data: AddUser): Promise<User> {
        return this.post("Users", data);
    }

    async getUserAbsenceDefinitions(): Promise<AbsenceDefinitionData[]> {
        return this.get(`AbsenceDefinitions`);
    }

    async createUserAbsence(UserId: string, AbsenceDefinitionId: string, Timestamp: Date): Promise<AbsenceData> {
        return this.post("Absences", { UserId, AbsenceDefinitionId, Timestamp });
    }

    async getAbsences(start: Date, end: Date): Promise<AbsenceData[]> {
        const params = new URLSearchParams();
        if (start) params.append("dateFrom", start.toISOString());
        if (end) params.append("dateTo", end.toISOString());

        return this.get(`Absences`, params);
    }
}