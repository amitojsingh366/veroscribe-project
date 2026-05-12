import { beforeEach, describe, expect, it } from "vitest";
import { useBookingStore } from "./bookingStore";

const physicianAmelia = {
  avatarTone: "teal",
  id: "physician-amelia",
  initials: "AC",
  name: "Dr. Amelia Chen",
  photoUrl: null,
  specialty: "Family Medicine"
};

const physicianMarcus = {
  avatarTone: "blue",
  id: "physician-marcus",
  initials: "MR",
  name: "Dr. Marcus Reed",
  photoUrl: null,
  specialty: "Internal Medicine"
};

const morningSlot = {
  endAt: "2026-05-15T17:30:00.000Z",
  id: "slot-morning",
  startAt: "2026-05-15T17:00:00.000Z",
  status: "available" as const
};

const afternoonSlot = {
  endAt: "2026-05-16T21:30:00.000Z",
  id: "slot-afternoon",
  startAt: "2026-05-16T21:00:00.000Z",
  status: "available" as const
};

describe("bookingStore state transitions", () => {
  beforeEach(() => {
    useBookingStore.setState({
      bookingId: undefined,
      details: {},
      physician: undefined,
      selectedDate: undefined,
      slot: undefined,
      visitType: "In-person"
    });
  });

  it("starts a fresh booking for a physician without retaining stale completion state", () => {
    useBookingStore.setState({
      bookingId: "booking-complete",
      details: { patientName: "Example Patient" },
      physician: physicianAmelia,
      selectedDate: "2026-05-15",
      slot: morningSlot
    });

    useBookingStore.getState().startBookingForPhysician(physicianAmelia);

    expect(useBookingStore.getState()).toMatchObject({
      bookingId: undefined,
      details: { patientName: "Example Patient" },
      physician: physicianAmelia,
      selectedDate: undefined,
      slot: undefined
    });
  });

  it("invalidates the selected slot and completed booking when the date changes", () => {
    useBookingStore.setState({
      bookingId: "booking-complete",
      selectedDate: "2026-05-15",
      slot: morningSlot
    });

    useBookingStore.getState().setSelectedDate("2026-05-16");

    expect(useBookingStore.getState()).toMatchObject({
      bookingId: undefined,
      selectedDate: "2026-05-16",
      slot: undefined
    });
  });

  it("invalidates completed booking state when the slot or visit type changes", () => {
    useBookingStore.setState({ bookingId: "booking-complete" });

    useBookingStore.getState().setSlot(afternoonSlot);
    expect(useBookingStore.getState().bookingId).toBeUndefined();
    expect(useBookingStore.getState().slot?.id).toBe("slot-afternoon");

    useBookingStore.setState({ bookingId: "booking-complete" });
    useBookingStore.getState().setVisitType("Telehealth");
    expect(useBookingStore.getState()).toMatchObject({
      bookingId: undefined,
      visitType: "Telehealth"
    });
  });

  it("preserves a same-physician slot sync but clears it when the physician changes", () => {
    useBookingStore.setState({
      physician: physicianAmelia,
      selectedDate: "2026-05-15",
      slot: morningSlot
    });

    useBookingStore.getState().setPhysician(physicianAmelia);
    expect(useBookingStore.getState().slot?.id).toBe("slot-morning");

    useBookingStore.getState().setPhysician(physicianMarcus);
    expect(useBookingStore.getState()).toMatchObject({
      physician: physicianMarcus,
      selectedDate: undefined,
      slot: undefined
    });
  });
});
