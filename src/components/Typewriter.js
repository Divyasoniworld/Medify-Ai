"use client";

import { useState, useEffect } from 'react';

// A component that receives the full text and typing speed as props
function Typewriter({ fullText, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Reset when fullText changes
    setDisplayedText('');
    setCurrentIndex(0);
  }, [fullText]);

  useEffect(() => {
    // Check if there are still characters to type
    if (currentIndex < fullText.length) {
      // Set up an interval to add the next character
      const timer = setTimeout(() => {
        setDisplayedText((prevText) => prevText + fullText[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, speed);

      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText, speed]);

  return <span>{displayedText}</span>;
}

export default Typewriter;