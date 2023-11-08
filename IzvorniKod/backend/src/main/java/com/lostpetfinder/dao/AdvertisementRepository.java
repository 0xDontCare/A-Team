package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {
    Optional<Advertisement> findByCategoryCategoryId(Long categoryId);

    boolean existsByCategoryCategoryIdNot(Long categoryId);

    // multiple advertisements for the same pet??
    List<Advertisement> findAllByPetPetId(Long petId);

    // ...


}
