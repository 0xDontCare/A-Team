package com.lostpetfinder.dto;

import java.time.LocalDateTime;

public class PetInfoDTO {

    private String species;
    private String name;
    private LocalDateTime disappearanceDateTime; // potentially change the data type
    private String disappearanceLocation; // change the data type
    private String color;
    private int age;
    private String description;
    private String[] pictures; // potentially change the data type

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getDisappearanceDateTime() {
        return disappearanceDateTime;
    }

    public void setDisappearanceDateTime(LocalDateTime disappearanceDateTime) {
        this.disappearanceDateTime = disappearanceDateTime;
    }

    public String getDisappearanceLocation() {
        return disappearanceLocation;
    }

    public void setDisappearanceLocation(String disappearanceLocation) {
        this.disappearanceLocation = disappearanceLocation;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String[] getPictures() {
        return pictures;
    }

    public void setPictures(String[] pictures) {
        this.pictures = pictures;
    }
}
