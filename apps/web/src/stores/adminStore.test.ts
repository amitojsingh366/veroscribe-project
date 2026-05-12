import { beforeEach, describe, expect, it } from "vitest";
import { useAdminStore } from "./adminStore";

describe("adminStore physician selection", () => {
  beforeEach(() => {
    useAdminStore.setState({
      bookingPhysicianSyncId: undefined,
      detailLayoutOpen: false,
      physicianId: undefined,
      status: "all"
    });
  });

  it("lets a manual physician change win over the current booking sync", () => {
    useAdminStore
      .getState()
      .syncPhysicianFromBooking("booking-1", "physician-amelia");

    expect(useAdminStore.getState().physicianId).toBe("physician-amelia");

    useAdminStore.getState().setPhysicianId("physician-marcus", {
      bookingPhysicianSyncId: "booking-1"
    });
    useAdminStore
      .getState()
      .syncPhysicianFromBooking("booking-1", "physician-amelia");

    expect(useAdminStore.getState().physicianId).toBe("physician-marcus");
  });

  it("syncs again when a different booking becomes active", () => {
    useAdminStore.getState().setPhysicianId("physician-marcus", {
      bookingPhysicianSyncId: "booking-1"
    });

    useAdminStore
      .getState()
      .syncPhysicianFromBooking("booking-2", "physician-priya");

    expect(useAdminStore.getState().physicianId).toBe("physician-priya");
  });

  it("allows the current booking to sync after the manual selection guard clears", () => {
    useAdminStore.getState().setPhysicianId("physician-marcus", {
      bookingPhysicianSyncId: "booking-1"
    });

    useAdminStore.getState().clearBookingPhysicianSync();
    useAdminStore
      .getState()
      .syncPhysicianFromBooking("booking-1", "physician-amelia");

    expect(useAdminStore.getState().physicianId).toBe("physician-amelia");
  });
});
