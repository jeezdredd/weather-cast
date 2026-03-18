import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WeatherForm from "@/components/WeatherForm";

jest.mock("@/services/api", () => ({
  searchCities: jest.fn().mockResolvedValue([]),
}));

describe("WeatherForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it("renders in coordinates mode by default", () => {
    render(<WeatherForm onSubmit={mockOnSubmit} isLoading={false} />);
    expect(screen.getByLabelText("Latitude")).toBeInTheDocument();
    expect(screen.getByLabelText("Longitude")).toBeInTheDocument();
  });

  it("switches to city mode", async () => {
    render(<WeatherForm onSubmit={mockOnSubmit} isLoading={false} />);
    await userEvent.click(screen.getByText("City"));
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit in coordinates mode", async () => {
    render(<WeatherForm onSubmit={mockOnSubmit} isLoading={false} />);
    await userEvent.click(screen.getByText("Get Weather"));
    expect(screen.getByText("Latitude is required")).toBeInTheDocument();
    expect(screen.getByText("Longitude is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows validation errors on empty submit in city mode", async () => {
    render(<WeatherForm onSubmit={mockOnSubmit} isLoading={false} />);
    await userEvent.click(screen.getByText("City"));
    await userEvent.click(screen.getByText("Get Weather"));
    expect(screen.getByText("City name is required")).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with valid coordinates", async () => {
    render(<WeatherForm onSubmit={mockOnSubmit} isLoading={false} />);
    await userEvent.type(screen.getByLabelText("Latitude"), "52.52");
    await userEvent.type(screen.getByLabelText("Longitude"), "13.405");
    await userEvent.click(screen.getByText("Get Weather"));
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "coordinates",
        latitude: "52.52",
        longitude: "13.405",
      })
    );
  });

  it("shows loading state", () => {
    render(<WeatherForm onSubmit={mockOnSubmit} isLoading={true} />);
    const button = screen.getByText("Loading...");
    expect(button).toBeDisabled();
  });
});
