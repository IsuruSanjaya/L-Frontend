// src/hooks/useLawyerId.js
import { useLocation } from "react-router-dom";
// const lawyer_id="mem_sb_cmbeqblfw02s80xnx6k4s9psw"

export function useLawyerId() {
  
  const query = new URLSearchParams(useLocation().search);
  return query.get("lawyerId");
}
