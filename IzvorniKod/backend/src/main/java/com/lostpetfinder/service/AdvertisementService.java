package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.PetRepository;
import com.lostpetfinder.dto.AdvertisementDetailsDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Pet;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class AdvertisementService {

    private final AdvertisementRepository advertisementRepository;
    private final PetRepository petRepository;

    public AdvertisementService(AdvertisementRepository advertisementRepository, PetRepository petRepository) {
        this.advertisementRepository = advertisementRepository;
        this.petRepository = petRepository;
    }

    // adjust later so it only returns active ads
    public List<AdvertisementSummaryDTO> getAllAdvertisements() {
        return advertisementRepository
                .findAll()
                .stream()
                .map(Advertisement::getPet)
                .map(pet -> new AdvertisementSummaryDTO(pet.getPetId(), pet.getName()))
                .toList();
    }

    // potentially just return nothing? i don't see any point in returning anything
    public AdvertisementDetailsDTO addNewAdvertisement(AdvertisementDetailsDTO dto) {
        Pet newPet = petRepository.save(new Pet(dto));
        Advertisement newAdvertisement = new Advertisement(newPet, dto);
        return new AdvertisementDetailsDTO(advertisementRepository.save(newAdvertisement));
    }

    // add the exception handling / completely remove it
    public AdvertisementDetailsDTO seeAdvertisementInfo(Long petId) {
        Advertisement advertisement = advertisementRepository
                .findByPetPetId(petId)
                .orElseThrow();
        return new AdvertisementDetailsDTO(advertisement);
    }

    // potentially just return nothing? i don't see any point in returning anything
    // add the exception handling / completely remove it
    public AdvertisementDetailsDTO changeAdvertisement(long petId, AdvertisementDetailsDTO dto) {
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