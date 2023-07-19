import React from 'react';
import { IconButton } from 'theme-ui';

function CopyIcon() {
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      >
        <rect
          fill="transparent"
          x="9"
          y="9"
          width="13"
          height="13"
          rx="2"
          ry="2"
        />
        <path
          fill="transparent"
          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        />
      </svg>
    </IconButton>
  );
}

export default CopyIcon;
