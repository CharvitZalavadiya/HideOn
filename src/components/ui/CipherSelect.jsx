import React, { useState, useRef, useEffect } from 'react';

export default function CipherSelect({ onCipherChange }) {
  const [active, setActive] = useState('caeser');
  const scrollRef = useRef(null);

  const cipherList = [
    "caeser", "monoalphabetic", "railfence", "columnar", "doublecolumnar", "hill",
    "vigenere", "vernam", "autokey", "playfair", "feistel",
    "aes", "des", "3des"
  ];

  const handleClick = (e, cipher) => {
    e.preventDefault();
    setActive(cipher);
    if (typeof onCipherChange === 'function') {
      onCipherChange(cipher);
    } else {
      console.warn("onCipherChange prop not provided or not a function");
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={scrollRef}
      style={{
        display: "flex",
        gap: "10px",
        marginBottom: "12px",
        backgroundColor: "rgb(40, 40, 40)",
        padding: "5px",
        borderRadius: "30px",
        width: "100%",
        maxWidth: "fit-content",
        overflowX: "auto",
        overflowY: "hidden",
        scrollBehavior: "smooth"
      }}
    >
      {cipherList.map((cipher) => (
        <button
          key={cipher}
          onClick={(e) => handleClick(e, cipher)}
          style={{
            textTransform: "capitalize",
            padding: "4px 8px",
            borderRadius: "20px",
            border: active === cipher ? "1px solid #26802970" : "1px solid var(--tertiaryFont)",
            backgroundColor: active === cipher ? "#26802970" : "transparent",
            color: active === cipher ? "#0f0" : "var(--secondaryFont)",
            fontFamily: "monospace",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
            whiteSpace: "nowrap",
          }}
        >
          {cipher}
        </button>
      ))}
    </div>
  );
}
