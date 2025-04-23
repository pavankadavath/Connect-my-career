import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Navbar from '../Navbar';
import './index.css';
import { toast } from 'react-toastify';

function PostJob() {
  const { register, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (loading) return; // Prevent multiple submissions

    setLoading(true);
    try {
      const recruiter = JSON.parse(localStorage.getItem("recruiterInfo"));
      const job = {
        postedBy: recruiter?.recruiterId,
        companyName: recruiter?.companyName,
        companyImageUrl: recruiter?.companyImageUrl,
        positionName: data.positionName,
        jobType: data.jobType,
        lastDate: data.lastDate,
        aboutJob: data.aboutJob,
        minQualifications: data.minQualifications,
        responsibilities: data.responsibilities,
        ctc: data.ctc,
        postedOn: Date.now(),
      };

      const response = await fetch("/recruiter-api/postjob", {
        method: 'POST',
        body: JSON.stringify(job),
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to post job');
      }

      await response.json();

      toast.success('Job Posted Successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setValue('positionName', '');
      setValue('jobType', '');
      setValue('lastDate', '');
      setValue('minQualifications', '');
      setValue('aboutJob', '');
      setValue('responsibilities', '');
      setValue('ctc', '');
      clearErrors();
      
    } catch (error) {
      toast.error(error.message || 'Something went wrong!', {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <Navbar />
      <div className="post-job-form">
        <h2>Post a Job</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="positionName">Position Name</label>
            <input
              type="text"
              id="positionName"
              {...register('positionName', { required: '*Position Name is required' })}
              placeholder="Eg: Software Engineer II"
            />
            {errors.positionName && <span className="error">{errors.positionName.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              {...register('jobType', { required: '*Job Type is required' })}
            >
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
            </select>
            {errors.jobType && <span className="error">{errors.jobType.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastDate">Last Date to Apply</label>
            <input
              type="date"
              id="lastDate"
              {...register('lastDate', { required: '*Last Date to Apply is required' })}
            />
            {errors.lastDate && <span className="error">{errors.lastDate.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="minQualifications">Minimum Qualifications</label>
            <textarea
              id="minQualifications"
              {...register('minQualifications', { required: '*Minimum Qualifications are required' })}
              placeholder="Enter minimum qualifications..."
            ></textarea>
            {errors.minQualifications && <span className="error">{errors.minQualifications.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="aboutJob">About the Job</label>
            <textarea
              id="aboutJob"
              {...register('aboutJob', { required: '*About the Job is required' })}
              placeholder="Enter details about the job..."
            ></textarea>
            {errors.aboutJob && <span className="error">{errors.aboutJob.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="responsibilities">Responsibilities</label>
            <textarea
              id="responsibilities"
              {...register('responsibilities', { required: '*Responsibilities are required' })}
              placeholder="Enter job responsibilities..."
            ></textarea>
            {errors.responsibilities && <span className="error">{errors.responsibilities.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ctc">CTC</label>
            <input
              type="text"
              id="ctc"
              {...register('ctc', { required: '*CTC is required' })}
              placeholder="Eg: $80,000 - $100,000"
            />
            {errors.ctc && <span className="error">{errors.ctc.message}</span>}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job'}
            </button>
            <Link to="/home" className="btn btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
