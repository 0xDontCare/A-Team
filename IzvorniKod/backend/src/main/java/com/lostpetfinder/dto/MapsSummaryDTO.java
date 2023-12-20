package com.lostpetfinder.dto;

import com.lostpetfinder.utils.SortLocationByDistance;

import java.util.stream.Collectors;

public class MapsSummaryDTO {
    private String locationName;
    private String place;
    private String postalCode;
    private String county;

    public MapsSummaryDTO() {}

    public MapsSummaryDTO(Double lat, Double lng, MapsApiResponseDTO mapsApiResponseDTO) {

        int i = 0;

        this.locationName = this.postalCode = this.place = this.county = null;

        SortLocationByDistance.sortLocationByDistance(lat, lng, mapsApiResponseDTO);

        while (true) {
            MapsApiResponseDTO.Result tmp;
            try {
                 tmp = mapsApiResponseDTO.getResults().get(i);
            } catch (Exception e) {
                break; // throw exception that no results were found
                // request manually from user
            }

            try {
                if (this.locationName == null)
                    this.locationName = tmp.getAddress_components().stream()
                            .filter(addressComponent -> addressComponent.getTypes().contains("route"))
                            .toList()
                            .getFirst()
                            .getLong_name();
            } catch (Exception e) {}

            try {
                if(this.postalCode == null)
                    this.postalCode = tmp.getAddress_components().stream()
                            .filter(addressComponent -> addressComponent.getTypes().contains("postal_code"))
                            .toList()
                            .getFirst()
                            .getLong_name();

                if (this.place == null)
                    this.place = tmp.getAddress_components().stream()
                            .filter(addressComponent -> addressComponent.getTypes().contains("locality") && addressComponent.getTypes().contains("political"))
                            .toList()
                            .getFirst()
                            .getLong_name();
                if (this.place.equals("Zagreb"))
                    this.county = "Grad Zagreb";
                else {
                    if (this.county == null)
                        this.county = tmp.getAddress_components().stream()
                                .filter(addressComponent -> addressComponent.getTypes().contains("administrative_area_level_1"))
                                .toList()
                                .getFirst()
                                .getLong_name();
                }
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

    public String getLocationName() {
        return locationName;
    }
}
