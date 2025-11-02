export interface DeliveriesApiResponse {
    success: boolean;
    message: string;
    data: Delivery[];
}

export interface Delivery {
    id: number;
    date: string;
    driver: Driver;
    fromLocation: LocationPoint;
    toLocation: LocationPoint;
    truck: Vehicle;
    trailers: Vehicle;
    is_received: boolean;
}

export interface Driver {
    id: number;
    lastname: string;
    firstname: string;
    position: string;
    register: string;
    phone: number;
    truck_id: number;
}

export interface LocationPoint {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
}

export interface Vehicle {
    id: number;
    licensePlate: string;
    fuelDetails: FuelDetail[];
}

export interface FuelDetail {
    id: number;
    fuelType: string;
    fuelTypeId: number;
    volume?: number;
    containerId: number;
    density?: number | null;
}

export interface DeliveryUpsertPayload {
    date: string;
    driverId: number;
    fromLocationId: number;
    toLocationId: number;
    truck: DeliveryVehiclePayload;
    trailer?: DeliveryVehiclePayload;
}

export interface DeliveryVehiclePayload {
    id: number;
    fuelDetails: DeliveryFuelDetailPayload[];
}

export interface DeliveryFuelDetailPayload {
    containerId: number;
    fuelTypeId: number;
}

export interface DeliveryReceivePayload {
    outboundDistanceId: number;
    returnDistanceId: number;
    densityDetails: DensityDetail[];
}

export interface DensityDetail {
    detailId: number;
    density: number;
}

export interface DeliveryFuelDetail {
    id: number;
    fuelType: string;
    fuelTypeId: number;
    volume?: number;
    containerId: number;
    density?: number | null;
}