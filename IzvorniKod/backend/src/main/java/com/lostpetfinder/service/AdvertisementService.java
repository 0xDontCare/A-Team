package com.lostpetfinder.service;

import com.lostpetfinder.dao.*;
import com.lostpetfinder.dto.*;
import com.lostpetfinder.entity.*;
import com.lostpetfinder.exception.ImageNotSelectedException;
import com.lostpetfinder.exception.FileUploadFailedException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.List;

@Service
public class AdvertisementService {
    private final LocationRepository locationRepository;
    private final PlaceRepository placeRepository;
    private final CountyRepository countyRepository;
    private final ResourceService resourceService;
    private final UserService userService;
    private final AdvertisementRepository advertisementRepository;
    private final PetRepository petRepository;
    private final ImageRepository imageRepository;

    public AdvertisementService(ResourceService resourceService,
                                UserService userService,
                                AdvertisementRepository advertisementRepository,
                                PetRepository petRepository,
                                ImageRepository imageRepository,
                                LocationRepository locationRepository,
                                PlaceRepository placeRepository,
                                CountyRepository countyRepository) {
        this.resourceService = resourceService;
        this.userService = userService;
        this.advertisementRepository = advertisementRepository;
        this.petRepository = petRepository;
        this.imageRepository = imageRepository;
        this.locationRepository = locationRepository;
        this.placeRepository = placeRepository;
        this.countyRepository = countyRepository;
    }

    // adjust later so it only returns active ads
    public List<AdvertisementSummaryDTO> getAllAdvertisements(CategoryEnum category) {
        return advertisementRepository
                .findAll()
                .stream()
                .filter(ad -> ad.getAdState() == AdStateEnum.ACTIVE && ad.getCategory() == category)
                .map(ad -> new AdvertisementSummaryDTO(
                        ad.getAdvertisementId(),
                        ad.getPet().getName(),
                        ad.getPet().getSpecies(),
                        ad.getPet().getBreed(),
                        ad.getPet().getColor(),
                        ad.getPet().getAge(),
                        ad.getUser() instanceof Registered ? null : ((Shelter) ad.getUser()).getName(),
                        ad.getUser().getUsername()))
                .toList();
    }

    public ResponseEntity<Object> addNewAdvertisement(AddAdvertisementDTO dto) {

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

        RestTemplate restTemplate = new RestTemplate();
        String apiKey = "AIzaSyDXFHTxz_VlUm8TRSq9D_6xsiIuLiUf3vs";

        int radius = 100;

        ResponseEntity<MapsApiResponseDTO> mapsApiResponse = restTemplate.exchange(
                "https://maps.googleapis.com/maps/api/geocode/json?key=" +
                        apiKey +
                        "&latlng=" +
                        dto.getDisappearanceLocationLat() +
                        "," +
                        dto.getDisappearanceLocationLng() +
                        "&radius=" + radius +
                        "&language=hr",
                HttpMethod.GET, null, MapsApiResponseDTO.class);

        MapsSummaryDTO mapsSummaryDTO = new MapsSummaryDTO(mapsApiResponse.getBody());


        County newCounty = new County(mapsSummaryDTO.getCounty());
        if (!countyRepository.existsByName(newCounty.getName())) {
            newCounty = countyRepository.save(newCounty);
        } else {
            newCounty = countyRepository.findByName(newCounty.getName()).orElseThrow();
        }

        Place newPlace = new Place(
                Long.parseLong(mapsSummaryDTO.getPostalCode())
                , mapsSummaryDTO.getPlace(),
                newCounty
        );

        if (!placeRepository.existsByZipCode(newPlace.getZipCode())) {
            newPlace = placeRepository.save(newPlace);
        } else {
            newPlace = placeRepository.findByZipCode(newPlace.getZipCode()).orElseThrow();
        }

        Location newLocation = new Location(
                dto.getDisappearanceLocationLat(),
                dto.getDisappearanceLocationLng(),
                mapsSummaryDTO.getLocationName(),
                newPlace
        );

        newLocation = locationRepository.save(newLocation);

        User user = userService.LoggedUser().orElseThrow();
        CategoryEnum category = CategoryEnum.LJUBIMAC_JE_NESTAO_I_ZA_NJIM_SE_TRAGA;
        Advertisement newAdvertisement = new Advertisement(
                pet,
                user,
                category,
                dto.getDisappearanceDateTime(),
                newLocation
        );
        newAdvertisement = advertisementRepository.save(newAdvertisement);
        return ResponseEntity.ok().header(HttpHeaders.LOCATION, "/api/advertisements/" + newAdvertisement.getAdvertisementId()).body("Advertisement added successfully!");
    }

    // add the exception handling / completely remove it
    public AdvertisementDetailsDTO seeAdvertisementInfo(Long adId) {
        Advertisement advertisement = advertisementRepository
                .findByAdvertisementId(adId)
                .orElseThrow();
        Long petId = advertisement.getPet().getPetId();
        List<Image> images = imageRepository.findAllByPetPetId(petId);
        return new AdvertisementDetailsDTO(advertisement, images);
    }

    // change the data type of the return value
    public ResponseEntity<Object> changeAdvertisement(long adId, AddAdvertisementDTO dto) {
        if (!advertisementRepository.existsByAdvertisementId(adId)) {
            throw new NoSuchElementException();
        }
        Location newLocation = null;
        if (dto.getDisappearanceLocationLng() != null && dto.getDisappearanceLocationLat() != null) {
            RestTemplate restTemplate = new RestTemplate();
            String apiKey = "AIzaSyDXFHTxz_VlUm8TRSq9D_6xsiIuLiUf3vs";

            int radius = 100;

            ResponseEntity<MapsApiResponseDTO> mapsApiResponse = restTemplate.exchange(
                    "https://maps.googleapis.com/maps/api/geocode/json?key=" +
                            apiKey +
                            "&latlng=" +
                            dto.getDisappearanceLocationLat() +
                            "," +
                            dto.getDisappearanceLocationLng() +
                            "&radius=" + radius +
                            "&language=hr",
                    HttpMethod.GET, null, MapsApiResponseDTO.class);

            MapsSummaryDTO mapsSummaryDTO = new MapsSummaryDTO(mapsApiResponse.getBody());


            County newCounty = new County(mapsSummaryDTO.getCounty());
            if (!countyRepository.existsByName(newCounty.getName())) {
                newCounty = countyRepository.save(newCounty);
            } else {
                newCounty = countyRepository.findByName(newCounty.getName()).orElseThrow();
            }

            Place newPlace = new Place(
                    Long.parseLong(mapsSummaryDTO.getPostalCode())
                    , mapsSummaryDTO.getPlace(),
                    newCounty
            );

            if (!placeRepository.existsByZipCode(newPlace.getZipCode())) {
                newPlace = placeRepository.save(newPlace);
            } else {
                newPlace = placeRepository.findByZipCode(newPlace.getZipCode()).orElseThrow();
            }

            newLocation = new Location(
                    dto.getDisappearanceLocationLat(),
                    dto.getDisappearanceLocationLng(),
                    mapsSummaryDTO.getLocationName(),
                    newPlace
            );

            newLocation = locationRepository.save(newLocation);

        }

        Advertisement changedAdvertisement = advertisementRepository.findByAdvertisementId(adId).orElseThrow();
        changedAdvertisement.updateAdvertisement(dto, newLocation);
        advertisementRepository.save(changedAdvertisement);

        Pet changedPet = changedAdvertisement.getPet();
        petRepository.save(changedPet);

        if (dto.getImagesToDelete() != null)
            imageRepository.deleteAll(dto.getImagesToDelete().stream().filter(Objects::nonNull).toList());

        try {
            if (dto.getImages() != null) resourceService.addImages(dto.getImages(), changedPet);
        } catch (ImageNotSelectedException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (FileUploadFailedException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }

        return ResponseEntity.ok().body("Advertisement changed successfully!");
    }

    // adjust later so it only changes the 'deleted' flag in the Advertisement entity
    public void deleteAdvertisement(Long adId) {
        Advertisement advertisement = advertisementRepository.findByAdvertisementId(adId).orElseThrow();
        // advertisementRepository.delete(advertisement);
        // imageRepository.deleteAll(imageRepository.findAllByPetPetId(advertisement.getPet().getPetId()));
        // petRepository.delete(advertisement.getPet());

        advertisement.setAdState(AdStateEnum.DELETED);
        advertisementRepository.save(advertisement);
    }

}