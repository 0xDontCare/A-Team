package com.lostpetfinder.service;

import com.lostpetfinder.dao.ImageRepository;
import com.lostpetfinder.entity.Image;
import com.lostpetfinder.entity.Pet;
import com.lostpetfinder.exception.FileUploadFailedException;
import com.lostpetfinder.exception.ImageNotSelectedException;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.nio.file.Paths;
import java.util.Optional;

@Service
public class ResourceService {

    private final ImageRepository imageRepository;

    public ResourceService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    private String generateFileName() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd-HHmmssSSS");
        return dateFormat.format(new Date());
    }

    public void addImages(List<MultipartFile> files, Pet pet) throws ImageNotSelectedException, FileUploadFailedException {
        if (files.isEmpty()) {
            throw new ImageNotSelectedException("Please select an image to upload.");
        }
        try {
            List<Image> imageList = new LinkedList<>();

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    throw new ImageNotSelectedException("Please select an image to upload.");
                }

                String originalFileName = file.getOriginalFilename();
                String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
                String newFileName = generateFileName() + extension;


                Image image = new Image();
                image.setPet(pet);
                image.setLinkToImage(newFileName);
                image.setData(file.getBytes());
                image.setContentType(file.getContentType());

                imageRepository.save(image);

            }
        } catch (IOException e) {
            e.printStackTrace();
            throw new FileUploadFailedException("File upload failed.");
        }
    }
    public Optional<Image> getFile(String linkToImage) {
        return imageRepository.findByLinkToImage(linkToImage);
    }

}
