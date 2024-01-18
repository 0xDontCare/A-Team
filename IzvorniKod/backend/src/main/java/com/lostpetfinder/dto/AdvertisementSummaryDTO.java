package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;

public class AdvertisementSummaryDTO {

    // not sending the image link for now
    private final Long adId;
    private final String petName;
    private final String username;
    private final String species;
    private final String breed;
    private final String color;
    private final Integer age;
    private final String shelterName;
    private final String imageLink;


    public AdvertisementSummaryDTO(Long adId, String petName, String species,String breed, String color, Integer age, String shelterName, String username, String imageLink) {
        this.adId = adId;
        this.petName = petName;
        this.username = username;
        this.species = species;
        this.breed = breed;
        this.color = color;
        this.age = age;
        this.shelterName = shelterName;
        this.imageLink = imageLink;
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

    public String getSpecies() {
        return species;
    }

    public String getColor() {
        return color;
    }

    public Integer getAge() {
        return age;
    }

    public String getShelterName() {
        return shelterName;
    }

    public String getBreed() {
        return breed;
    }
    public String getImageLink() {
        return imageLink;
    }
}
