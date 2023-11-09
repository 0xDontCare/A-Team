package com.lostpetfinder.service;

import com.lostpetfinder.dao.AdvertisementRepository;
import com.lostpetfinder.dao.PetRepository;
import com.lostpetfinder.dto.PetInfoDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.entity.Pet;
import com.lostpetfinder.dto.AdvertisementInfoDTO;
import org.springframework.stereotype.Service;
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

}