package com.lostpetfinder;

import com.lostpetfinder.dao.CountyRepository;
import com.lostpetfinder.dao.LocationRepository;
import com.lostpetfinder.dao.PlaceRepository;
import com.lostpetfinder.dto.MapsApiResponseDTO;
import com.lostpetfinder.dto.MapsSummaryDTO;
import com.lostpetfinder.entity.County;
import com.lostpetfinder.entity.Image;
import com.lostpetfinder.entity.Location;
import com.lostpetfinder.entity.Place;
import com.lostpetfinder.service.LocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
public class LocationServiceUnitTests {

    @Mock
    private CountyRepository countyRepository;

    @Mock
    private PlaceRepository placeRepository;

    @Mock
    private LocationRepository locationRepository;

    private LocationService locationService;

    @BeforeEach
    public void setup() {
        locationService = new LocationService(countyRepository, placeRepository, locationRepository) {
            @Override
            protected MapsSummaryDTO getLocInfoFromAPI(double latitude, double longitude) {
                MapsSummaryDTO dto = new MapsSummaryDTO();
                dto.setLocationName("Zagreb");
                dto.setPlace("Zagreb");
                dto.setCounty("Grad Zagreb");
                dto.setPostalCode("10000");
                return dto;
            }
        };
    }

    @Test
    @DisplayName("Location objects are retrieved successfully")
    public void testGetLocation() {
        when(countyRepository.existsByName(anyString())).thenReturn(true);
        when(countyRepository.findByName(anyString())).thenReturn(Optional.of(new County("Grad Zagreb")));
        when(placeRepository.existsByZipCode(anyLong())).thenReturn(true);
        when(placeRepository.findByZipCode(anyLong())).thenReturn(Optional.of(
                new Place(10000L, "Zagreb", new County("Grad Zagreb"))
        ));

        locationService.getLocation(45.815399, 15.966568);

        Mockito.verify(locationRepository, times(1)).save(any(Location.class));

    }
}
