package com.lostpetfinder.entity;

import com.lostpetfinder.entity.pkeys.MessagePK;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "messages")
public class Message {

    @EmbeddedId
    private MessagePK pk;

    @Column(nullable = false)
    @Size(max = 1000)
    private String messageText;

    @ManyToOne
    @JoinColumn(name = "coordinates")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "linkToImage")
    private Image image;

    public Message() {}

    public Message(MessagePK pk, String messageText, Location location, Image image) {
        this.pk = pk;
        this.messageText = messageText;
        this.location = location;
        this.image = image;
    }

    public MessagePK getPk() {
        return pk;
    }

    public void setPk(MessagePK pk) {
        this.pk = pk;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
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
}
