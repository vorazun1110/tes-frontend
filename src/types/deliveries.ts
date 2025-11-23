import { Container, FuelType, Status } from "./api";

export interface DailyDeliveryResponse {
    result: DailyDelivery[];
    count: number;
}
export interface DailyDelivery {
    daily_delivery_id: number;
    driver: Driver;
    truck: Truck;
    trailer: Trailer;
    leave_status: string
    leave_status_id: number;
    deliveries: Delivery[]
}

export interface Delivery {
    id: number;
    manager_status_id: number;
    manager_status: string;
    driver: Driver;
    trailer: Trailer;
    from_location: LocationPoint;
    location_details: LocationDetail[];
}
export interface LocationDetail {
    location_id: number;
    location: LocationPoint;
    inspector_status: string;
    inspector_status_id: number;
    received_at: string | null;
    receiver: Receiver;
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
    location: string;
    district: string;
    type: "from" | "to";
}

export interface Truck {
    id: number;
    license_plate: string;
    status: string;
    status_id: number;
}

export interface Trailer {
    id: number;
    license_plate: string;
}

export interface Receiver {
    id: number;
    username: string;
    password: string;
    role: string;
    location_id: number | null;
    firstname: string;
    lastname: string;
}

export interface DailyData {
    truck_id: number;
    trailer_id?: number;
    driver_id: number;
}

/* Delivery actions */
export interface DeliveryUpsertPayload {
    date: string;
    fromLocationId: number;
    toLocationIds: number[];
    driverId: number;
    truck: VehiclePayload;
    trailer?: VehiclePayload;
    dailyDeliveryId?: number;
}

export interface VehiclePayload {
    id: number;
    fuelDetails: FuelDetailPayload[];
}
export interface FuelDetailPayload {
    containerId: number;
    fuelTypeId?: number | null;
}

/* Receive actions */
export interface DeliveryReceivePayload {
    fromDistanceId: number;
    toDistanceId: number;
    densityDetails: DensityDetailPayload[];
}
export interface DensityDetailPayload {
    detailId: number;
    density: number;
}

/* Detail */
export interface DeliveryDetail {
    id: number;
    daily_delivery_id: number;
    driver_id: number;
    trailer_id: number;
    from_location_id: number;
    delivery_locations: number[];
    manager_status_id: number;
    truck: Vehicle;
    trailer: Vehicle;
}

export interface Vehicle {
    id: number;
    details: VehicleDetail[];
}
export interface VehicleDetail {
    id: number;
    fuel_type: FuelType;
    container: Container;
    to_location: LocationPoint;
    density: number;
    inspector_status: Status;
    inspector_status_id: number;
    received_at: string;
    receiver: Receiver;
}