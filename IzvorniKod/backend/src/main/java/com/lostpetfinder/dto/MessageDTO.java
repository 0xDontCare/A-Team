package com.lostpetfinder.dto;

import com.fasterxml.jackson.databind.ser.std.ObjectArraySerializer;
import com.lostpetfinder.utils.BASE64DecodedMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

public class MessageDTO {

    private Long id;
    private String senderUsername;
    private String senderEmail;
    private String senderPhoneNumber;
    private Long advertisementId;
    private String messageText;
    private Double disappearanceLocationLat;
    private Double disappearanceLocationLng;
    private String image;
    private List<String> linkToImage;

    public MessageDTO() {}

    public MessageDTO(Long id,
                      String senderUsername,
                      String senderEmail,
                      String senderPhoneNumber,
                      Long advertisementId,
                      String messageText,
                      Double disappearanceLocationLat,
                      Double disappearanceLocationLng,
                      String image,
                      List<String> linkToImage)
    {
        this.id = id;
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


    public Long getId() {
        return id;
    }
    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public void setAdvertisementId(Long advertisementId) {
        this.advertisementId = advertisementId;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public void setDisappearanceLocationLat(Double disappearanceLocationLat) {
        this.disappearanceLocationLat = disappearanceLocationLat;
    }

    public void setDisappearanceLocationLng(Double disappearanceLocationLng) {
        this.disappearanceLocationLng = disappearanceLocationLng;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setLinkToImage(List<String> linkToImage) {
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

    public String getImage() {
        return image;
    }

    public List<String> getLinkToImage() {
        return linkToImage;
    }

}


