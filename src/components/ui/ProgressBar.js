// ProgressBar.jsx

import React from 'react';

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${percentage}%` }}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
        role="progressbar"
      ></div>
    </div>
  );
};

export default ProgressBar;
