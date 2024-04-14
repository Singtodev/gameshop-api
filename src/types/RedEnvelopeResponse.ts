// To parse this data:
//
//   import { Convert } from "./file";
//
//   const redEnvelopeResponse = Convert.toRedEnvelopeResponse(json);

export interface RedEnvelopeResponse {
    id?:        string;
    phone?:     string;
    gift_link?: string;
    amount?:    string;
    status?:    string;
    time?:      Date;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toRedEnvelopeResponse(json: string): RedEnvelopeResponse[] {
        return JSON.parse(json);
    }

    public static redEnvelopeResponseToJson(value: RedEnvelopeResponse[]): string {
        return JSON.stringify(value);
    }
}
