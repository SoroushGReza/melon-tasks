import { useEffect } from "react";

// Handle click event
const useClickOutsideToggle = (callback, ...refs) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refs.every((ref) => ref.current && !ref.current.contains(event.target))
      ) {
        callback();
      }
    };

    // Add event listener for mousedown events
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, refs]);
};

export default useClickOutsideToggle;
