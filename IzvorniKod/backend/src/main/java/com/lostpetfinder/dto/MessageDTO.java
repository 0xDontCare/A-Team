package com.lostpetfinder.dto;

import org.springframework.web.multipart.MultipartFile;

public class MessageDTO {

    private String senderUsername;
    private Long advertisementId;
    private String messageText;
    private Double disappearanceLocationLat;
    private Double disappearanceLocationLng;
    private MultipartFile image;

    public MessageDTO(String senderUsername,
                      Long advertisementId,
                      String messageText,
                      Double disappearanceLocationLat,
                      Double disappearanceLocationLng,
                      MultipartFile image)
    {
        this.senderUsername = senderUsername;
        this.advertisementId = advertisementId;
        this.messageText = messageText;
        this.disappearanceLocationLat = disappearanceLocationLat;
        this.disappearanceLocationLng = disappearanceLocationLng;
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

    public Double getDisappearanceLocationLat() {
        return disappearanceLocationLat;
    }

    public Double getDisappearanceLocationLng() {
        return disappearanceLocationLng;
    }

    public MultipartFile getImage() {
        return image;
    }
}
