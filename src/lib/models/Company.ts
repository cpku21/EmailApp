import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from 'mongoose';

import { SPECIALIZATIONS } from '@/lib/specializations';

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
      uppercase: true,
      match: /^[A-Z]{2}$/,
    },
    specializations: {
      type: [String],
      required: true,
      enum: SPECIALIZATIONS,
      validate: {
        validator: (values: string[]) => values.length > 0,
        message: 'At least one specialization is required.',
      },
    },
    note: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

companySchema.index({ specializations: 1, country: 1 });

export type Company = InferSchemaType<typeof companySchema>;

// Reuse the compiled model during Next.js development hot reloads.
const CompanyModel: Model<Company> =
  models.Company ?? model<Company>('Company', companySchema);

export default CompanyModel;
