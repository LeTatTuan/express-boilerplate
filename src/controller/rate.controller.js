import { SuccessResponse } from '@/response/success.response.js';
import rateService from '@/services/rate.service';
import { CronJob } from 'cron';


const job = CronJob.from({
  cronTime: '45 8 * * *',
  onTick: async function () {
    await rateService.fetchRates()
  },
  start: true,
  timeZone: 'UTC+7'
});


export default class rateController {
  static fetchRates = async (req, res) => {
    new SuccessResponse({
      message: 'update currency rates success',
      metadata: await rateService.fetchRates(),
    }).send(res);
  };
}
