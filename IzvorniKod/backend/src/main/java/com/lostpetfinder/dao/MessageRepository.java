package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Message;
import com.lostpetfinder.entity.pkeys.MessagePK;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, MessagePK> {

    // not sure if this works
    Optional<Message> findByPk(MessagePK pk);

    boolean existsByPkNot(MessagePK pk);

    // not sure if we need methods to return all messages regarding a specific location or image

}
