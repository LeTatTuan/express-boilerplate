import Device from "@/models/Device";
import Payment from "@/models/Payment";
import Presence from "@/models/Presence";
import Project from "@/models/Project";
import Transaction from "@/models/Transaction";


class paymentService {
    static getActiveTrials = async (prefix_bundle_id = 'com.lutech.ios.themepack') => {
        const thirtyDaysAgo = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)).getTime();

        const result = await Transaction.aggregate([
            {
                $match: {
                    bundle_id: {
                        $regex: prefix_bundle_id
                    }
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
                                    { $gte: ['$$transaction.originalPurchaseDate', thirtyDaysAgo] }
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
    static getActiveSubs = async (prefix_bundle_id = 'com.lutech.ios.themepack') => {
        const thirtyDaysAgo = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)).getTime();

        const result = await Transaction.aggregate([
            {
                $match: {
                    bundle_id: {
                        $regex: prefix_bundle_id
                    }
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
                                    { $gte: ['$$transaction.originalPurchaseDate', thirtyDaysAgo] }
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

    static getRevenues = async (prefix_bundle_id = 'com.lutech.ios.themepack') => {
        const thirtyDaysAgo = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)).getTime();

        const result = await Transaction.aggregate([
            {
                $match: {
                    bundle_id: {
                        $regex: prefix_bundle_id
                    }
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
                                            { $gte: ['$$transaction.originalPurchaseDate', thirtyDaysAgo] }
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

    static getNewCustomers = async () => {
        const thirtyDaysAgo = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));

        const newCustomers = await Device.distinct('uuid', {
            createdAt: { $gte: thirtyDaysAgo }
        });
        const NoNewCustomers = newCustomers.length;
        return {
            new_customers: NoNewCustomers,
            new_customers_formatted: NoNewCustomers.toLocaleString('en-US')
        };
    }

    static getActiveUsers = async () => {
        const thirtyDaysAgo = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));
        const activeUsers = await Presence.find({
            last_active: { $gte: thirtyDaysAgo },
            status: true
        })
        const NoActiveUsers = activeUsers.length;
        return {
            active_users: NoActiveUsers,
            active_users_formatted: NoActiveUsers.toLocaleString('en-US')
        };
    }
};

export default paymentService;