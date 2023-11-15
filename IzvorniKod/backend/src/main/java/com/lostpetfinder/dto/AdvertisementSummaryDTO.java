package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;

public class AdvertisementSummaryDTO {

    // not sending the image link for now
    private final Long adId;
    private final String petName;

    public AdvertisementSummaryDTO(Long adId, String petName) {
        this.adId = adId;
        this.petName = petName;
    }

    public Long getAdId() {
        return adId;
    }

    public String getPetName() {
        return petName;
    }
}
