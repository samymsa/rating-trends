import { useEffect, useState } from "react";

function getPlaceName(url: string): string {
  const match = url.match(/maps\/place\/([^/]+)/);
  return match
    ? decodeURIComponent(match[1].replace(/\+/g, " "))
    : "Unknown Place";
}

export function PlaceName() {
  const [placeName, setPlaceName] = useState<string>("");

  useEffect(() => {
    async function updatePlaceName() {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const newPlaceName = getPlaceName(tab.url || "");
      setPlaceName(newPlaceName);
    }

    updatePlaceName();
  }, []);
  return <h1 className="text-2xl font-bold">{placeName}</h1>;
}
