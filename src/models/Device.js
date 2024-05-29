'use strict'
import mongoose from "mongoose";

const DOCUMENT_NAME = 'Device';
const COLLECTION_NAME = 'Devices';

const PaymentSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true,
        max: 255
    },
    category: {
        type: String,
        required: true,
        max: 255
    },
    os: {
        type: Object,
        required: true,
        name: String,
        version: String
    },
    country: {
        type: String,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default mongoose.model(DOCUMENT_NAME, PaymentSchema);