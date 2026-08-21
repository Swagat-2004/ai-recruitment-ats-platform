package com.ats.ats_platform.repository;

import com.ats.ats_platform.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

}