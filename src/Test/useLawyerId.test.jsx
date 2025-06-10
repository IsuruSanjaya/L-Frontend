import React from "react";
import { renderHook } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { useLawyerId } from "../hooks/useLawyerId";

describe("useLawyerId hook", () => {
  it("returns lawyerId from URL query params", () => {
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/path?lawyerId=789"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(() => useLawyerId(), { wrapper });
    expect(result.current).toBe("789");
  });

  it("returns null when no lawyerId in URL", () => {
    const wrapper = ({ children }) => (
      <MemoryRouter initialEntries={["/path"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useLawyerId(), { wrapper });
    expect(result.current).toBeNull();
  });
});
