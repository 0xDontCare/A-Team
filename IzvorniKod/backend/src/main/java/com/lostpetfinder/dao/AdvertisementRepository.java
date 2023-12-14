package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Advertisement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AdvertisementRepository extends JpaRepository<Advertisement, Long> {

    Optional<Advertisement> findByAdvertisementId(Long advertisementId);

    //Optional<Advertisement> findByCategoryCategoryId(Long categoryId);

    //boolean existsByCategoryCategoryIdNot(Long categoryId);

    boolean existsByPetPetIdNot(Long petId);

    boolean existsByAdvertisementId(Long advertisementId);

    // multiple advertisements for the same pet??
    Optional<Advertisement> findByPetPetId(Long petId);

    // ...

//    @Query("SELECT a FROM Advertisement a WHERE a.pet.petId = :petId")
//    Advertisement findAdvertisementByPetId(@Param("petId") Long petId);
}
