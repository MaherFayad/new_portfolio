"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect, type ReactNode } from "react";

const CAL_NAMESPACE = "30min";
const CAL_LINK = "maher-fayad-chnujh/30min";
const CAL_CONFIG = JSON.stringify({
  layout: "month_view",
  useSlotsViewOnSmallScreen: "true",
});

type BookMeetingButtonProps = {
  className?: string;
  children?: ReactNode;
};

export default function BookMeetingButton({
  className = "font-semibold text-sm uppercase text-[#c5c5c5] underline underline-offset-4 hover:opacity-70 cursor-pointer bg-transparent border-0 p-0",
  children = "Book a meeting",
}: BookMeetingButtonProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <button
      type="button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={CAL_CONFIG}
      className={className}
    >
      {children}
    </button>
  );
}
