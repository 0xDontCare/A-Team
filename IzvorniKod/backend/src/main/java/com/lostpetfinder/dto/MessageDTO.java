package com.lostpetfinder.dto;

import org.springframework.web.multipart.MultipartFile;

public class MessageDTO {

    private String senderUsername;
    private Long advertisementId;
    private String messageText;
    private String location; // change the data type later
    private MultipartFile image;

    public MessageDTO(String senderUsername, Long advertisementId, String messageText, String location, MultipartFile image) {
        this.senderUsername = senderUsername;
        this.advertisementId = advertisementId;
        this.messageText = messageText;
        this.location = location;
        this.image = image;
    }


    public String getSenderUsername() {
        return senderUsername;
    }

    public Long getAdvertisementId() {
        return advertisementId;
    }

    public String getMessageText() {
        return messageText;
    }

    public String getLocation() {
        return location;
    }

    public MultipartFile getImage() {
        return image;
    }
}
