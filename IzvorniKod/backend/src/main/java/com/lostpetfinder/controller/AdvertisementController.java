package com.lostpetfinder.controller;

import com.lostpetfinder.dto.PetInfoDTO;
import com.lostpetfinder.entity.Advertisement;
import com.lostpetfinder.dto.AdvertisementInfoDTO;
import com.lostpetfinder.service.AdvertisementService;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/advertisements")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    public AdvertisementController(AdvertisementService advertisementService) {
        this.advertisementService = advertisementService;
    }

    @GetMapping
    public List<AdvertisementInfoDTO> getAllAdvertisements() {
        return advertisementService.getAllAdvertisements();
    }

    // potentially change the data type of the returned value to AdvertisementInfoDTO?
    @PostMapping
    public Advertisement addNewAdvertisement(@RequestBody PetInfoDTO dto) {
        return advertisementService.addNewAdvertisement(dto);
    }

    // change the data type of the returned value to something appropriate
    @GetMapping("/{petID}")
    public void seeAdvertisementInfo(@PathVariable Long petId) {
        // return advertisementService.seeAdvertisementInfo(petId)
    }

    // change the data type of the returned value to something appropriate
    @PutMapping("/{petID}")
    public void changeAdvertisement(@PathVariable Long petId) {
        // return advertisementService.changeAdvertisement(petId)
    }

    // change the data type of the returned value to something appropriate
    @DeleteMapping("/{petID}")
    public void deleteAdvertisement() {
        // return advertisementService.deleteAdvertisement(petId)
    }

}
