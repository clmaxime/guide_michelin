import { useEffect, useMemo, useState } from "react";

export default function RestaurantImage({ imageUrls, alt, className }) {
  const sources = useMemo(
    () => (Array.isArray(imageUrls) ? imageUrls.filter((url) => typeof url === "string" && url.trim().length > 0) : []),
    [imageUrls],
  );
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  useEffect(() => {
    setIndex(0);
    setExhausted(false);
  }, [sources]);

  if (sources.length === 0 || exhausted) {
    return null;
  }

  return (
    <img
      alt={alt}
      className={className}
      onError={() => {
        if (index + 1 < sources.length) {
          setIndex(index + 1);
          return;
        }
        setExhausted(true);
      }}
      src={sources[index]}
    />
  );
}
