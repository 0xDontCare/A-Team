package com.lostpetfinder.dto;

public class AdvertisementInfoDTO {

    // not sending the image link for now
    private Long petId;
    private String petName;

    public AdvertisementInfoDTO(Long petId, String petName) {
        this.petId = petId;
        this.petName = petName;
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
