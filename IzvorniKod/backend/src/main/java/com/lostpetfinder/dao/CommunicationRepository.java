package com.lostpetfinder.dao;

import com.lostpetfinder.entity.Communication;
import com.lostpetfinder.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommunicationRepository extends JpaRepository<Communication, Message> {

    // not sure about this
    Optional<Communication> findByMessage(Message message);

    boolean existsByMessageNot(Message message);

    List<Communication> findAllByPetId(Long petId);
}
