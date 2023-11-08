package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Location;
import com.lostpetfinder.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LocationRepository extends JpaRepository<Location, String> {
    Optional<Location> findByCoordinates(String coordinates);

    boolean existsByCoordinates(String coordinates);

    // option to get all locations where a pet was last seen?
    List<Location> findAllByPlace(Place place);
}
