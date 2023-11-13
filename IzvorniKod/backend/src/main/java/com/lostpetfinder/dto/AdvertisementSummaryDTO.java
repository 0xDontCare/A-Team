package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;

public class AdvertisementSummaryDTO {

    // not sending the image link for now
    private Long adId;
    private String petName;

    public AdvertisementSummaryDTO(Long adId, String petName) {
        this.adId = adId;
        this.petName = petName;
    }

    public AdvertisementSummaryDTO(Advertisement advertisement) {
        this.adId = advertisement.getPet().getPetId();
        this.petName = advertisement.getPet().getName();
    }

    public Long getAdId() {
        return adId;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }
}
