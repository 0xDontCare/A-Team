package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;

public class AdvertisementSummaryDTO {

    // not sending the image link for now
    private final Long adId;
    private final String petName;
    private final String username;

    public AdvertisementSummaryDTO(Long adId, String petName, String username) {
        this.adId = adId;
        this.petName = petName;
        this.username = username;
    }

    public Long getAdId() {
        return adId;
    }

    public String getPetName() {
        return petName;
    }

    public String getUsername() {
        return username;
    }
}
