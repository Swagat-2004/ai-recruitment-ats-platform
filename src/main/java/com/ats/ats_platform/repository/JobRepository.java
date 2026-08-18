package com.ats.ats_platform.repository;

import com.ats.ats_platform.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

}