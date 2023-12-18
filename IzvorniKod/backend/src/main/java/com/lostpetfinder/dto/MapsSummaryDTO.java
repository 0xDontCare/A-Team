package com.lostpetfinder.dto;

import java.util.stream.Collectors;

public class MapsSummaryDTO {
    private String place;
    private String postalCode;
    private String county;

    public MapsSummaryDTO() {}

    public MapsSummaryDTO(MapsApiResponseDTO mapsApiResponseDTO) {

        int i = 0;
        while (true) {
            var tmp = mapsApiResponseDTO.getResults().get(i);

            try {
                this.postalCode = tmp.getAddress_components().stream()
                        .filter(addressComponent -> addressComponent.getTypes().contains("postal_code"))
                        .toList()
                        .getFirst()
                        .getLong_name();
                this.place = tmp.getAddress_components().stream()
                        .filter(addressComponent -> addressComponent.getTypes().contains("route"))
                        .toList()
                        .getFirst()
                        .getLong_name();
                this.county = tmp.getAddress_components().stream()
                        .filter(addressComponent -> addressComponent.getTypes().contains("locality"))
                        .toList()
                        .getFirst()
                        .getLong_name();
            } catch (Exception e) {
                i++;
                continue;
            }
            break;
        }
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
