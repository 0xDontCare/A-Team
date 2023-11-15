package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public class AddAdvertisementDTO {

    private final String petName;
    private final String species;
    private final String color;
    private final Integer age;
    private final String petDescription;
    private final LocalDateTime disappearanceDateTime;
    private final String disappearanceLocation; // change the data type
    private final List<MultipartFile> images;

    public AddAdvertisementDTO(String petName,
                               String species,
                               String color,
                               Integer age,
                               String petDescription,
                               LocalDateTime disappearanceDateTime,
                               String disappearanceLocation,
                               List<MultipartFile> images)
    {
        this.petName = petName;
        this.species = species;
        this.color = color;
        this.age = age;
        this.petDescription = petDescription;
        this.disappearanceDateTime = disappearanceDateTime;
        this.disappearanceLocation = disappearanceLocation;
        this.images = images;
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

    public List<MultipartFile> getImages() {
        return images;
    }

}
