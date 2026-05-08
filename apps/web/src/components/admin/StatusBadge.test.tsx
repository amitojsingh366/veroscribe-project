import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders confirmed text", () => {
    const { getByText } = render(<StatusBadge status="confirmed" />);
    expect(getByText("Confirmed")).toBeInTheDocument();
  });
});
