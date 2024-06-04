'use strict';
import { Decimal128 } from 'mongodb';
import mongoose from 'mongoose';

const DOCUMENT_NAME = 'Rate';
const COLLECTION_NAME = 'Rates';

const RateSchema = new mongoose.Schema(
  {
    base_code: {
      type: String,
      required: true,
      default: 'USD',
    },
    currency_code: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export default mongoose.model(DOCUMENT_NAME, RateSchema);
