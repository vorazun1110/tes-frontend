export interface Container {
  volume: number | null;
  id?: number;
}

export interface Truck {
  id: number;
  license_plate: string;
  containers: TruckContainer[];
  tire_wear: number;
  last_battery_changed_at: string;
  last_inspected_at: string;
  driver?: Driver;
  driver_id?: number | null;
  trailer_id?: number | null;
  trailer?: {
    id: number;
    license_plate: string;
    containers: TruckContainer[];
  };
}

export interface TruckContainer {
  id: number;
  volume: number | null;
}

export interface TruckPayload {
  license_plate: string;
  last_battery_changed_at: string;
  last_inspected_at: string;
  driver_id?: number | null;
  tire_wear: number;
  containers: ContainerPayload[];
  trailer_id?: number | null;
}

export interface Trailer {
  id: number;
  license_plate: string;
  containers: Container[];
}

export interface TrailerPayload {
  license_plate: string;
  containers: ContainerPayload[];
}
export interface ContainerPayload {
  volume: number;
}

export interface Volume {
  id: number;
  value: number;
}

export interface Driver {
  id: number;
  firstname: string;
  lastname: string;
  position: string;
  register: string;
  phone: number;
  truck_id: number;
  truck?: Truck;
  trailer_id: number;
  trailer?: Trailer;
}

export interface User {
  id: number;
  username: string;
  role: "manager" | "inspector";
  firstname: string;
  lastname: string;
}

export interface UserPayload {
  username: string;
  role: "manager" | "inspector";
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
}

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
export interface FuelType {
  id: number;
  name: string;
}

export interface FuelTypeSummary {
  id: number;
  name: string;
  volume: number;
  averageDensity: number;
}

export interface FuelDetail {
  id: number;
  name: string;
  mass: number;
  volume: number;
  averageDensity: number;
}

export interface Vehicle {
  id: number;
  license_plate: string;
}

export interface LocationDetail {
  id: number;
  name: string;
}

export interface ReceiverDetail {
  id: number;
  name: string;
}

export interface DeliveryItem {
  locationDetail: LocationDetail | null;
  receiverDetail: ReceiverDetail | null;
  deliveryTruck: Vehicle;
  deliveryTrailer: Vehicle;
  tonKm: number;
  withLoadDistance: number;
  withoutLoadDistance: number;
  details: FuelDetail[];
}

export interface GroupedDelivery {
  date: string;
  deliveries: DeliveryItem[];
}

export interface ReportData {
  totalMass: number;
  totalTonKm: number;
  totalVolume: number;
  totalDistance: number;
  totalWithLoadDistance: number;
  totalWithoutLoadDistance: number;
  totalFuelTypeDetail: FuelTypeSummary[];
  deliveries: GroupedDelivery[];
}

export interface ReportResponse {
  message: string;
  success: boolean;
  data: ReportData;
}

export interface ReportMeta {
  period: {
    startDate: string;
    endDate: string;
  };
  filters: {
    driverId: string;
    truckId: number | null;
  };
  totalDeliveries: number;
  generatedAt: string;
}
