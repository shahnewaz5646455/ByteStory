// components/GoogleG.jsx
import React from "react";

export default function GoogleG({ className = "w-5 h-5", title = "Google", ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 533.5 544.3"
      width="1em"
      height="1em"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={props["aria-hidden"] ?? "false"}
      role="img"
      {...props}
    >
      <title>{title}</title>
      <path
        fill="#4285F4"
        d="M533.5 278.4c0-17.8-1.6-35.1-4.7-51.8H272v98.1h146.9c-6.3 34.1-27.9 63-59.6 82l96.3 74c56-51.6 88.9-127.9 88.9-202.3z"
      />
      <path
        fill="#34A853"
        d="M272 544.3c72.6 0 133.7-23.8 178.2-64.6l-96.3-74c-26.8 18-61.1 28.6-81.9 28.6-62.9 0-116.2-42.5-135.2-99.4l-100.2 77.1C61.3 493.2 158.8 544.3 272 544.3z"
      />
      <path
        fill="#FBBC05"
        d="M136.8 323.9c-6.1-18-9.6-37.3-9.6-57s3.5-39 9.6-57L36.6 132c-22.2 43.9-35 93.2-35 144s12.8 100.1 35 144l100.2-77.1z"
      />
      <path
        fill="#EA4335"
        d="M272 107.7c35.6 0 67.6 12.3 93 36.5l69.6-69.6C402 33.9 344.6 9.3 272 9.3 158.8 9.3 61.3 60.4 36.6 132l100.2 77.1c19-56.9 72.3-99.4 135.2-101.4z"
      />
    </svg>
  );
}
