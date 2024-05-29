'use strict'
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

const DOCUMENT_NAME = 'Presence';
const COLLECTION_NAME = 'Presences';

const PaymentSchema = new mongoose.Schema({
    device_id: {
        type: ObjectId,
        ref: 'Device'
    },
    status: {
        type: Boolean,
        default: true,
    },
    last_active: {
        type: Date
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default mongoose.model(DOCUMENT_NAME, PaymentSchema);