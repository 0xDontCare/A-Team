package com.lostpetfinder.controller;

import com.lostpetfinder.dto.AddAdvertisementDTO;
import com.lostpetfinder.dto.AdvertisementDetailsDTO;
import com.lostpetfinder.dto.AdvertisementSummaryDTO;
import com.lostpetfinder.service.AdvertisementService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/advertisements")
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    public AdvertisementController(AdvertisementService advertisementService) {
        this.advertisementService = advertisementService;
    }

    @GetMapping
    public List<AdvertisementSummaryDTO> getAllAdvertisements() {
        return advertisementService.getAllAdvertisements();
    }

    // potentially change the data type of the returned value to summary/details?

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Object> addNewAdvertisement(@ModelAttribute AddAdvertisementDTO dto) {
        return advertisementService.addNewAdvertisement(dto);
    }

    @GetMapping("/{adId}")
    public AdvertisementDetailsDTO seeAdvertisementInfo(@PathVariable("adId") long adId) {
        return advertisementService.seeAdvertisementInfo(adId);
    }

    // potentially just return nothing? i don't see any point in returning anything
    @PutMapping("/{petId}")
    public AdvertisementDetailsDTO changeAdvertisement(@PathVariable("petId") long petId,
                                                   @RequestBody AddAdvertisementDTO dto) {
        return advertisementService.changeAdvertisement(petId, dto);
    }

    // potentially just return nothing? i don't see any point in returning anything
    @DeleteMapping("/{petId}")
    public void deleteAdvertisement(@PathVariable("petId") Long petId) {
        advertisementService.deleteAdvertisement(petId);
    }

}
