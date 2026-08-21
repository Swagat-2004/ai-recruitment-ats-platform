package com.ats.ats_platform.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ats.ats_platform.entity.Application;
import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.entity.User;
import com.ats.ats_platform.service.ApplicationService;
import com.ats.ats_platform.repository.JobRepository;
import com.ats.ats_platform.repository.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
private final UserRepository userRepository;
private final JobRepository jobRepository;

public ApplicationController(
        ApplicationService applicationService,
        UserRepository userRepository,
        JobRepository jobRepository) {

    this.applicationService = applicationService;
    this.userRepository = userRepository;
    this.jobRepository = jobRepository;
}


    @PostMapping
public Application applyForJob(
        @RequestParam Long candidateId,
        @RequestParam Long jobId) {

    User candidate = userRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));

    Job job = jobRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    return applicationService.applyForJob(candidate, job);
}
}