package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.ImageRepository;
import com.lostpetfinder.dao.PetRepository;
import com.lostpetfinder.dto.AddAdvertisementDTO;
import com.lostpetfinder.dto.AdvertisementDetailsDTO;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import com.lostpetfinder.exception.ImageNotSelectedException;
import com.lostpetfinder.exception.FileUploadFailedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.List;

@Service
public class AdvertisementService {

    private final ResourceService resourceService;
    private final UserService userService;
    private final AdvertisementRepository advertisementRepository;
    private final PetRepository petRepository;
    private final ImageRepository imageRepository;

    public AdvertisementService(ResourceService resourceService,
                                UserService userService,
                                AdvertisementRepository advertisementRepository,
                                PetRepository petRepository,
                                ImageRepository imageRepository)
    {
        this.resourceService = resourceService;
        this.userService = userService;
        this.advertisementRepository = advertisementRepository;
        this.petRepository = petRepository;
        this.imageRepository = imageRepository;
    }

    // adjust later so it only returns active ads
    public List<AdvertisementSummaryDTO> getAllAdvertisements() {
        return advertisementRepository
                .findAll()
                .stream()
                .map(ad -> new AdvertisementSummaryDTO(ad.getAdvertisementId(), ad.getPet().getName()))
                .toList();
    }

    public ResponseEntity<Object> addNewAdvertisement(AddAdvertisementDTO dto) {
        List<String> linktoImageList;

        // one Advertisement = one Pet
        List<Image> listOfImages = new LinkedList<>();
        Pet pet = petRepository.save(new Pet(dto));

        try {
            resourceService.addImages(dto.getImages(), pet);
        } catch (ImageNotSelectedException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (FileUploadFailedException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }

        User user = userService.LoggedUser().orElseThrow();
        CategoryEnum category = CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA;
        Advertisement newAdvertisement = new Advertisement(
                pet,
                user,
                category,
                dto.getDisappearanceDateTime(),
                dto.getDisappearanceLocation()
        );

        return new ResponseEntity<>(
                new AdvertisementDetailsDTO(advertisementRepository.save(newAdvertisement), listOfImages)
                , HttpStatus.OK
        );
    }

    // add the exception handling / completely remove it
    public AdvertisementDetailsDTO seeAdvertisementInfo(Long adId) {
        Advertisement advertisement = advertisementRepository
                .findByAdvertisementId(adId)
                .orElseThrow();
        Long petId = advertisement.getPet().getPetId();
        List<Image> images = imageRepository.findAllByPetPetId(petId);
        return new AdvertisementDetailsDTO(advertisement,images);
    }

    // change the data type of the return value
    public AdvertisementDetailsDTO changeAdvertisement(long adId, AddAdvertisementDTO dto) {
        if (!advertisementRepository.existsByPetPetIdNot(adId)) {
            throw new NoSuchElementException();
        }
        Advertisement changedAdvertisement = advertisementRepository.findByAdvertisementId(adId).orElseThrow();
        changedAdvertisement.updateAdvertisement(dto);

        Long petId = changedAdvertisement.getPet().getPetId();
        List<Image> images = imageRepository.findAllByPetPetId(petId);
        return new AdvertisementDetailsDTO(advertisementRepository.save(changedAdvertisement),images);
    }

    // adjust later so it only changes the 'deleted' flag in the Advertisement entity
    public void deleteAdvertisement(Long petId) {
        Advertisement advertisement = advertisementRepository.findByPetPetId(petId).orElseThrow();
        advertisementRepository.delete(advertisement);
        petRepository.delete(advertisement.getPet());
    }

}