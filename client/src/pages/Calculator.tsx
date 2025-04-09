import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CalcButton } from "@/components/ui/calculator-button";
import { CalcDisplay } from "@/components/ui/calculator-display";

export default function Calculator() {
  const [displayValue, setDisplayValue] = useState("0");
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle digit input
  const handleDigit = (digit: string) => {
    if (hasError) {
      setHasError(false);
      setDisplayValue(digit);
      return;
    }

    if (shouldResetDisplay) {
      setDisplayValue(digit);
      setShouldResetDisplay(false);
    } else {
      setDisplayValue(displayValue === "0" ? digit : displayValue + digit);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setDisplayValue("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
    setHasError(false);
  };

  // Handle decimal point
  const handleDecimal = () => {
    if (hasError) {
      setHasError(false);
      setDisplayValue("0.");
      return;
    }

    if (shouldResetDisplay) {
      setDisplayValue("0.");
      setShouldResetDisplay(false);
    } else if (!displayValue.includes(".")) {
      setDisplayValue(displayValue + ".");
    }
  };

  // Handle plus/minus toggle
  const handlePlusMinus = () => {
    if (!hasError) {
      setDisplayValue((parseFloat(displayValue) * -1).toString());
    }
  };

  // Handle percentage
  const handlePercentage = () => {
    if (!hasError) {
      setDisplayValue((parseFloat(displayValue) / 100).toString());
    }
  };

  // Handle operations
  const handleOperation = (op: string) => {
    if (hasError) return;

    if (previousValue === null) {
      setPreviousValue(displayValue);
    } else if (!shouldResetDisplay) {
      try {
        const result = calculate();
        setPreviousValue(result);
        setDisplayValue(result);
      } catch (e) {
        setHasError(true);
        setDisplayValue("0");
        return;
      }
    }

    setOperation(op);
    setShouldResetDisplay(true);
  };

  // Handle equals
  const handleEquals = () => {
    if (hasError || !operation) return;

    try {
      const result = calculate();
      setDisplayValue(result);
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    } catch (e) {
      setHasError(true);
      setDisplayValue("0");
    }
  };

  // Calculate result
  const calculate = (): string => {
    const prev = parseFloat(previousValue || "0");
    const current = parseFloat(displayValue);

    if (isNaN(prev) || isNaN(current)) return "0";

    let result: number;
    
    switch (operation) {
      case "add":
        result = prev + current;
        break;
      case "subtract":
        result = prev - current;
        break;
      case "multiply":
        result = prev * current;
        break;
      case "divide":
        if (current === 0) {
          throw new Error("Division by zero");
        }
        result = prev / current;
        break;
      default:
        return displayValue;
    }

    // Handle floating point precision issues
    return Math.round(result * 1000000) / 1000000 + "";
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
      <Card className="max-w-xs w-full rounded-2xl shadow-lg overflow-hidden">
        {/* Calculator Display */}
        <CalcDisplay value={displayValue} hasError={hasError} />
        
        {/* Calculator Keypad */}
        <div className="grid grid-cols-4 gap-0.5 p-1 bg-background">
          {/* Row 1 */}
          <CalcButton onClick={handleClear}>C</CalcButton>
          <CalcButton onClick={handlePlusMinus}>+/-</CalcButton>
          <CalcButton onClick={handlePercentage}>%</CalcButton>
          <CalcButton 
            onClick={() => handleOperation("divide")} 
            type="operation"
          >÷</CalcButton>
          
          {/* Row 2 */}
          <CalcButton onClick={() => handleDigit("7")}>7</CalcButton>
          <CalcButton onClick={() => handleDigit("8")}>8</CalcButton>
          <CalcButton onClick={() => handleDigit("9")}>9</CalcButton>
          <CalcButton 
            onClick={() => handleOperation("multiply")} 
            type="operation"
          >×</CalcButton>
          
          {/* Row 3 */}
          <CalcButton onClick={() => handleDigit("4")}>4</CalcButton>
          <CalcButton onClick={() => handleDigit("5")}>5</CalcButton>
          <CalcButton onClick={() => handleDigit("6")}>6</CalcButton>
          <CalcButton 
            onClick={() => handleOperation("subtract")} 
            type="operation"
          >−</CalcButton>
          
          {/* Row 4 */}
          <CalcButton onClick={() => handleDigit("1")}>1</CalcButton>
          <CalcButton onClick={() => handleDigit("2")}>2</CalcButton>
          <CalcButton onClick={() => handleDigit("3")}>3</CalcButton>
          <CalcButton 
            onClick={() => handleOperation("add")} 
            type="operation"
          >+</CalcButton>
          
          {/* Row 5 */}
          <CalcButton
            onClick={() => handleDigit("0")}
            className="col-span-2 aspect-[2/1]"
          >0</CalcButton>
          <CalcButton onClick={handleDecimal}>.</CalcButton>
          <CalcButton 
            onClick={handleEquals} 
            type="equals"
          >=</CalcButton>
        </div>
      </Card>
    </div>
  );
}
