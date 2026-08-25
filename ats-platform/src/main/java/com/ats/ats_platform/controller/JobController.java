package com.ats.ats_platform.controller;

import com.ats.ats_platform.dto.JobResponse;
import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.service.JobService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public JobResponse createJob(
            @RequestBody Job job,
            Authentication authentication) {

        String recruiterEmail = authentication.getName();

        return jobService.createJob(
                job,
                recruiterEmail
        );
    }

   @GetMapping
public List<JobResponse> getAllJobs() {
    return jobService.getAllJobs();
}

@GetMapping("/my")
public List<JobResponse> getMyJobs(
        Authentication authentication) {

    String recruiterEmail = authentication.getName();

    return jobService.getMyJobs(recruiterEmail);
}
}