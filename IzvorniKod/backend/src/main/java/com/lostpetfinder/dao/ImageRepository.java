package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Image;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Transactional
public interface ImageRepository extends JpaRepository<Image, String> {
    Optional<Image> findByLinkToImage(String linkToImage);

    boolean existsByLinkToImageNot(String linkToImage);

    List<Image> findAllByPetPetId(Long petId);
}
