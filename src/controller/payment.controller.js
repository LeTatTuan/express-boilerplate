import { DAYS_AGO, NAME_OF_PROJECT, PAGE, PAGE_SIZE } from '@/enum';
import { SuccessResponse } from '@/response/success.response.js';
import paymentService from '@/services/payment.service';

class paymentController {
  static getActiveTrials = async (req, res) => {
    const prefixBundleId = req.query?.prefixBundleId || NAME_OF_PROJECT;
    const days = req.query?.days || DAYS_AGO;
    new SuccessResponse({
      message: 'Active Trials',
      metadata: await paymentService.getActiveTrials(prefixBundleId, days),
    }).send(res);
  };

  static getActiveSubs = async (req, res) => {
    const prefixBundleId = req.query?.prefixBundleId || NAME_OF_PROJECT;
    const days = req.query?.days || DAYS_AGO;
    new SuccessResponse({
      message: 'Active Subs',
      metadata: await paymentService.getActiveSubs(prefixBundleId, days),
    }).send(res);
  };

  static getRevenues = async (req, res) => {
    const prefixBundleId = req.query?.prefixBundleId || NAME_OF_PROJECT;
    const days = req.query?.days || DAYS_AGO;
    new SuccessResponse({
      message: 'Revenue',
      metadata: await paymentService.getRevenues(prefixBundleId, days),
    }).send(res);
  };

  static getNewCustomers = async (req, res) => {
    const days = req.query?.days || DAYS_AGO;
    new SuccessResponse({
      message: 'New Customers',
      metadata: await paymentService.getNewCustomers(days),
    }).send(res);
  };

  static getActiveUsers = async (req, res) => {
    const days = req.query?.days || DAYS_AGO;
    new SuccessResponse({
      message: 'Active Users',
      metadata: await paymentService.getActiveUsers(days),
    }).send(res);
  };

  static getRecentTransactions = async (req, res) => {
    const prefixBundleId = req.query?.prefixBundleId || NAME_OF_PROJECT;
    const days = req.query?.days || DAYS_AGO;
    new SuccessResponse({
      message: 'Recent Transactions',
      metadata: await paymentService.getRecentTransactions(prefixBundleId, days),
    }).send(res);
  };
}
export default paymentController;
