package com.lostpetfinder.entity;

import com.lostpetfinder.entity.pkeys.MessagePK;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.LinkedList;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private MessagePK altId;

    @Column
    @Size(max = 1000)
    private String text;

    @ManyToOne
    @JoinColumn(name = "coordinates")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "advertisementId", nullable = false)
    private Advertisement advertisement;

    public Message() {}

    public Message(User messageSender,
                   String text,
                   Location location,
                   Advertisement advertisement)
    {
        this.altId = new MessagePK(messageSender, LocalDateTime.now(ZoneOffset.UTC));
        this.text = text;
        this.location = location;
        this.advertisement = advertisement;
    }


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public MessagePK getAltId() {
        return altId;
    }

    public void setAltId(MessagePK altId) {
        this.altId = altId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Advertisement getAdvertisement() {
        return advertisement;
    }

    public void setAdvertisement(Advertisement advertisement) {
        this.advertisement = advertisement;
    }
}
