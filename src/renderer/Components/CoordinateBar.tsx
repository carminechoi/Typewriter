import React from 'react';
import './CoordinateBar.global.css';

const CoordinateBar = ({ row, col }: { row: number; col: number }) => {
  const zoom = '100%';
  const EOL = 'Windows (CRLF)';
  const encoding = 'UTF-8';
  return (
    <div className="coordinate-bar-row">
      <div className="coordinate-bar-element-col-first col-0" />
      <div className="coordinate-bar-element-col col-1">
        Ln {row}, Col {col}
      </div>
      <div className="coordinate-bar-element-col col-2 zoom">{zoom}</div>
      <div className="coordinate-bar-element-col col-3 end-of-line">{EOL}</div>
      <div className="coordinate-bar-element-col col-4 encoding">
        {encoding}
      </div>
    </div>
  );
};

export default CoordinateBar;
