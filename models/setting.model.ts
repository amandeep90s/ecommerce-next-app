import mongoose from 'mongoose';

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' },
  },
  { _id: false },
);

const settingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'app-settings' },
    storeName: { type: String, default: '' },
    storeEmail: { type: String, default: '' },
    storePhone: { type: String, default: '' },
    storeAddress: { type: String, default: '' },
    logoUrl: { type: String, default: '' },
    currency: { type: String, default: 'USD' },
    currencySymbol: { type: String, default: '$' },
    socialLinks: { type: socialLinksSchema, default: () => ({}) },
    seoMetaTitle: { type: String, default: '' },
    seoMetaDescription: { type: String, default: '' },
    maintenanceMode: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret: Record<string, unknown>) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema, 'settings');

export default Setting;
