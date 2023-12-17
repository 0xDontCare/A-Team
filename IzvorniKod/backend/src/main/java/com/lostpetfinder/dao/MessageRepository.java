package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Message;
import com.lostpetfinder.entity.pkeys.MessagePK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, MessagePK> {

    // do we need the optional part?
    Optional<Message> findAllByAdvertisementAdvertisementId(Long advertisementId);

}
