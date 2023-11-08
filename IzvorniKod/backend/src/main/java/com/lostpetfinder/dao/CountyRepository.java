package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Communication;
import com.lostpetfinder.entity.County;
import com.lostpetfinder.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountyRepository extends JpaRepository<County, Long> {
    Optional<County> findByCountyId(Long countyId);

    boolean existsByCountyIdAndNameNot(Long countyId, String name);
}
