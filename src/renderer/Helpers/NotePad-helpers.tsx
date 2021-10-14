import { KeyboardEvent } from 'react';

const handleTab = (text: string, start: number, end: number) => {
  return `${text.substring(0, start)}\t${text.substring(end)}`;
};

export default handleTab;
