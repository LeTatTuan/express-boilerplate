import { SuccessResponse } from "@/response/success.response.js";
import paymentService from "@/services/payment.service";

const paymentController = {
    getActiveTrials: async (req, res) => {
        new SuccessResponse({
            message: 'Active Trials',
            metadata: await paymentService.getActiveTrials()
        }).send(res);
    },

    getActiveSubs: async (req, res) => {
        new SuccessResponse({
            message: 'Active Subs',
            metadata: await paymentService.getActiveSubs()
        }).send(res);
    },

    getRevenues: async (req, res) => {
        new SuccessResponse({
            message: 'Revenue',
            metadata: await paymentService.getRevenues()
        }).send(res);
    },

    getNewCustomers: async (req, res) => {
        new SuccessResponse({
            message: 'New Customers',
            metadata: await paymentService.getNewCustomers()
        }).send(res);
    },

    getActiveUsers: async (req, res) => {
        new SuccessResponse({
            message: 'Active Users',
            metadata: await paymentService.getActiveUsers()
        }).send(res);
    },
}
export default paymentController;