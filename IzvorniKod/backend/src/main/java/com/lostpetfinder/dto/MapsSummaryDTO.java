package com.lostpetfinder.dto;

import java.util.stream.Collectors;

public class MapsSummaryDTO {
    private String place;
    private String postalCode;
    private String county;

    public MapsSummaryDTO() {}

    public MapsSummaryDTO(MapsApiResponseDTO mapsApiResponseDTO) {
        this.place = mapsApiResponseDTO.getResults().getFirst().getAddress_components().stream().filter(addressComponent -> addressComponent.getTypes().contains("route")).toList().getFirst().getLong_name();
        this.postalCode = mapsApiResponseDTO.getResults().getFirst().getAddress_components().stream().filter(addressComponent -> addressComponent.getTypes().contains("postal_code")).toList().getFirst().getLong_name();
        this.county = mapsApiResponseDTO.getResults().getFirst().getAddress_components().stream().filter(addressComponent -> addressComponent.getTypes().contains("locality")).toList().getFirst().getLong_name();
    }

    public String getPlace() {
        return place;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getCounty() {
        return county;
    }
}
