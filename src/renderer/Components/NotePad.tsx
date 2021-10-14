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
    let key;
    switch (e.code) {
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
      case 'Backspace':
      case 'Delete':
      case 'Fn': {
        e.preventDefault();
        break;
      }
      case 'Enter': {
        if (!textIsSelected) ipcRenderer.send('keyPress', 'newLine');
        break;
      }
      case 'ControlLeft' || 'ControlRight': {
        setCtrlIsDown(true);
        break;
      }
      default:
        key = String.fromCharCode(e.keyCode);
        if (!ctrlIsDown && key.match(/^[a-zA-Z0-9!@#$%^&*)(+=._-]+$/g)) {
          if (textIsSelected) e.preventDefault();
          else ipcRenderer.send('keyPress', 'character');
        }
        console.log(key);
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
            if (e.code === 'ControlLeft' || e.code === 'ControlRight')
              setCtrlIsDown(false);
          }}
        />
      </div>
      <CoordinateBar row={row} col={col} />
    </div>
  );
};

export default NotePad;
