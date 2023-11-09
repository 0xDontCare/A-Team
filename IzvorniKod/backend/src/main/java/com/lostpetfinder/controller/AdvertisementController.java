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

    // potentially change the data type of the returned value to Advertisement?
    @GetMapping("/{petID}")
    public AdvertisementInfoDTO seeAdvertisementInfo(@PathVariable("petID") long petId) {
        return advertisementService.seeAdvertisementInfo(petId);
    }

    // potentially change the data type of the returned value to Advertisement?
    @PutMapping("/")
    public AdvertisementInfoDTO changeAdvertisement(@RequestBody AdvertisementInfoDTO dto) {
        return advertisementService.changeAdvertisement(dto);
    }

    // potentially change the data type of the returned value to Advertisement?
    @DeleteMapping("/{petID}")
    public AdvertisementInfoDTO deleteAdvertisement(@PathVariable("petID") Long petId) {
        return advertisementService.deleteAdvertisement(petId);
    }

}
