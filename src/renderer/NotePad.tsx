/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './NotePad.global.css';

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

const NotePad = () => {
  const [textValue, setTextValue] = useState('');
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);

  const setRowAndCol = (selection: number) => {
    const substr = textValue.substring(0, selection).split('\n');
    setRow(substr.length);
    setCol(substr[substr.length - 1].length + 1);
  };

  return (
    <div>
      <div className="text-container">
        <textarea
          className="text-area"
          value={textValue}
          spellCheck="false"
          onChange={(e) => {
            setTextValue(e.target.value);
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onClick={(e) => {
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onKeyDown={(e) => {
            setRowAndCol(e.currentTarget.selectionStart);
          }}
        />
      </div>
      <CoordinateBar row={row} col={col} />
    </div>
  );
};

export default NotePad;
