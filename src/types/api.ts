export interface Container {
    id: number;
    volume: number | null;
}

export interface Truck {
    id: number;
    type: "trailer" | "truck";
    license_plate: string;
    containers: Container[];
}

export interface TruckPayload {
    type: "trailer" | "truck";
    licensePlate: string;
    containers: ContainerPayload[];
}

export interface ContainerPayload {
    volumeId: number;
}

export interface Volume {
    id: number;
    value: number;
}

export interface Driver {
    id: number;
    firstname: string;
    lastname: string;
}

export interface User {
    id: number;
    username: string;
    role: 'manager' | 'inspector';
    firstname: string;
    lastname: string;
}

export interface UserPayload {
    username: string;
    role: 'manager' | 'inspector';
    password: string;
    firstname: string;
    lastname: string;
}

export interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export interface LocationPayload {
    name: string;
    latitude: number;
    longitude: number;
}

export interface Distance {
    id: number;
    name: string;
    distance: number;
    location1: Location;
    location2: Location;
}

export interface DistancePayload {
    name: string;
    distance: number;
    locationId1: number;
    locationId2: number;
}

export interface Delivery {
    id: number;
    date: string;
    driverId: number;
    driverName: string;
    truck: DeliveryTruck;
    trailers: DeliveryTruck[];
};

export interface FuelDetail {
    id: number;
    fuelType: string;
    fuelTypeId: number;
    volume: number;
}

export interface DeliveryTruck {
    id: number;
    licensePlate: string;
    fuelDetails: FuelDetail[];
}
export interface DeliveryPayload {
    date: string;
    driverId: number;
    truck: {
        id: number;
        fuelDetails: FuelDetailPayload[];
    };
    trailers: {
        id: number;
        fuelDetails: FuelDetailPayload[];
    }[];
}

export interface FuelDetailPayload {
    containerId: number;
    fuelTypeId: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface FuelTypeDetail {
    id: number;
    name: string;
    volume: number;
}

export interface LocationDetail {
    id: number;
    name: string;
}

export interface ReportDelivery {
    date: string;
    tonKm: number;
    withLoadDistance: number;
    withoutLoadDistance: number;
    locationDetail: LocationDetail | null;
    fuelTypeDetail: FuelTypeDetail[];
}

export interface ReportResponse {
    deliveries: ReportDelivery[];
}