package com.ats.ats_platform.service;

import com.ats.ats_platform.dto.JobResponse;
import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.entity.User;
import com.ats.ats_platform.repository.JobRepository;
import com.ats.ats_platform.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public JobResponse createJob(
            Job job,
            String recruiterEmail) {

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        job.setRecruiter(recruiter);
        job.setCreatedAt(LocalDateTime.now());

        Job savedJob = jobRepository.save(job);

        return convertToResponse(savedJob);
    }

    public List<JobResponse> getAllJobs() {

        return jobRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private JobResponse convertToResponse(Job job) {

        JobResponse response = new JobResponse();

        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setLocation(job.getLocation());
        response.setSalary(job.getSalary());
        response.setEmploymentType(job.getEmploymentType());
        response.setCreatedAt(job.getCreatedAt());

        if (job.getRecruiter() != null) {

            response.setRecruiterId(
                    job.getRecruiter().getId()
            );

            response.setRecruiterName(
                    job.getRecruiter().getName()
            );

            response.setRecruiterEmail(
                    job.getRecruiter().getEmail()
            );

            response.setRecruiterRole(
                    job.getRecruiter().getRole().name()
            );
        }

        return response;
    }
}