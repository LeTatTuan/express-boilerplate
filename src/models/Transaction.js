'use strict'
import mongoose from "mongoose";

const DOCUMENT_NAME = 'Transaction';
const COLLECTION_NAME = 'Transactions';

const PaymentSchema = new mongoose.Schema({
    bundle_id: {
        type: String,
        require: true,
    },
    transactions: {
        type: Array,
        required: true,
    },
    count: Number
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default mongoose.model(DOCUMENT_NAME, PaymentSchema);