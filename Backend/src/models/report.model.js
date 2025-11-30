import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toReportedNgo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['domestic_violence','harassment','assault',"stalking",'other'], required: true },
    description: { type: String },
    location: { type: String },
    urgencyLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    isVisibleToAllNgo: { type: Boolean, default: false },
    status: { type: String, enum: ['pending', 'reviewed', 'processing', 'resolved','rejected'], default: 'pending' },
    reasonForRejection: { type: String },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;