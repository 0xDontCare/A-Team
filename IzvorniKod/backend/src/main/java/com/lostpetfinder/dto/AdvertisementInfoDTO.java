package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;

public class AdvertisementInfoDTO {

    // not sending the image link for now
    private Long petId;
    private String petName;

    public AdvertisementInfoDTO(Long petId, String petName) {
        this.petId = petId;
        this.petName = petName;
    }

    public AdvertisementInfoDTO(Advertisement advertisement) {
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
