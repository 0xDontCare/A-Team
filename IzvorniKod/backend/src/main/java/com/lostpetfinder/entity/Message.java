package com.lostpetfinder.entity;

import com.lostpetfinder.entity.pkeys.MessagePK;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "messages")
public class Message {

    @EmbeddedId
    private MessagePK pk;

}
