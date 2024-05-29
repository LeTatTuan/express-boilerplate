'use strict'
import { config } from "dotenv";
import mongoose from "mongoose";

const DOCUMENT_NAME = 'Project';
const COLLECTION_NAME = 'Projects';

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255
    },
    keys: {
        bundle_id: {
            type: String,
            required: true,
            unique: true,
        },
        app_apple_id: {
            type: String,
        },
        shared_secret: {
            type: String,
        }
    },
    type: {
        type: String,
        enum: ['ios', 'android'],
        default: 'ios',
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

export default mongoose.model(DOCUMENT_NAME, Schema);