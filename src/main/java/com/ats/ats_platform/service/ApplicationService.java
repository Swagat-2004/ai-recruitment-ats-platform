package com.ats.ats_platform.service;

import com.ats.ats_platform.entity.Application;
import com.ats.ats_platform.repository.ApplicationRepository;
import org.springframework.stereotype.Service;
import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.entity.User;
import com.ats.ats_platform.entity.ApplicationStatus;

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
}