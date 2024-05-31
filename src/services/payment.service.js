import Device from "@/models/Device";
import Presence from "@/models/Presence";
import Transaction from "@/models/Transaction";
import { formatDate } from "@/utils/function.js";


class paymentService {
    static getActiveTrials = async (prefixBundleId, days) => {
        const daysAgo = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000)).getTime();

        const result = await Transaction.aggregate([
            {
                $match: {
                    $or: [
                        {
                            bundle_id: { $regex: prefixBundleId }
                        },
                        {
                            store_id: { $regex: prefixBundleId }
                        }
                    ]
                }
            },
            {
                $project: {
                    transactions: {
                        $filter: {
                            input: '$transactions',
                            as: 'transaction',
                            cond: {
                                $and: [
                                    { $eq: ['$$transaction.offerDiscountType', 'FREE_TRIAL'] },
                                    { $gte: ['$$transaction.purchaseDate', daysAgo] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    transactionCount: { $size: '$transactions' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalActiveTrials: { $sum: '$transactionCount' }
                }
            }
        ]);
        const totalActiveTrials = result.length > 0 ? result[0].totalActiveTrials : 0;
        return {
            active_trials: totalActiveTrials,
            active_trials_formatted: totalActiveTrials.toLocaleString('en-US')
        };
    }
    static getActiveSubs = async (prefixBundleId, days) => {
        const daysAgo = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000)).getTime();

        const result = await Transaction.aggregate([
            {
                $match: {
                    $or: [
                        {
                            bundle_id: { $regex: prefixBundleId }
                        },
                        {
                            store_id: { $regex: prefixBundleId }
                        }
                    ]
                }
            },
            {
                $project: {
                    transactions: {
                        $filter: {
                            input: '$transactions',
                            as: 'transaction',
                            cond: {
                                $and: [
                                    { $ne: ['$$transaction.offerDiscountType', 'FREE_TRIAL'] },
                                    { $gte: ['$$transaction.purchaseDate', daysAgo] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    transactionCount: { $size: '$transactions' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalActiveSubs: { $sum: '$transactionCount' }
                }
            }
        ]);

        const totalActiveSubs = result.length > 0 ? result[0].totalActiveSubs : 0;
        return {
            active_subs: totalActiveSubs,
            active_subs_formatted: totalActiveSubs.toLocaleString('en-US')
        };
    }

    static getRevenues = async (prefixBundleId, days) => {
        const daysAgo = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000)).getTime();

        const result = await Transaction.aggregate([
            {
                $match: {
                    $or: [
                        {
                            bundle_id: { $regex: prefixBundleId }
                        },
                        {
                            store_id: { $regex: prefixBundleId }
                        }
                    ]
                }
            },
            {
                $project: {
                    transactionsTotal: {
                        $map: {
                            input: {
                                $filter: {
                                    input: '$transactions',
                                    as: 'transaction',
                                    cond: {
                                        $and: [
                                            { $ne: ['$$transaction.offerDiscountType', 'FREE_TRIAL'] },
                                            { $gte: ['$$transaction.purchaseDate', daysAgo] }
                                        ]
                                    }
                                }
                            },
                            as: 'transaction',
                            in: {
                                $multiply: [
                                    { $divide: ['$$transaction.price', 1000] },
                                    '$$transaction.quantity'
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    totalRevenue: { $sum: '$transactionsTotal' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalRevenue' }
                }
            }
        ]);

        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        const formattedRevenue = totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        return {
            revenue: totalRevenue,
            revenue_formatted: formattedRevenue
        };
    }

    static getNewCustomers = async (days) => {
        const daysAgo = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000));

        const newCustomers = await Device.distinct('uuid', {
            createdAt: { $gte: daysAgo }
        });
        const NoNewCustomers = newCustomers.length;
        return {
            new_customers: NoNewCustomers,
            new_customers_formatted: NoNewCustomers.toLocaleString('en-US')
        };
    }

    static getActiveUsers = async (days) => {
        const daysAgo = new Date(new Date().getTime() - (days * 24 * 60 * 60 * 1000));
        const activeUsers = await Presence.find({
            last_active: { $gte: daysAgo },
            status: true
        })
        const NoActiveUsers = activeUsers.length;
        return {
            active_users: NoActiveUsers,
            active_users_formatted: NoActiveUsers.toLocaleString('en-US')
        };
    }

    static getRecentTransactions = async (page, pageSize) => {
        let results = await Transaction.aggregate([
            {
                $match: {
                    $or: [
                        { bundle_id: { $regex: 'com.lutech.ios.themepack' } },
                        { store_id: { $regex: 'com.lutech.ios.themepack' } }
                    ]
                }
            },
            {
                $unwind: "$transactions"
            },
            {
                $project: {
                    _id: 0,
                    transactionId: "$transactions.transactionId",
                    originalTransactionId: "$transactions.originalTransactionId",
                    bundleId: "$transactions.bundleId",
                    storefront: "$transactions.storefront",
                    productId: "$transactions.productId",
                    totalCost: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$transactions.quantity", 1000] },
                                    "$transactions.price"
                                ]
                            }, 2
                        ]
                    },
                    purchaseDate: "$transactions.purchaseDate",
                    expiresDate: "$transactions.expiresDate",
                    type: "$transactions.type"
                }
            },
            {
                $sort: { purchaseDate: -1 }
            },
            {
                $skip: pageSize * (page - 1)
            },
            {
                $limit: pageSize
            }
        ]);

        const totalResults = await Transaction.aggregate([
            {
                $match: {
                    $or: [
                        { bundle_id: { $regex: 'com.lutech.ios.themepack' } },
                        { store_id: { $regex: 'com.lutech.ios.themepack' } }
                    ]
                }
            },
            {
                $unwind: "$transactions"
            }]);

        let data = results.map(result => {
            let purchaseDate = formatDate(new Date(result.purchaseDate));
            let expiresDate = formatDate(new Date(result.expiresDate));
            let totalCostStr = `$${result.totalCost}`;
            return { ...result, purchaseDate, expiresDate, totalCostStr };
        });

        const totalPages = Math.ceil(totalResults.length / pageSize);

        return { totalResults: totalResults.length, totalPages, page, pageSize, data };
    }
};

export default paymentService;