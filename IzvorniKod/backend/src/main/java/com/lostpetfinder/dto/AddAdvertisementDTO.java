package com.lostpetfinder.dto;

import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.CategoryEnum;
import com.lostpetfinder.entity.Image;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.crypto.Data;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

public class AddAdvertisementDTO {

    private String petName;
    private String species;
    private String breed;
    private String color;
    private Integer age;
    private String petDescription;
    private CategoryEnum category;
    private LocalDateTime disappearanceDateTime;
    private Double disappearanceLocationLat;
    private Double disappearanceLocationLng;
    private List<MultipartFile> images;

    // used in put method
    private List<Image> imagesToDelete;


    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getPetDescription() {
        return petDescription;
    }

    public void setPetDescription(String petDescription) {
        this.petDescription = petDescription;
    }

    public LocalDateTime getDisappearanceDateTime() {
        return disappearanceDateTime;
    }

    public void setDisappearanceDateTime(LocalDateTime disappearanceDateTime) {
        this.disappearanceDateTime = disappearanceDateTime;
    }

    public Double getDisappearanceLocationLat() {
        return disappearanceLocationLat;
    }

    public void setDisappearanceLocationLat(Double disappearanceLocationLat) {
        this.disappearanceLocationLat = disappearanceLocationLat;
    }

    public Double getDisappearanceLocationLng() {
        return disappearanceLocationLng;
    }

    public void setDisappearanceLocationLng(Double disappearanceLocationLng) {
        this.disappearanceLocationLng = disappearanceLocationLng;
    }

    public List<MultipartFile> getImages() {
        return images;
    }

    public void setImages(List<MultipartFile> images) {
        this.images = images;
    }

    public CategoryEnum getCategory() {
        return category;
    }

    public void setCategory(CategoryEnum category) {
        this.category = category;
    }

    public List<Image> getImagesToDelete() {
        return imagesToDelete;
    }

    public void setImagesToDelete(List<Image> imagesToDelete) {
        this.imagesToDelete = imagesToDelete;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }
}
