/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import handleKeyDown from 'renderer/Helpers/NotePad-helpers';
import CoordinateBar from './CoordinateBar';
import './NotePad.global.css';

const { ipcRenderer } = window.require('electron');

const NotePad = () => {
  const [textValue, setTextValue] = useState('');
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [ctrlIsDown, setCtrlIsDown] = useState(false);

  const setRowAndCol = (selection: number) => {
    const substr = textValue.substring(0, selection).split('\n');
    setRow(substr.length);
    setCol(substr[substr.length - 1].length + 1);
  };

  useEffect(() => {
    // Anything in here is fired on component mount.
    ipcRenderer.on('FILE_OPEN', (event, args) => {
      setTextValue(args);
      console.log('got FILE_OPEN', event, args);
    });
    return () => {
      // Anything in here is fired on component unmount.
    };
  }, []);

  return (
    <div>
      <div className="text-container">
        <textarea
          className="text-area"
          value={textValue}
          spellCheck="false"
          onChange={(e) => {
            ipcRenderer.send('KEYPRESS', 'character');
            setTextValue(e.target.value);
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onClick={(e) => {
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onKeyDown={(e) => {
            const handleResult = handleKeyDown(e, textValue, ctrlIsDown);
            setTextValue(handleResult.textValue);
            setCtrlIsDown(handleResult.ctrlIsDown);
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Control') setCtrlIsDown(false);
          }}
        />
      </div>
      <CoordinateBar row={row} col={col} />
    </div>
  );
};

export default NotePad;
