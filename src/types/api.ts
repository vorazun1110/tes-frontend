export interface Container {
    id: number;
    volume: number | null;
}

export interface Truck {
    id: number;
    license_plate: string;
    containers: Container[];
}

export interface TruckPayload {
    type: "trailer";
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

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

