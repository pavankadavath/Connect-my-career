
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Campus Drive Application Schema
const CampusDriveApplicationSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  campusDriveId: {
    type: Schema.Types.ObjectId,
    ref: 'CampusDrives',
    required: true
  },
  recruiterId: {
    type: Schema.Types.ObjectId,
    ref: 'Recruiters',
    required: true
  },
  collegeCode: {
    type: String,
    required: true
  },
  applicationStatus: {
    type: String,
    enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'],
    default: 'Applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const CampusDriveApplication = mongoose.model('CampusDriveApplications', CampusDriveApplicationSchema);
module.exports = CampusDriveApplication;