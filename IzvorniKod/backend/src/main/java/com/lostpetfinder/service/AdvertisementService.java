package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.PetRepository;
import com.lostpetfinder.dto.PetInfoDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Pet;
import com.lostpetfinder.dto.AdvertisementInfoDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final PetRepository petRepository;

    public AdvertisementService(AdvertisementRepository advertisementRepository, PetRepository petRepository) {
        this.advertisementRepository = advertisementRepository;
        this.petRepository = petRepository;
    }

    // adjust later so it only returns active ads
    public List<AdvertisementInfoDTO> getAllAdvertisements() {
        return advertisementRepository
                .findAll()
                .stream()
                .map(Advertisement::getPet)
                .map(pet -> new AdvertisementInfoDTO(pet.getPetId(), pet.getName()))
                .toList();
    }

    // potentially change the data type of the returned value to AdvertisementInfoDTO?
    public Advertisement addNewAdvertisement(PetInfoDTO dto) {
        Pet newPet = petRepository.save(new Pet(dto));
        Advertisement newAdvertisement = new Advertisement(newPet, dto);
        return advertisementRepository.save(newAdvertisement);
    }

    public AdvertisementInfoDTO seeAdvertisementInfo(Long petId) {
        Advertisement advertisement = advertisementRepository.findAdvertisementByPetId(petId);

        if (advertisement != null) {
            return new AdvertisementInfoDTO(advertisement.getPet().getPetId(), advertisement.getPet().getName());
        } else {
            return null;
        }
    }

    public AdvertisementInfoDTO changeAdvertisement(Long petId, AdvertisementInfoDTO dto) {
        Advertisement advertisement = advertisementRepository.findAdvertisementByPetId(petId);

        if (advertisement != null) {
            // Update Advertisement entity with information from AdvertisementInfoDTO
            advertisement.setPetName(dto.getPetName());

            // Save the updated entity back to the database
            Advertisement updatedAdvertisement = advertisementRepository.save(advertisement);

            // Create and return the updated AdvertisementInfoDTO
            return new AdvertisementInfoDTO(updatedAdvertisement.getPetId(), updatedAdvertisement.getPetName());
        } else {
            System.out.println("Advertisement not found for petId: " + petId);
            return null;
        }
    }

    public AdvertisementInfoDTO deleteAdvertisement(Long advertisementId) {
        Advertisement advertisement = advertisementRepository.findById(advertisementId).orElse(null);

        if (advertisement != null) {
            advertisementRepository.delete(advertisement);
            System.out.println("Advertisement with id " + advertisementId + " has been deleted.");

            // Create and return AdvertisementInfoDTO with necessary information
            return new AdvertisementInfoDTO(advertisement.getPetId(), advertisement.getPetName());
        } else {
            System.out.println("Advertisement not found for id: " + advertisementId);
            return null;
        }
    }
}