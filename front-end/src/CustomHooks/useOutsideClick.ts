import { useEffect, useRef } from "react";

export function useOutsideClick(close: (param: boolean) => void) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const handleClick = (event: any) => {
      console.log("event", ref.current.contains(event.target));
      if (!ref.current) return;

      // Check if the click event target is the modal or inside the modal
      if (!ref.current.contains(event.target)) {
        // Check if the clicked element has a special data attribute indicating it's inside the modal
        const isInsideModal = event.target.hasAttribute("data-inside-modal");
        console.log("has attribute", isInsideModal);

        // Close the modal only if the click is outside the modal and not inside a component inside the modal
        if (!isInsideModal) {
          close(false);
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return ref;
}
