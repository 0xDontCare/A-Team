package com.lostpetfinder.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "images")
public class Image {

    // better option than String?
    @Id
    @Size(max = 500)
    private String linkToImage;

    private String contentType;

    @Lob
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "petId",nullable = false)
    private Pet pet;

    public Image() {}

    public Image(String linkToImage, Pet pet) {
        this.linkToImage = linkToImage;
        this.pet = pet;
    }

    public void setLinkToImage(String linkToImage) {
        this.linkToImage = linkToImage;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public String getLinkToImage() {
        return linkToImage;
    }

    public Pet getPet() {
        return pet;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
}


