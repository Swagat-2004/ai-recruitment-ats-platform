package com.ats.ats_platform.service;

import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.repository.JobRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        job.setCreatedAt(java.time.LocalDateTime.now());
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }
}