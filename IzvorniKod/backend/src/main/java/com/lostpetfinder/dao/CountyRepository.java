package com.lostpetfinder.dao;


import com.lostpetfinder.entity.County;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountyRepository extends JpaRepository<County, Long> {
    Optional<County> findByCountyId(Long countyId);

    boolean existsByCountyIdAndNameNot(Long countyId, String name);

    boolean existsByName(String name);

    Optional<County> findByName(String name);

}
