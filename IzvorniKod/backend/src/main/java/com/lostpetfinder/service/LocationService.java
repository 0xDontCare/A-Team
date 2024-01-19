package com.lostpetfinder.service;

import com.lostpetfinder.dao.CountyRepository;
import com.lostpetfinder.dao.LocationRepository;
import com.lostpetfinder.dao.PlaceRepository;
import com.lostpetfinder.dto.MapsApiResponseDTO;
import com.lostpetfinder.dto.MapsSummaryDTO;
import com.lostpetfinder.entity.County;
import com.lostpetfinder.entity.Location;
import com.lostpetfinder.entity.Place;
import org.asynchttpclient.AsyncHttpClientState;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;


@Service
public class LocationService {

    private final CountyRepository countyRepository;
    private final PlaceRepository placeRepository;
    private final LocationRepository locationRepository;

    public LocationService(CountyRepository countyRepository,
                           PlaceRepository placeRepository,
                           LocationRepository locationRepository)
    {
        this.countyRepository = countyRepository;
        this.placeRepository = placeRepository;
        this.locationRepository = locationRepository;
    }

    protected MapsSummaryDTO getLocInfoFromAPI(double latitude, double longitude) {

//        RestTemplate restTemplate = new RestTemplate();
        String apiKey = "AIzaSyDXFHTxz_VlUm8TRSq9D_6xsiIuLiUf3vs";

        int radius = 10000;

//        ResponseEntity<MapsApiResponseDTO> mapsApiResponse = restTemplate.exchange(
//                "https://maps.googleapis.com/maps/api/geocode/json?key=" +
//                        apiKey +
//                        "&latlng=" +
//                        latitude +
//                        "," +
//                        longitude +
//                        "&radius=" + radius +
//                        "&language=hr",
//                HttpMethod.GET, null, MapsApiResponseDTO.class);

        HttpClient httpClient = HttpClients.createDefault();

        String url = "https://maps.googleapis.com/maps/api/geocode/json?key=" +
                apiKey +
                "&latlng=" +
                latitude +
                "," +
                longitude +
                "&radius=" + radius +
                "&language=hr";

        HttpGet httpGet = new HttpGet(url);

        MapsApiResponseDTO mapsApiResponseDTO = null;
        try {
            // Execute the GET request
            HttpResponse response = httpClient.execute(httpGet);

            // Get the response code
            //int statusCode = response.getStatusLine().getStatusCode();
            //System.out.println("Response Code: " + statusCode);

            // Get the response entity
            HttpEntity entity = response.getEntity();

            // Read the response content
            if (entity != null) {
                String responseBody = EntityUtils.toString(entity);
                ObjectMapper objectMapper = new ObjectMapper();
                mapsApiResponseDTO = objectMapper.readValue(responseBody, MapsApiResponseDTO.class);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new MapsSummaryDTO(latitude, longitude, mapsApiResponseDTO);

    }

    public Location getLocation(double latitude, double longitude) {

        MapsSummaryDTO mapsSummaryDTO = getLocInfoFromAPI(latitude, longitude);

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
                latitude,
                longitude,
                mapsSummaryDTO.getLocationName(),
                newPlace
        );

        return locationRepository.save(newLocation);
    }
}
