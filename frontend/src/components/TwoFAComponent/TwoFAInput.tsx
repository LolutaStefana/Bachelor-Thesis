import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect } from "react";
import "./twofa.css";

interface TwoFAInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TwoFAInput: React.FC<TwoFAInputProps> = ({ value, onChange }) => {
  const [inputValues, setInputValues] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array.from({ length: 6 }, () => null));

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValues(prevInputValues => {
      const newInputValues = [...prevInputValues];
      newInputValues[index] = newValue;
      return newInputValues;
    });
    if (newValue !== "" && index < inputRefs.current.length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  };

  const handleBackspace = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && index > 0 && inputValues[index] === "") {
      inputRefs.current[index - 1]!.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.length === 6) {
      setInputValues(pastedText.split("").slice(0, 6));
    }
  };

  useEffect(() => {
    onChange(inputValues.join(""));
  }, [inputValues, onChange]);

  return (
    <div className="inputs">
      {inputValues.map((value, index) => (
        <input
          key={index}
          ref={el => inputRefs.current[index] = el}
          type="text"
          value={value}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleBackspace(index, e)}
          onPaste={handlePaste}
          maxLength={1}
        />
      ))}
    </div>
  );
}

export default TwoFAInput;
