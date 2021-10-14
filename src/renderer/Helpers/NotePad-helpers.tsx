import { KeyboardEvent } from 'react';

const handleTab = (tabContent: {
  text: string;
  start: number;
  end: number;
}) => {
  const text = `${tabContent.text.substring(
    0,
    tabContent.start
  )}\t${tabContent.text.substring(tabContent.end)}`;
  return text;
};

export default handleTab;
