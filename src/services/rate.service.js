import Rate from '@/models/Rate';
import { ErrorResponse } from '@/response/error.response';
import statusCode from '@/response/httpResponse/statusCode';

export default class rateService {
  static fetchRates = async () => {
    let dataRates;
    await fetch('https://open.er-api.com/v6/latest/USD')
      .then((response) => response.json())
      .then((data) => (dataRates = data))
      .catch((error) => console.error('Error fetching data:', error));

    const { base_code, rates } = dataRates;
    await Rate.deleteMany().catch((error) => {
      throw new ErrorResponse(`Error while deleting records: ${error}`, statusCode.INTERNAL_SERVER_ERROR);
    });

    let ratesArr = Object.entries(rates).map(([currency_code, amount]) => {
      return {
        base_code,
        currency_code,
        amount,
      };
    });
    let data = await Rate.insertMany(ratesArr);
    return data;
  };

  static currencyConvert = async (currency_code, amount) => {
    const rate = await Rate.findOne({ currency_code });
    return amount / rate.amount;
  };
};