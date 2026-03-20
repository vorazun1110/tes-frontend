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
import { useCallback, useMemo } from "react";

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
    dedupingInterval: 2000,
};

export function useDeliveryPageData(date: Dayjs): DeliverySWR {
    const dateStr = date.format("YYYY-MM-DD");

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
        deliveries: useSWR(`deliveries?date=${dateStr}`, () =>
            fetchDeliveries(dateStr),
            swrConfig
        ),
    };

    const isLoading = Object.values(swrs).some((swr) => swr.isLoading);
    const isError = Object.values(swrs).some((swr) => swr.error);

    const data: Partial<DeliveryData> = useMemo(() =>
        Object.fromEntries(
            Object.entries(swrs).map(([key, swr]) => [key, swr.data?.data])
        ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            swrs.drivers.data, swrs.trucks.data, swrs.trailers.data,
            swrs.fuelTypes.data, swrs.distances.data, swrs.fromLocations.data,
            swrs.toLocations.data, swrs.truckStatuses.data, swrs.leaveStatuses.data,
            swrs.managerStatuses.data, swrs.deliveries.data,
        ]
    );

    const mutate = useCallback(() => {
        swrs.deliveries.mutate?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateStr]);

    return { data, isLoading, isError, mutate };
}
