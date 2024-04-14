import axios from "axios";
import { RedEnvelopeResponse } from "../types/RedEnvelopeResponse";

export class TrueMoneyWalletService {
  public ENDPOINT_PATH = "https://byshop.me/api";
  public PHONE_RECIVED = "0825616378";
  constructor() {}

  public async requestTopupByRedEnvelope(gift_link: string) {
    try {
      let optionRequest = {
        phone: this.PHONE_RECIVED,
        gift_link,
      };
      const { data } = await axios.post(
        `${this.ENDPOINT_PATH + "/truewallet"}`,
        optionRequest
      );
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  public async getHistoryByPhone(phone: string) {
    const { data } = await axios.get(
      `${this.ENDPOINT_PATH + "/history_truewallet?phone=" + phone}`
    );
    return data;
  }
}
