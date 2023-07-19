import React from 'react';
import { IconButton } from 'theme-ui';

function Icon() {
  return (
    <IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8 5.333c3.314 0 6-.895 6-2 0-1.104-2.686-2-6-2s-6 .896-6 2c0 1.105 2.686 2 6 2zM14 8c0 1.107-2.667 2-6 2s-6-.893-6-2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M2 3.333v9.334c0 1.106 2.667 2 6 2s6-.894 6-2V3.333"
        />
      </svg>
    </IconButton>
  );
}

export default Icon;
