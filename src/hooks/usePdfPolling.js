import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getPdfs } from "../features/pdfs/pdfSlice";

export const usePdfPolling = (pdfs, interval = 5000) => {
  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  useEffect(() => {
    const hasProcessing = pdfs.some((pdf) => pdf.status === "processing");

    if (hasProcessing) {
      intervalRef.current = setInterval(() => {
        dispatch(getPdfs());
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pdfs, dispatch, interval]);
};
