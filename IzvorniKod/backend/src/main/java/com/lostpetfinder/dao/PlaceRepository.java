package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    Optional<Place> findByZipCode(Long zipCode);
    boolean existsByZipCodeAndNameNot(Long zipCode, String name);
    boolean existsByZipCode(Long zipCode);
    List<Place> findAllByCountyCountyId(Long countyId);
    boolean existsByName(String name);
    Optional<Place> findByName(String name);
}
