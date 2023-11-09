package com.lostpetfinder.dto;

import java.time.LocalDateTime;

public class PetInfoDTO {

    private String name;
    private String species;
    private String color;
    private Integer age;
    private String description;
    private LocalDateTime disappearanceDateTime; // potentially change the data type
    private String disappearanceLocation; // change the data type
    private String[] pictures; // potentially change the data type

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
