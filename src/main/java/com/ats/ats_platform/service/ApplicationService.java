package com.ats.ats_platform.service;

import com.ats.ats_platform.dto.ApplicationResponse;
import com.ats.ats_platform.entity.Application;
import com.ats.ats_platform.entity.ApplicationStatus;
import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.entity.User;
import com.ats.ats_platform.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application applyForJob(User candidate, Job job) {

        Application application = new Application();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus(ApplicationStatus.APPLIED);

        return applicationRepository.save(application);
    }

    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {

        List<Application> applications =
                applicationRepository.findByJobId(jobId);

        return applications.stream()
                .map(application -> {
                    ApplicationResponse response = new ApplicationResponse();

                    response.setId(application.getId());
                    response.setCandidateId(application.getCandidate().getId());
                    response.setJobId(application.getJob().getId());
                    response.setStatus(application.getStatus().name());

                    return response;
                })
                .toList();
    }
}