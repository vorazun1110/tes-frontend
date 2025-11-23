import useSWR, { SWRConfiguration } from "swr";
import { Dayjs } from "dayjs";
import {
    fetchDrivers,
    fetchTrailers,
    fetchFuelTypes,
    fetchStatuses,
    fetchDeliveries,
    fetchDistances,
    fetchLocations,
    fetchReadyTrucks,
} from "@/services";
import { Distance, Driver, FuelType, Location, Status, Trailer, Truck } from "@/types/api";
import { DailyDeliveryResponse } from "@/types/deliveries";

interface DeliverySWR {
    data: Partial<DeliveryData>;
    isLoading: boolean;
    isError: boolean;
    mutate: () => void;
}

interface DeliveryData {
    deliveries: DailyDeliveryResponse;
    drivers: Driver[];
    trucks: Truck[];
    trailers: Trailer[];
    fuelTypes: FuelType[];
    truckStatuses: Status[];
    leaveStatuses: Status[];
    managerStatuses: Status[];
    distances: Distance[];
    fromLocations: Location[];
    toLocations: Location[];
}

const swrConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
};

export function useDeliveryPageData(date: Dayjs): DeliverySWR {
    const swrs = {
        drivers: useSWR("drivers", fetchDrivers, swrConfig),
        trucks: useSWR("ready-trucks", fetchReadyTrucks, swrConfig),
        trailers: useSWR("trailers", fetchTrailers, swrConfig),
        fuelTypes: useSWR("fuel-types", fetchFuelTypes, swrConfig),
        distances: useSWR("distances", fetchDistances, swrConfig),
        fromLocations: useSWR("from-locations", () => fetchLocations("from"), swrConfig),
        toLocations: useSWR("to-locations", () => fetchLocations("to"), swrConfig),
        truckStatuses: useSWR("truck-statuses", () => fetchStatuses("truck"), swrConfig),
        leaveStatuses: useSWR("leave-statuses", () => fetchStatuses("leave"), swrConfig),
        managerStatuses: useSWR("manager-statuses", () => fetchStatuses("manager"), swrConfig),
        deliveries: useSWR(`deliveries?date=${date.format("YYYY-MM-DD")}`, () =>
            fetchDeliveries(date.format("YYYY-MM-DD")),
            swrConfig
        ),
    };

    const isLoading = Object.values(swrs).some((swr) => swr.isLoading);
    const isError = Object.values(swrs).some((swr) => swr.error);

    const data: Partial<DeliveryData> = Object.fromEntries(
        Object.entries(swrs).map(([key, swr]) => [key, swr.data?.data])
    );

    const mutate = () => {
        swrs.deliveries.mutate?.();
    };

    return { data, isLoading, isError, mutate };
}
