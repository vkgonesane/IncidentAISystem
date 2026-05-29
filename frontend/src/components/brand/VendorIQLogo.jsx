function VendorIQLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M32 6L54 18.5V45.5L32 58L10 45.5V18.5L32 6Z"
        stroke="#10B981"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d="M18 34H25L28 25L34 42L38 31H46"
        stroke="#10B981"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="14" r="5" fill="#10B981" />
    </svg>
  );
}

export default VendorIQLogo;