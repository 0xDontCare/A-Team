package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet, Long> {
    Optional<Pet> findByPetId(Long petId);

    boolean existsByPetIdAndNameNot(Long petId, String name);

    List<Pet> findAllBySpecies(String species);

    List<Pet> findAllByName(String name);

    List<Pet> findAllByColorAnd(String color);
}
