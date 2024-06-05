import Device from '@/models/Device';
import Presence from '@/models/Presence';
import Transaction from '@/models/Transaction';
import { formatDate } from '@/utils/function.js';
import rateService from './rate.service';

class paymentService {
  static getActiveTrials = async (prefixBundleId, days) => {
    const daysAgo = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000).getTime();

    const result = await Transaction.aggregate([
      {
        $match: {
          $or: [
            {
              bundle_id: { $regex: prefixBundleId },
            },
            {
              store_id: { $regex: prefixBundleId },
            },
          ],
        },
      },
      {
        $unwind: '$transactions',
      },
      {
        $group: {
          _id: null,
          transactions: { $push: '$transactions' },
        },
      },
      {
        $project: {
          _id: 0,
          transactions: {
            $filter: {
              input: '$transactions',
              as: 'transaction',
              cond: {
                $and: [
                  { $eq: ['$$transaction.offerDiscountType', 'FREE_TRIAL'] },
                  { $gte: ['$$transaction.purchaseDate', daysAgo] },
                ],
              },
            },
          },
        },
      },
    ]);
    const totalActiveTrials = result.length > 0 ? result[0].transactions.length : 0;
    return {
      active_trials: totalActiveTrials,
      active_trials_formatted: totalActiveTrials.toLocaleString('en-US'),
    };
  };
  static getActiveSubs = async (prefixBundleId, days) => {
    const daysAgo = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000).getTime();

    const result = await Transaction.aggregate([
      {
        $match: {
          $or: [
            {
              bundle_id: { $regex: prefixBundleId },
            },
            {
              store_id: { $regex: prefixBundleId },
            },
          ],
        },
      },
      {
        $unwind: '$transactions',
      },
      {
        $group: {
          _id: null,
          transactions: { $push: '$transactions' },
        },
      },
      {
        $project: {
          _id: 0,
          transactions: {
            $filter: {
              input: '$transactions',
              as: 'transaction',
              cond: {
                $and: [
                  { $ne: ['$$transaction.offerDiscountType', 'FREE_TRIAL'] },
                  { $gte: ['$$transaction.purchaseDate', daysAgo] },
                ],
              },
            },
          },
        },
      },
    ]);

    const totalActiveSubs = result.length > 0 ? result[0].transactions.length : 0;
    return {
      active_subs: totalActiveSubs,
      active_subs_formatted: totalActiveSubs.toLocaleString('en-US'),
    };
  };

  static getRevenues = async (prefixBundleId, days) => {
    const daysAgo = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000).getTime();

    let results = await Transaction.aggregate([
      {
        $match: {
          $or: [{ bundle_id: { $regex: prefixBundleId } }, { store_id: { $regex: prefixBundleId } }],
        },
      },
      {
        $unwind: '$transactions',
      },
      {
        $match: {
          'transactions.purchaseDate': { $gte: daysAgo },
          'transactions.offerDiscountType': { $ne: 'FREE_TRIAL' },
        },
      },
      {
        $project: {
          _id: 0,
          transactionId: '$transactions.transactionId',
          originalTransactionId: '$transactions.originalTransactionId',
          webOrderLineItemId: '$transactions.webOrderLineItemId',
          bundleId: '$transactions.bundleId',
          storefront: '$transactions.storefront',
          productId: '$transactions.productId',
          totalCost: {
            $multiply: [{ $divide: ['$transactions.price', 1000] }, '$transactions.quantity'],
          },
          subscriptionGroupIdentifier: '$transactions.subscriptionGroupIdentifier',
          purchaseDate: '$transactions.purchaseDate',
          originalPurchaseDate: '$transactions.originalPurchaseDate',
          expiresDate: '$transactions.expiresDate',
          quantity: '$transactions.quantity',
          type: '$transactions.type',
          currency: '$transactions.currency',
          price: { $divide: ['$transactions.price', 1000] },
          offerType: '$transactions.offerType',
          offerDiscountType: '$transactions.offerDiscountType',
        },
      },
      {
        $sort: {
          purchaseDate: -1,
        },
      },
    ]);

    let totalRevenue = 0;
    for (const result of results) {
      let totalCostByRates = await rateService.currencyConvert(result.currency, result.totalCost);
      totalRevenue += totalCostByRates;
    }
    const formattedRevenue = totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return {
      revenue: totalRevenue,
      revenue_formatted: formattedRevenue,
    };
  };

  static getNewCustomers = async (days) => {
    const daysAgo = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);

    const newCustomers = await Device.distinct('uuid', {
      createdAt: { $gte: daysAgo },
    });
    const NoNewCustomers = newCustomers.length;
    return {
      new_customers: NoNewCustomers,
      new_customers_formatted: NoNewCustomers.toLocaleString('en-US'),
    };
  };

  static getActiveUsers = async (days) => {
    const daysAgo = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000);
    const activeUsers = await Presence.find({
      last_active: { $gte: daysAgo },
      status: true,
    });
    const NoActiveUsers = activeUsers.length;
    return {
      active_users: NoActiveUsers,
      active_users_formatted: NoActiveUsers.toLocaleString('en-US'),
    };
  };

  static getRecentTransactions = async (page, pageSize, prefixBundleId) => {
    let results = await Transaction.aggregate([
      {
        $match: {
          $or: [{ bundle_id: { $regex: prefixBundleId } }, { store_id: { $regex: prefixBundleId } }],
        },
      },
      {
        $unwind: '$transactions',
      },
      {
        $project: {
          _id: 0,
          transactionId: '$transactions.transactionId',
          originalTransactionId: '$transactions.originalTransactionId',
          webOrderLineItemId: '$transactions.webOrderLineItemId',
          bundleId: '$transactions.bundleId',
          storefront: '$transactions.storefront',
          productId: '$transactions.productId',
          totalCost: {
            $multiply: [{ $divide: ['$transactions.price', 1000] }, '$transactions.quantity'],
          },
          subscriptionGroupIdentifier: '$transactions.subscriptionGroupIdentifier',
          purchaseDate: '$transactions.purchaseDate',
          originalPurchaseDate: '$transactions.originalPurchaseDate',
          expiresDate: '$transactions.expiresDate',
          quantity: '$transactions.quantity',
          type: '$transactions.type',
          currency: '$transactions.currency',
          price: { $divide: ['$transactions.price', 1000] },
          offerType: '$transactions.offerType',
          offerDiscountType: '$transactions.offerDiscountType',
        },
      },
      {
        $sort: { purchaseDate: -1 },
      },
      {
        $skip: pageSize * (page - 1),
      },
      {
        $limit: pageSize,
      },
    ]);

    const totalResults = await Transaction.aggregate([
      {
        $match: {
          $or: [{ bundle_id: { $regex: prefixBundleId } }, { store_id: { $regex: prefixBundleId } }],
        },
      },
      {
        $unwind: '$transactions',
      },
    ]);

    let data = await Promise.all(
      results.map(async (result) => {
        let purchaseDate = formatDate(new Date(result.purchaseDate));
        let expiresDate = result.expiresDate ? formatDate(new Date(result.expiresDate)) : 'Unlimited time';
        let originalPurchaseDate = formatDate(new Date(result.originalPurchaseDate));
        let totalCost = await rateService.currencyConvert(result.currency, result.totalCost);
        let totalCostStr = `$${totalCost.toFixed(2)}`;
        return { ...result, purchaseDate, expiresDate, originalPurchaseDate, totalCostStr };
      }),
    );

    const totalPages = Math.ceil(totalResults.length / pageSize);

    return { totalResults: totalResults.length, totalPages, page, pageSize, data };
  };
}

export default paymentService;
