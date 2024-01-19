package com.lostpetfinder.dto;

import java.util.ArrayList;

public class MapsApiResponseDTO {
    private PlusCode plus_code;
    private ArrayList<Result> results;
    private String status;

    public PlusCode getPlus_code() {
        return plus_code;
    }

    public ArrayList<Result> getResults() {
        return results;
    }

    public String getStatus() {
        return status;
    }

    @Override
    public String toString() {
        return "MapsApiResponseDTO{" +
                "plus_code=" + plus_code +
                ", results=" + results +
                ", status='" + status + '\'' +
                '}';
    }

    public static class AddressComponent {
        private String long_name;
        private String short_name;
        private ArrayList<String> types;

        public String getLong_name() {
            return long_name;
        }

        public String getShort_name() {
            return short_name;
        }

        public ArrayList<String> getTypes() {
            return types;
        }

        @Override
        public String toString() {
            return "AddressComponent{" +
                    "long_name='" + long_name + '\'' +
                    ", short_name='" + short_name + '\'' +
                    ", types=" + types +
                    '}';
        }
    }

    public static class Bounds {
        private Northeast northeast;
        private Southwest southwest;

        public Northeast getNortheast() {
            return northeast;
        }

        public Southwest getSouthwest() {
            return southwest;
        }

        @Override
        public String toString() {
            return "Bounds{" +
                    "northeast=" + northeast +
                    ", southwest=" + southwest +
                    '}';
        }
    }

    public static class Geometry {
        private Location location;
        private String location_type;
        private Viewport viewport;
        private Bounds bounds;

        public Location getLocation() {
            return location;
        }

        public String getLocation_type() {
            return location_type;
        }

        public Viewport getViewport() {
            return viewport;
        }

        public Bounds getBounds() {
            return bounds;
        }

        @Override
        public String toString() {
            return "Geometry{" +
                    "location=" + location +
                    ", location_type='" + location_type + '\'' +
                    ", viewport=" + viewport +
                    ", bounds=" + bounds +
                    '}';
        }
    }

    public static class Location {
        private double lat;
        private double lng;

        public double getLat() {
            return lat;
        }

        public double getLng() {
            return lng;
        }

        @Override
        public String toString() {
            return "Location{" +
                    "lat=" + lat +
                    ", lng=" + lng +
                    '}';
        }
    }

    public static class Northeast {
        private double lat;
        private double lng;

        public double getLat() {
            return lat;
        }

        public double getLng() {
            return lng;
        }

        @Override
        public String toString() {
            return "Northeast{" +
                    "lat=" + lat +
                    ", lng=" + lng +
                    '}';
        }
    }

    public static class PlusCode {
        private String compound_code;
        private String global_code;

        public String getCompound_code() {
            return compound_code;
        }

        public String getGlobal_code() {
            return global_code;
        }

        @Override
        public String toString() {
            return "PlusCode{" +
                    "compound_code='" + compound_code + '\'' +
                    ", global_code='" + global_code + '\'' +
                    '}';
        }
    }

    public static class Result {
        private ArrayList<AddressComponent> address_components;
        private String formatted_address;
        private Geometry geometry;
        private String place_id;
        private PlusCode plus_code;
        private ArrayList<String> types;

        public ArrayList<AddressComponent> getAddress_components() {
            return address_components;
        }

        public String getFormatted_address() {
            return formatted_address;
        }

        public Geometry getGeometry() {
            return geometry;
        }

        public String getPlace_id() {
            return place_id;
        }

        public PlusCode getPlus_code() {
            return plus_code;
        }

        public ArrayList<String> getTypes() {
            return types;
        }

        @Override
        public String toString() {
            return "Result{" +
                    "address_components=" + address_components +
                    ", formatted_address='" + formatted_address + '\'' +
                    ", geometry=" + geometry +
                    ", place_id='" + place_id + '\'' +
                    ", plus_code=" + plus_code +
                    ", types=" + types +
                    '}';
        }
    }

    public static class Southwest {
        private double lat;
        private double lng;

        public double getLat() {
            return lat;
        }

        public double getLng() {
            return lng;
        }

        @Override
        public String toString() {
            return "Southwest{" +
                    "lat=" + lat +
                    ", lng=" + lng +
                    '}';
        }
    }

    public static class Viewport {
        private Northeast northeast;
        private Southwest southwest;

        public Northeast getNortheast() {
            return northeast;
        }

        public Southwest getSouthwest() {
            return southwest;
        }

        @Override
        public String toString() {
            return "Viewport{" +
                    "northeast=" + northeast +
                    ", southwest=" + southwest +
                    '}';
        }
    }
}
