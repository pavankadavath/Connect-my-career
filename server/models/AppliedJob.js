const mongoose = require('mongoose');
const { Schema } = mongoose;

const AppliedJobSchema = new Schema({
    userId:{
        type: String,
        required: true
    },
    jobId:{
        type: String,
        required: true
    },
    recruiterId:{
        type: String,
        required: true
    },
    // isCampusDrive:{
    //     type: Boolean,
    //     default:false,
    //     required:true,
    // },
    // collegeCode:{
    //     type:String,
    //     required:function(){return this.isCampusDrive},
    // },
    status:{
        type: String,
        enum: ['Applied', 'Shortlisted', 'Rejected', 'Selected'],
        default: 'Applied'
    },
    appliedOn:{
        type:Date,
        required:true
    }
});
const AppliedJob = mongoose.model('AppliedJobs', AppliedJobSchema);
module.exports = AppliedJob;