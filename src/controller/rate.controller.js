import { SuccessResponse } from '@/response/success.response.js';
import rateService from '@/services/rate.service';

export default class rateController {
  static fetchRates = async (req, res) => {
    new SuccessResponse({
      message: 'update currency rates success',
      metadata: await rateService.fetchRates(),
    }).send(res);
  };
}
