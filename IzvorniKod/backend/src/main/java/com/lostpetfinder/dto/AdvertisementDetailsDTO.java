package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Category;

import java.time.LocalDateTime;

public class AdvertisementDetailsDTO {

    // add user info
    private String petName;
    private String species;
    private String color;
    private Integer age;
    private String petDescription;
    private LocalDateTime disappearanceDateTime; // potentially change the data type
    private String disappearanceLocation; // change the data type
    private String[] pictures; // potentially change the data type

    public AdvertisementDetailsDTO() {}

    // change the value for pictures property when possible
    public AdvertisementDetailsDTO(Advertisement advertisement) {
        this.petName = advertisement.getPet().getName();
        this.species = advertisement.getPet().getSpecies();
        this.color = advertisement.getPet().getColor();
        this.age = advertisement.getPet().getAge();
        this.petDescription = advertisement.getPet().getDescription();
        this.disappearanceDateTime = advertisement.getDisappearanceDateTime();
        this.disappearanceLocation = advertisement.getLocation();
        this.pictures = null;
    }

    public String getPetName() {
        return petName;
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

    public String getPetDescription() {
        return petDescription;
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
