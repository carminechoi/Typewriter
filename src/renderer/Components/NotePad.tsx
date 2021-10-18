/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import handleTab from 'renderer/Helpers/NotePad-helpers';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textIsSelected = window.getSelection()?.toString() !== '';
    const keyCode = e.key;
    switch (keyCode) {
      case 'Tab': {
        const text = handleTab(
          textValue,
          e.currentTarget.selectionStart,
          e.currentTarget.selectionEnd
        );
        setTextValue(text);
        ipcRenderer.send('keyPress', 'tab');
        break;
      }
      case 'Enter': {
        if (!textIsSelected) ipcRenderer.send('keyPress', 'newLine');
        break;
      }
      case 'Backspace':
      case 'Delete':
      case 'Fn': {
        e.preventDefault();
        break;
      }
      case 'Control': {
        setCtrlIsDown(true);
        break;
      }
      case 'z':
      case 'v': {
        if (ctrlIsDown) e.preventDefault();
        break;
      }
      default:
        console.log(`Is Control Down: ${ctrlIsDown}`);
        console.log(keyCode);
    }
  };

  return (
    <div>
      <div className="text-container">
        <textarea
          className="text-area"
          value={textValue}
          spellCheck="false"
          onChange={(e) => {
            ipcRenderer.send('keyPress', 'character');
            setTextValue(e.target.value);
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onClick={(e) => {
            setRowAndCol(e.currentTarget.selectionStart);
          }}
          onKeyDown={(e) => {
            handleKeyDown(e);
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
