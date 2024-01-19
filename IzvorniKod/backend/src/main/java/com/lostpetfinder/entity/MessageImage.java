package com.lostpetfinder.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Type;

import javax.annotation.Nullable;

@Entity
@Table(name = "message_images")
public class MessageImage {

    // better option than String?
    @Id
    @Size(max = 500)
    private String linkToImage;

    @Lob
    private byte[] data;

    private String contentType;

    @ManyToOne
    @JoinColumn(name = "id")
    private Message message;

    public MessageImage() {}

    public MessageImage(String linkToImage, byte[] data, String contentType, Message message) {
        this.linkToImage = linkToImage;
        this.data = data;
        this.contentType = contentType;
        this.message = message;
    }

    public void setLinkToImage(String linkToImage) {
        this.linkToImage = linkToImage;
    }

    public String getLinkToImage() {
        return linkToImage;
    }
    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }
}


