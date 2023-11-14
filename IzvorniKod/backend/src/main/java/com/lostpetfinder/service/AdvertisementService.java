package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.CategoryRepository;
import com.lostpetfinder.dao.ImageRepository;
import com.lostpetfinder.dao.PetRepository;
import com.lostpetfinder.dto.AddAdvertisementDTO;
import com.lostpetfinder.dto.AdvertisementDetailsDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Category;
import com.lostpetfinder.entity.Pet;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import com.lostpetfinder.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.lostpetfinder.entity.Image;
import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AdvertisementService {

    private final UserService userService;
    private final AdvertisementRepository advertisementRepository;
    private final PetRepository petRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;

    public AdvertisementService(UserService userService, AdvertisementRepository advertisementRepository, PetRepository petRepository, CategoryRepository categoryRepository, ImageRepository imageRepository) {
        this.userService = userService;
        this.advertisementRepository = advertisementRepository;
        this.petRepository = petRepository;
        this.categoryRepository = categoryRepository;
        this.imageRepository = imageRepository;
    }

    // adjust later so it only returns active ads
    public List<AdvertisementSummaryDTO> getAllAdvertisements() {
        return advertisementRepository
                .findAll()
                .stream()
                .map(e -> new AdvertisementSummaryDTO(e.getAdvertisementId(), e.getPet().getName()))
                .toList();
    }

    private String generateFileName() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd-HHmmssSSS");
        return dateFormat.format(new Date());
    }

    // potentially just return nothing? i don't see any point in returning anything
    public ResponseEntity<Object> addNewAdvertisement(AddAdvertisementDTO dto) {
        List<String> linktoImageList = new LinkedList<>();
        List<MultipartFile> files = dto.getImages();
        if (files.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select an image to upload.");
        }
        try {
            // Get the root directory of your static folder
            String rootDirectory = System.getProperty("user.dir") + "/src/main/resources/static/";

            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    return ResponseEntity.badRequest().body("Please select an image to upload.");
                }

                String originalFileName = file.getOriginalFilename();
                String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
                String newFileName = generateFileName() + extension;
                String pathname = rootDirectory + newFileName;
                linktoImageList.add(newFileName);

                // Save each file to the static folder
                file.transferTo(new File(pathname));
            }

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("File upload failed.");
        }

        // one Advertisement = one Pet
        Pet pet = petRepository.save(new Pet(dto));
        for (String linkToImage : linktoImageList) {
            Image image = new Image(linkToImage, pet);
            imageRepository.save(image);
        }
        User user = userService.LoggedUser().orElseThrow();
        Category category = new Category("DEFAULT_VALUE");
        categoryRepository.save(category);
        Advertisement newAdvertisement = new Advertisement(pet,user,category,dto.getDisappearanceDateTime(),dto.getDisappearanceLocation());

        return new ResponseEntity<>(new AdvertisementDetailsDTO(advertisementRepository.save(newAdvertisement)), HttpStatus.OK);
    }

    // add the exception handling / completely remove it
    public AdvertisementDetailsDTO seeAdvertisementInfo(Long adId) {
        Advertisement advertisement = advertisementRepository
                .findByAdvertisementId(adId)
                .orElseThrow();
        return new AdvertisementDetailsDTO(advertisement);
    }

    // potentially just return nothing? i don't see any point in returning anything
    // add the exception handling / completely remove it
    public AdvertisementDetailsDTO changeAdvertisement(long petId, AddAdvertisementDTO dto) {
        if (!advertisementRepository.existsByPetPetIdNot(petId)) {
            throw new NoSuchElementException();
        }
        Advertisement changedAdvertisement = advertisementRepository.findByPetPetId(petId).orElseThrow();
        changedAdvertisement.updateAdvertisement(dto);
        return new AdvertisementDetailsDTO(advertisementRepository.save(changedAdvertisement));
    }

    // adjust later so it only changes the 'deleted' flag in the Advertisement entity
    // add the exception handling
    public void deleteAdvertisement(Long petId) {
        Advertisement advertisement = advertisementRepository.findByPetPetId(petId).orElseThrow();
        advertisementRepository.delete(advertisement);
        petRepository.delete(advertisement.getPet());
    }

}