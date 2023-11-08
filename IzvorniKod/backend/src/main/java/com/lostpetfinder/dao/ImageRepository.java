package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Communication;
import com.lostpetfinder.entity.County;
import com.lostpetfinder.entity.Image;
import com.lostpetfinder.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ImageRepository extends JpaRepository<Image, String> {
    Optional<Image> findByLinkToImage(String linkToImage);

    boolean existsByLinkToImageNot(String linkToImage);

    List<Image> findAllByPetId(Long petId);
}
