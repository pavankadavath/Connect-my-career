const mongoose = require('mongoose');
const { Schema } = mongoose;

const CampusDriveSchema = new Schema({
  recruiterId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Recruiters', 
    required: true 
  },
  collegeCode:{
    type:String,
    required:true
  },
  collegeName: { 
    type: String, 
    required: true 
  },
  companyName: {
    type: String, 
    required: true 
  },
  
  companyImageUrl:{
    type: String,
    required: true
},
  eligibilityCriteria: {
    minCGPA: { 
      type: Number, 
      default: 6 
    },
    maxBacklogs: { 
      type: Number, 
      default: 0
    },
    graduationYear: { 
      type: Number, 
      required: true ,
      default:2025
    },
    allowedBranches: [{ 
      type: String 
    }]
  },
  jobDetails: {
    positionName: { 
      type: String, 
      required: true 
    },
    jobType: { 
      type: String, 
      required: true 
    },
    ctc: { 
      type: String, 
      required: true 
    },
    aboutJob: { 
      type: String, 
      required: true 
    },
    responsibilities: { 
      type: String, 
      required:true 
    }
  },
  selectionProcess: [{ 
    type: String 
  }],
  status: { 
    type: String, 
    enum: ['Upcoming', 'Ongoing', 'Completed'], 
    default: 'Upcoming' 
  },
  applicationDeadline: { 
    type: Date, 
    required:true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CampusDrive = mongoose.model('CampusDrives', CampusDriveSchema);
module.exports = CampusDrive;