package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;

public class AdvertisementSummaryDTO {

    // not sending the image link for now
    private Long petId;
    private String petName;

    public AdvertisementSummaryDTO(Long petId, String petName) {
        this.petId = petId;
        this.petName = petName;
    }

    public AdvertisementSummaryDTO(Advertisement advertisement) {
        this.petId = advertisement.getPet().getPetId();
        this.petName = advertisement.getPet().getName();
    }

    public Long getPetId() {
        return petId;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }
}
