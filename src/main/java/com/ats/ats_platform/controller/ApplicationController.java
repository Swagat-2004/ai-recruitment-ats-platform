package com.ats.ats_platform.controller;

import com.ats.ats_platform.dto.ApplicationResponse;
import com.ats.ats_platform.entity.Application;
import com.ats.ats_platform.entity.ApplicationStatus;
import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.entity.User;
import com.ats.ats_platform.repository.JobRepository;
import com.ats.ats_platform.repository.UserRepository;
import com.ats.ats_platform.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ApplicationResponse applyForJob(
            @RequestParam Long candidateId,
            @RequestParam Long jobId) {

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        Application application =
                applicationService.applyForJob(candidate, job);

        ApplicationResponse response = new ApplicationResponse();

        response.setId(application.getId());
        response.setCandidateId(
                application.getCandidate().getId()
        );
        response.setJobId(
                application.getJob().getId()
        );
        response.setStatus(
                application.getStatus().name()
        );

        return response;
    }

    @GetMapping("/job/{jobId}")
    public List<ApplicationResponse> getApplicationsByJob(
            @PathVariable Long jobId) {

        return applicationService.getApplicationsByJob(jobId);
    }

    @PutMapping("/{applicationId}/status")
    public ApplicationResponse updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {

        return applicationService.updateApplicationStatus(
                applicationId,
                status
        );
    }
}