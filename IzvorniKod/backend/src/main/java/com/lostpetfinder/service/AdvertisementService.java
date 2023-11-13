package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.CategoryRepository;
import com.lostpetfinder.dao.PetRepository;
import com.lostpetfinder.dto.AdvertisementDetailsDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Category;
import com.lostpetfinder.entity.Pet;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import com.lostpetfinder.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AdvertisementService {

    private final UserService userService;
    private final AdvertisementRepository advertisementRepository;
    private final PetRepository petRepository;
    private final CategoryRepository categoryRepository;

    public AdvertisementService(UserService userService, AdvertisementRepository advertisementRepository, PetRepository petRepository, CategoryRepository categoryRepository) {
        this.userService = userService;
        this.advertisementRepository = advertisementRepository;
        this.petRepository = petRepository;
        this.categoryRepository = categoryRepository;
    }

    // adjust later so it only returns active ads
    public List<AdvertisementSummaryDTO> getAllAdvertisements() {
        return advertisementRepository
                .findAll()
                .stream()
                .map(e -> new AdvertisementSummaryDTO(e.getAdvertisementId(), e.getPet().getName()))
                .toList();
    }

    // potentially just return nothing? i don't see any point in returning anything
    public AdvertisementDetailsDTO addNewAdvertisement(AdvertisementDetailsDTO dto) {
        // one Advertisement = one Pet
        Pet pet = petRepository.save(new Pet(dto));
        User user = userService.LoggedUser().orElseThrow();
        Category category = new Category("DEFAULT_VALUE");
        categoryRepository.save(category);
        Advertisement newAdvertisement = new Advertisement(pet,user,category,dto.getDisappearanceDateTime(),dto.getDisappearanceLocation());

        return new AdvertisementDetailsDTO(advertisementRepository.save(newAdvertisement));
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