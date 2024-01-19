package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Image;
import com.lostpetfinder.entity.MessageImage;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Transactional
public interface MessageImageRepository extends JpaRepository<MessageImage, String> {

    List<MessageImage> findByMessageId (Long messageId);

    Optional<MessageImage> findByLinkToImage (String linkToImage);

}
