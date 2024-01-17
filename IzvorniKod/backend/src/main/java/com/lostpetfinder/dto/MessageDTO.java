package com.lostpetfinder.dto;

import org.springframework.web.multipart.MultipartFile;

public class MessageDTO {

    private String senderUsername;
    private String senderEmail;
    private String senderPhoneNumber;
    private Long advertisementId;
    private String messageText;
    private Double disappearanceLocationLat;
    private Double disappearanceLocationLng;
    private MultipartFile image;
    private String linkToImage;

    public MessageDTO(String senderUsername,
                      String senderEmail,
                      String senderPhoneNumber,
                      Long advertisementId,
                      String messageText,
                      Double disappearanceLocationLat,
                      Double disappearanceLocationLng,
                      MultipartFile image,
                      String linkToImage)
    {
        this.senderUsername = senderUsername;
        this.senderEmail = senderEmail;
        this.senderPhoneNumber = senderPhoneNumber;
        this.advertisementId = advertisementId;
        this.messageText = messageText;
        this.disappearanceLocationLat = disappearanceLocationLat;
        this.disappearanceLocationLng = disappearanceLocationLng;
        this.image = image;
        this.linkToImage = linkToImage;
    }


    public String getSenderUsername() {
        return senderUsername;
    }

    public Long getAdvertisementId() {
        return advertisementId;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderPhoneNumber() {
        return senderPhoneNumber;
    }

    public void setSenderPhoneNumber(String senderPhoneNumber) {
        this.senderPhoneNumber = senderPhoneNumber;
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

    public String getLinkToImage() {
        return linkToImage;
    }

}


