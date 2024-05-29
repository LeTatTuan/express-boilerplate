'use strict'
import { Environment } from "@apple/app-store-server-library";
import mongoose from "mongoose";

const DOCUMENT_NAME = 'Payment';
const COLLECTION_NAME = 'Payments';

const PaymentSchema = new mongoose.Schema({
    device_id: {
        type: Object,
        ref: 'Device'
    },
    transaction_id: {
        type: String
    },
    key: {
        type: String,
        required: true
    },
    ios: {
        type: Number,
        required: true,
        default: true
    },
    environment: {
        type: String,
        required: true,
        enum: Object.values(Environment),
    },
    bundle_id: {
        type: String,
        required: true,
        max: 255
    },
    price: {
        type: Object,
    },
    expires_date: {
        type: Number
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default mongoose.model(DOCUMENT_NAME, PaymentSchema);