package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;

import java.time.LocalDateTime;

public class AdvertisementDetailsDTO {

    // add user info
    private String name;
    private String species;
    private String color;
    private Integer age;
    private String description;
    private LocalDateTime disappearanceDateTime; // potentially change the data type
    private String disappearanceLocation; // change the data type
    private String[] pictures; // potentially change the data type

    public AdvertisementDetailsDTO() {}

    // change the value for pictures property when possible
    public AdvertisementDetailsDTO(Advertisement advertisement) {
        this.name = advertisement.getPet().getName();
        this.species = advertisement.getPet().getSpecies();
        this.color = advertisement.getPet().getColor();
        this.age = advertisement.getPet().getAge();
        this.description = advertisement.getPet().getDescription();
        this.disappearanceDateTime = advertisement.getDisappearanceDateTime();
        this.disappearanceLocation = advertisement.getLocation();
        this.pictures = null;
    }

    public String getName() {
        return name;
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

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDisappearanceDateTime() {
        return disappearanceDateTime;
    }

    public String getDisappearanceLocation() {
        return disappearanceLocation;
    }

    public String[] getPictures() {
        return pictures;
    }
}
