const IconBase = ({ children, size = 18 }) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    {children}
  </svg>
);

export const FaUser = (props) => (
  <IconBase {...props}>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
  </IconBase>
);

export const FaCalendar = (props) => (
  <IconBase {...props}>
    <path d="M7 2h2v2h6V2h2v2h3a1 1 0 0 1 1 1v15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1h3Zm12 8H5v10h14Zm0-4H5v2h14Z" />
  </IconBase>
);

export const FaUsers = (props) => (
  <IconBase {...props}>
    <path d="M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm6 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm0 2c-1.56 0-2.96.48-4 1.25C9.96 13.48 8.56 13 7 13c-3.31 0-6 1.79-6 4v1h11v-1a4.9 4.9 0 0 0-.78-2.61A7.42 7.42 0 0 1 15 13Zm0 0c3.31 0 6 1.79 6 4v1h-7v-1a5.8 5.8 0 0 0-1.02-3.24A7.3 7.3 0 0 1 15 13Z" />
  </IconBase>
);

export const FaChartBar = (props) => (
  <IconBase {...props}>
    <path d="M4 20h16v2H2V4h2Zm3-2H5v-7h2Zm6 0h-2V8h2Zm6 0h-2v-4h2Z" />
  </IconBase>
);

export const FaFileInvoice = (props) => (
  <IconBase {...props}>
    <path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.5V8h4.5ZM8 12h8v2H8Zm0 4h8v2H8Z" />
  </IconBase>
);

export const FaEnvelope = (props) => (
  <IconBase {...props}>
    <path d="M3 6h18a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a1 1 0 0 1 1-1Zm0 2v.2l9 5.4 9-5.4V8l-9 5.4Zm18 2.53-8.49 5.09a1 1 0 0 1-1.02 0L3 10.53V17h18Z" />
  </IconBase>
);

export const FaUserTie = (props) => (
  <IconBase {...props}>
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm-3 2 2 3-1.5 5H7v-1c0-2.76 2.69-5 6-5s6 2.24 6 5v1h-2.5L15 17l2-3Z" />
  </IconBase>
);

export const FaUserFriends = (props) => (
  <IconBase {...props}>
    <path d="M8 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 1a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 16 12Zm-8 2c-3.87 0-7 2.02-7 4.5V20h10v-1.5c0-1.62.93-3.04 2.35-4.03A9.75 9.75 0 0 0 8 14Zm8 0c-2.76 0-5 1.57-5 3.5V20h10v-2.5c0-1.93-2.24-3.5-5-3.5Z" />
  </IconBase>
);

export const FaChevronDown = (props) => (
  <IconBase {...props}>
    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </IconBase>
);

export const FaBars = (props) => (
  <IconBase {...props}>
    <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
  </IconBase>
);

export const FaSearch = (props) => (
  <IconBase {...props}>
    <path d="M10 2a8 8 0 1 0 4.9 14.32l4.39 4.39 1.41-1.41-4.39-4.39A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" />
  </IconBase>
);

export const FaExpand = (props) => (
  <IconBase {...props}>
    <path d="M9 3H3v6h2V6.41L8.59 10 10 8.59 6.41 5H9Zm12 0h-6v2h2.59L14 8.59 15.41 10 19 6.41V9h2ZM8.59 14 5 17.59V15H3v6h6v-2H6.41L10 15.41ZM21 15h-2v2.59L15.41 14 14 15.41 17.59 19H15v2h6Z" />
  </IconBase>
);
