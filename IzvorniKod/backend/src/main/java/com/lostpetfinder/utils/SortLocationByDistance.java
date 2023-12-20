package com.lostpetfinder.utils;

import com.lostpetfinder.dto.MapsApiResponseDTO;

public class SortLocationByDistance {
    public static void sortLocationByDistance(Double lat, Double lng, MapsApiResponseDTO mapsApiResponseDTO) {
        mapsApiResponseDTO.getResults().sort((o1, o2) -> {
            Double lat1 = o1.getGeometry().getLocation().getLat();
            Double lng1 = o1.getGeometry().getLocation().getLng();
            Double lat2 = o2.getGeometry().getLocation().getLat();
            Double lng2 = o2.getGeometry().getLocation().getLng();

            Double distance1 = Math.sqrt(Math.pow(lat1 - lat, 2) + Math.pow(lng1 - lng, 2));
            Double distance2 = Math.sqrt(Math.pow(lat2 - lat, 2) + Math.pow(lng2 - lng, 2));

            return distance1.compareTo(distance2);
        });
    }
}
