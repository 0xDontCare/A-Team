package com.lostpetfinder.dto;

import com.lostpetfinder.entity.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class AdvertisementDetailsDTO {

    private Long advertisementId;
    private String username;
    private String email;
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String shelterName;
    private CategoryEnum categoryDescription;
    private String petName;
    private String species;
    private String breed;
    private String color;
    private Integer age;
    private String petDescription;
    private LocalDateTime disappearanceDateTime; // potentially change the data type
    private String disappearanceLocation; // change the data type
    private Double disappearanceLocationLat;
    private Double disappearanceLocationLng;
    private List<String> images; // potentially change the data type

    public AdvertisementDetailsDTO() {}

    // change the value for pictures property when possible
    public AdvertisementDetailsDTO(Advertisement advertisement, List<Image> listOfImage) {
        User user = advertisement.getUser();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();
        if (user instanceof Registered) {
            this.firstName = ((Registered)user).getName();
            this.lastName = ((Registered)user).getSurname();
        } else {
            this.shelterName = ((Shelter)user).getName();
        }
        this.categoryDescription = advertisement.getCategory();
        this.advertisementId = advertisement.getAdvertisementId();
        this.petName = advertisement.getPet().getName();
        this.species = advertisement.getPet().getSpecies();
        this.breed = advertisement.getPet().getBreed();
        this.color = advertisement.getPet().getColor();
        this.age = advertisement.getPet().getAge();
        this.petDescription = advertisement.getPet().getDescription();
        this.disappearanceDateTime = advertisement.getDisappearanceDateTime();
        this.disappearanceLocation = advertisement.getLocation().getPlace().getName() + ", " +
                                     advertisement.getLocation().getPlace().getZipCode() + ", " +
                                     advertisement.getLocation().getPlace().getCounty().getName() + ", " +
                                     "Hrvatska"; // NEED TO ADD toString METHOD
        this.disappearanceLocationLat = advertisement.getLocation().getCoordinates().getLatitude();
        this.disappearanceLocationLng = advertisement.getLocation().getCoordinates().getLongitude();
        this.images = listOfImage.stream().map(Image::getLinkToImage).collect(Collectors.toList());
    }

    public Long getAdvertisementId() {
        return advertisementId;
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

    public List<String> getImages() {
        return images;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getShelterName() {
        return shelterName;
    }

    public CategoryEnum getCategoryDescription() {
        return categoryDescription;
    }

    public String getBreed() {
        return breed;
    }

    public Double getDisappearanceLocationLat() {
        return disappearanceLocationLat;
    }

    public Double getDisappearanceLocationLng() {
        return disappearanceLocationLng;
    }
}
