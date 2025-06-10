// src/hooks/useLawyerId.js
import { useLocation } from "react-router-dom";

export function useLawyerId() {
  
  const query = new URLSearchParams(useLocation().search);
  return query.get("lawyerId");
}
