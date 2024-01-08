package com.lostpetfinder.entity;

import com.lostpetfinder.entity.pkeys.MessagePK;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Entity
@Table(name = "messages")
public class Message {

    @EmbeddedId
    private MessagePK id;

    @Column
    @Size(max = 1000)
    private String text;

    @ManyToOne
    @JoinColumn(name = "coordinates")
    private Location location;

    @OneToOne
    private Image image;

    @ManyToOne
    @JoinColumn(name = "advertisementId", nullable = false)
    private Advertisement advertisement;

    public Message() {}

    public Message(User messageSender,
                   String text,
                   Location location,
                   Advertisement advertisement,
                   Image image)
    {
        this.id = new MessagePK(messageSender, LocalDateTime.now(ZoneOffset.UTC));
        this.text = text;
        this.location = location;
        this.image = image;
        this.advertisement = advertisement;
    }


    public MessagePK getId() {
        return id;
    }

    public void setId(MessagePK id) {
        this.id = id;
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

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    public Advertisement getAdvertisement() {
        return advertisement;
    }

    public void setAdvertisement(Advertisement advertisement) {
        this.advertisement = advertisement;
    }
}
