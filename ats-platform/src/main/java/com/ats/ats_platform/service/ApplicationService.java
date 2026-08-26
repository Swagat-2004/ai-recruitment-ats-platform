package com.ats.ats_platform.service;

import com.ats.ats_platform.dto.ApplicationResponse;
import com.ats.ats_platform.entity.Application;
import com.ats.ats_platform.entity.ApplicationStatus;
import com.ats.ats_platform.entity.Job;
import com.ats.ats_platform.entity.User;
import com.ats.ats_platform.repository.ApplicationRepository;
import com.ats.ats_platform.exception.DuplicateApplicationException;
import com.ats.ats_platform.exception.UnauthorizedApplicationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository) {

        this.applicationRepository = applicationRepository;
    }

    public Application applyForJob(User candidate, Job job) {

        boolean alreadyApplied =
                applicationRepository.existsByCandidateIdAndJobId(
                        candidate.getId(),
                        job.getId()
                );

        if (alreadyApplied) {

            throw new DuplicateApplicationException(
                    "You have already applied for this job"
            );
        }

        Application application = new Application();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus(ApplicationStatus.APPLIED);

        return applicationRepository.save(application);
    }

    public List<ApplicationResponse> getApplicationsByJob(
            Long jobId) {

        List<Application> applications =
                applicationRepository.findByJobId(jobId);

        return applications.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<ApplicationResponse> getApplicationsByCandidate(
            Long candidateId) {

        List<Application> applications =
                applicationRepository.findByCandidateId(candidateId);

        return applications.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<ApplicationResponse> getApplicationsByRecruiter(
            String recruiterEmail) {

        List<Application> applications =
                applicationRepository.findByJobRecruiterEmail(
                        recruiterEmail
                );

        return applications.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public ApplicationResponse updateApplicationStatus(
            Long applicationId,
            ApplicationStatus status,
            String recruiterEmail) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                ));

        String applicationRecruiterEmail =
                application.getJob()
                        .getRecruiter()
                        .getEmail();

        if (!applicationRecruiterEmail.equals(recruiterEmail)) {

            throw new UnauthorizedApplicationException(
                    "You are not authorized to update this application"
            );
        }

        application.setStatus(status);

        Application updatedApplication =
                applicationRepository.save(application);

        return convertToResponse(updatedApplication);
    }

    private ApplicationResponse convertToResponse(
            Application application) {

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(application.getId());

        response.setCandidateId(
                application.getCandidate().getId()
        );

        response.setCandidateName(
                application.getCandidate().getName()
        );

        response.setCandidateEmail(
                application.getCandidate().getEmail()
        );

        response.setJobId(
                application.getJob().getId()
        );

        response.setJobTitle(
                application.getJob().getTitle()
        );

        response.setStatus(
                application.getStatus().name()
        );

        return response;
    }
}