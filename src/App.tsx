import React, { useState } from "react";

function MathMysteryGame() {
  // Game states
  const [screen, setScreen] = useState("intro");
  const [mystery, setMystery] = useState(1);
  const [clue, setClue] = useState(1);
  const [equation, setEquation] = useState("3x + 6 = 0");
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [clueValues, setClueValues] = useState({});
  const [showCalculator, setShowCalculator] = useState(false);

  // Practice mode states
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceStats, setPracticeStats] = useState({
    attempted: 0,
    correct: 0,
    accuracy: 0,
  });

  // Mystery data
  const mysteries = [
    {
      title: "The Missing Trainee",
      clues: ["Floor Number", "Room Number", "Time"],
      formula: "(Floor × Room) + Time",
      example: "(3 × 12) + 9 = 45",
    },
    {
      title: "The Secret Practice Room",
      clues: ["Camera Number", "Timestamp", "Storage Unit"],
      formula: "(Camera × Timestamp) - Storage Unit",
      example: "(4 × 7) - 3 = 25",
    },
  ];

  // Character dialogue data
  const dialogues = {
    1: [
      {
        character: "Felix",
        text: "I was teaching her some dance moves in the practice room...",
      },
      {
        character: "Hyunjin",
        text: "And when I came to join them, she was gone! But look - there are equations everywhere!",
      },
      {
        character: "Felix",
        text: "I saw Min-ji heading up the stairs. I'm sure it was past the 2nd floor...",
      },
      {
        character: "Hyunjin",
        text: "I checked the practice log. The room number is here somewhere...",
      },
      {
        character: "Bang Chan",
        text: "The security footage shows her walking by. Let me check the timestamp...",
      },
    ],
    2: [
      {
        character: "Bang Chan",
        text: "We've hidden something special for Min-ji's debut...",
      },
      {
        character: "Changbin",
        text: "But we need to make sure only true math detectives can find it!",
      },
      { character: "Bang Chan", text: "Check the security camera number..." },
      {
        character: "Lee Know",
        text: "I remember seeing them around this time...",
      },
      { character: "Changbin", text: "Now for the storage unit number..." },
    ],
  };

  // Success dialogues after correct answers
  const successDialogues = {
    1: [
      { character: "Felix", text: "That's right! She went to the 3rd floor!" },
      { character: "Hyunjin", text: "Of course! It's room 12!" },
      { character: "Bang Chan", text: "Got it! It was 9PM!" },
    ],
    2: [
      { character: "Bang Chan", text: "Yes! Camera 4 caught everything!" },
      { character: "Lee Know", text: "That's right! It was 7:00!" },
      { character: "Changbin", text: "Perfect! It's in unit 3!" },
    ],
  };

  // Generate equation with correct answer
  const generateEquation = (level, targetAnswer = null) => {
    // Default target answer if none specified
    const answer = targetAnswer || Math.floor(Math.random() * 10) + 2;

    let equationText = "";

    switch (level) {
      case 1: // ax + b = 0
        const a1 = Math.floor(Math.random() * 4) + 2; // 2-5
        const b1 = -a1 * answer;
        equationText = `${a1}x + ${b1} = 0`;
        break;
      case 2: // ax + b = c
        const a2 = Math.floor(Math.random() * 4) + 3; // 3-6
        const b2 = Math.floor(Math.random() * 10) + 1; // 1-10
        const c2 = a2 * answer + b2;
        equationText = `${a2}x + ${b2} = ${c2}`;
        break;
      case 3: // -ax + b = c
        const a3 = Math.floor(Math.random() * 4) + 4; // 4-7
        const b3 = Math.floor(Math.random() * 20) + 10; // 10-29
        const c3 = b3 - a3 * answer;
        equationText = `-${a3}x + ${b3} = ${c3}`;
        break;
      default:
        equationText = `3x + ${-3 * answer} = 0`;
    }

    return { equation: equationText, answer };
  };

  // Solve an equation to find x
  const solveEquation = (eq) => {
    try {
      // Normalize to handle negative coefficients
      const normalized = eq
        .replace(/-(\d+)x/g, "-$1*x")
        .replace(/(\d+)x/g, "$1*x");

      // Split by equals sign
      const sides = normalized.split("=").map((s) => s.trim());
      const leftSide = sides[0];
      const rightSide = sides[1];

      // Find coefficient by evaluating with x=0 and x=1
      const withX0 = eval(leftSide.replace(/x/g, "0"));
      const withX1 = eval(leftSide.replace(/x/g, "1"));

      const coefficient = withX1 - withX0;
      const constant = withX0;
      const rightValue = eval(rightSide);

      // Solve for x: coefficient*x + constant = rightValue
      return (rightValue - constant) / coefficient;
    } catch (e) {
      console.error("Error solving equation:", e);
      return null;
    }
  };

  // Start a new mystery
  const startMystery = (num) => {
    setMystery(num);
    setClue(0); // 0 for intro, 1-3 for clues
    setClueValues({});
    setScreen("mysteryIntro");
    setUserAnswer("");
    setFeedback("");
  };

  // Begin practice mode
  const startPractice = () => {
    setPracticeMode(true);
    setPracticeStats({
      attempted: 0,
      correct: 0,
      accuracy: 0,
    });

    // Generate first practice equation
    const { equation } = generateEquation(mystery === 2 ? 2 : 1);
    setEquation(equation);
    setUserAnswer("");
    setFeedback("");

    setScreen("practice");
  };

  // Start a specific clue
  const startClue = (num) => {
    setClue(num);

    // Generate appropriate equation for this clue
    let targetAnswer;
    if (mystery === 1) {
      if (num === 1) targetAnswer = 3; // Floor number
      else if (num === 2) targetAnswer = 12; // Room number
      else targetAnswer = 9; // Time
    } else {
      if (num === 1) targetAnswer = 4; // Camera number
      else if (num === 2) targetAnswer = 7; // Timestamp
      else targetAnswer = 3; // Storage Unit
    }

    const level = mystery === 1 ? num : num + 1;
    const { equation } = generateEquation(level, targetAnswer);
    setEquation(equation);
    setUserAnswer("");
    setFeedback("");

    setScreen("gameplay");
  };

  // Exit practice mode
  const exitPractice = () => {
    if (practiceStats.accuracy >= 80 && practiceStats.attempted >= 5) {
      setPracticeMode(false);
      startClue(1);
    } else {
      setFeedback(
        "You need to achieve at least 80% accuracy on 5+ problems to continue!"
      );
    }
  };

  // Check answer in practice mode
  const checkPracticeAnswer = () => {
    if (!userAnswer.trim()) {
      setFeedback("Please enter an answer.");
      return;
    }

    const correctAnswer = solveEquation(equation);
    if (correctAnswer === null) {
      setFeedback("Error checking answer. Please try again.");
      return;
    }

    const userNum = parseFloat(userAnswer);
    const isCorrect = Math.abs(userNum - correctAnswer) < 0.01;

    // Update practice stats
    const newStats = {
      attempted: practiceStats.attempted + 1,
      correct: practiceStats.correct + (isCorrect ? 1 : 0),
    };
    newStats.accuracy = Math.round(
      (newStats.correct / newStats.attempted) * 100
    );
    setPracticeStats(newStats);

    if (isCorrect) {
      setFeedback(`Correct! The answer is ${correctAnswer}.`);

      // Generate new practice problem
      setTimeout(() => {
        const level =
          mystery === 1 ? Math.min(clue + 1, 3) : Math.min(clue + 2, 3);
        const { equation } = generateEquation(level);
        setEquation(equation);
        setUserAnswer("");
        setFeedback("");
      }, 1500);
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer}.`);
    }
  };

  // Check answer during gameplay
  const checkGameplayAnswer = () => {
    if (!userAnswer.trim()) {
      setFeedback("Please enter an answer.");
      return;
    }

    const correctAnswer = solveEquation(equation);
    if (correctAnswer === null) {
      setFeedback("Error checking answer. Please try again.");
      return;
    }

    const userNum = parseFloat(userAnswer);
    const isCorrect = Math.abs(userNum - correctAnswer) < 0.01;

    if (isCorrect) {
      setScore(score + 100);
      setFeedback("Correct! You found a clue!");

      // Store the clue value
      setClueValues({
        ...clueValues,
        [mysteries[mystery - 1].clues[clue - 1]]: correctAnswer,
      });

      // Show success message and continue
      setTimeout(() => {
        if (clue < 3) {
          // Move to next clue
          startClue(clue + 1);
        } else {
          // All clues found, go to final puzzle
          setScreen("finalPuzzle");
          setUserAnswer("");
          setFeedback("");
        }
      }, 1500);
    } else {
      setFeedback("Incorrect! Try again.");
    }
  };

  // Check final answer
  const checkFinalAnswer = () => {
    if (!userAnswer.trim()) {
      setFeedback("Please enter an answer.");
      return;
    }

    // Calculate expected answer based on formula
    let expectedAnswer;
    if (mystery === 1) {
      // (Floor × Room) + Time
      expectedAnswer =
        clueValues["Floor Number"] * clueValues["Room Number"] +
        clueValues["Time"];
    } else {
      // (Camera × Timestamp) - Storage Unit
      expectedAnswer =
        clueValues["Camera Number"] * clueValues["Timestamp"] -
        clueValues["Storage Unit"];
    }

    const userNum = parseInt(userAnswer);

    if (userNum === expectedAnswer) {
      setFeedback("Mystery solved! You found the correct answer!");
      setTimeout(() => {
        setScreen("mysteryComplete");
      }, 1500);
    } else {
      setFeedback(
        `Incorrect! Check your formula: ${mysteries[mystery - 1].formula}`
      );
    }
  };

  // Handle answer checking based on current screen
  const checkAnswer = () => {
    if (practiceMode) {
      checkPracticeAnswer();
    } else if (screen === "gameplay") {
      checkGameplayAnswer();
    } else if (screen === "finalPuzzle") {
      checkFinalAnswer();
    }
  };

  // Render dialogue based on mystery and clue
  const renderDialogue = () => {
    if (screen === "mysteryIntro") {
      return dialogues[mystery].slice(0, 2).map((d, i) => (
        <div key={i} className="bg-gray-100 p-3 rounded-lg mb-4 flex">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
            {d.character[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold">{d.character}</p>
            <p className="italic">{d.text}</p>
          </div>
        </div>
      ));
    } else if (screen === "gameplay") {
      // Dialogue for current clue
      const dialogueIndex = clue + 1; // Skip the first two intro dialogues
      if (dialogueIndex < dialogues[mystery].length) {
        const d = dialogues[mystery][dialogueIndex];
        return (
          <div className="bg-gray-100 p-3 rounded-lg mb-4 flex">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mr-3">
              {d.character[0]}
            </div>
            <div className="flex-1">
              <p className="font-bold">{d.character}</p>
              <p className="italic">{d.text}</p>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  // State for scientific calculator
  const [calcDisplay, setCalcDisplay] = useState("0");
  const [calcMemory, setCalcMemory] = useState(null);
  const [calcOperation, setCalcOperation] = useState(null);
  const [calcClearNext, setCalcClearNext] = useState(false);

  // Scientific calculator functions
  const clearCalc = () => {
    setCalcDisplay("0");
    setCalcMemory(null);
    setCalcOperation(null);
    setCalcClearNext(false);
  };

  const appendNumber = (num) => {
    if (calcDisplay === "0" || calcClearNext) {
      setCalcDisplay(num.toString());
      setCalcClearNext(false);
    } else {
      setCalcDisplay(calcDisplay + num);
    }
  };

  const appendDecimal = () => {
    if (calcClearNext) {
      setCalcDisplay("0.");
      setCalcClearNext(false);
    } else if (!calcDisplay.includes(".")) {
      setCalcDisplay(calcDisplay + ".");
    }
  };

  const setOperator = (op) => {
    const currentValue = parseFloat(calcDisplay);
    setCalcMemory(currentValue);
    setCalcOperation(op);
    setCalcClearNext(true);
  };

  const calculateResult = () => {
    const currentValue = parseFloat(calcDisplay);

    if (calcOperation && calcMemory !== null) {
      let result = 0;

      switch (calcOperation) {
        case "+":
          result = calcMemory + currentValue;
          break;
        case "-":
          result = calcMemory - currentValue;
          break;
        case "×":
          result = calcMemory * currentValue;
          break;
        case "÷":
          result = calcMemory / currentValue;
          break;
        case "pow":
          result = Math.pow(calcMemory, currentValue);
          break;
        default:
          result = currentValue;
      }

      // Round to 10 decimal places to avoid floating point precision issues
      result = Math.round(result * 1e10) / 1e10;

      setCalcDisplay(result.toString());
      setCalcMemory(null);
      setCalcOperation(null);
      setCalcClearNext(true);
    }
  };

  const scientificFunction = (func) => {
    const currentValue = parseFloat(calcDisplay);
    let result = 0;

    try {
      switch (func) {
        case "sqrt":
          result = Math.sqrt(currentValue);
          break;
        case "square":
          result = Math.pow(currentValue, 2);
          break;
        case "sin":
          result = Math.sin((currentValue * Math.PI) / 180); // Degrees
          break;
        case "cos":
          result = Math.cos((currentValue * Math.PI) / 180); // Degrees
          break;
        case "tan":
          result = Math.tan((currentValue * Math.PI) / 180); // Degrees
          break;
        case "log10":
          result = Math.log10(currentValue);
          break;
        case "ln":
          result = Math.log(currentValue);
          break;
        case "percent":
          result = currentValue / 100;
          break;
        case "inverse":
          result = 1 / currentValue;
          break;
        case "negate":
          result = -currentValue;
          break;
        case "pi":
          result = Math.PI;
          break;
        case "exp":
          result = Math.exp(currentValue);
          break;
        default:
          result = currentValue;
      }

      // Round to 10 decimal places to avoid floating point precision issues
      result = Math.round(result * 1e10) / 1e10;

      setCalcDisplay(result.toString());
      setCalcClearNext(true);
    } catch (e) {
      setCalcDisplay("Error");
      setCalcClearNext(true);
    }
  };

  // Render the calculator
  const renderCalculator = () => {
    if (!showCalculator) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="bg-white p-4 rounded-lg w-80">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Scientific Calculator</h3>
            <button
              className="text-gray-600 hover:text-gray-800"
              onClick={() => setShowCalculator(false)}
            >
              ✕
            </button>
          </div>

          <div className="bg-gray-100 p-3 mb-3 text-right rounded-lg h-12 flex items-center justify-end">
            <span className="text-xl font-mono">{calcDisplay}</span>
          </div>

          {/* Scientific functions row 1 */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("sqrt")}
            >
              √
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("square")}
            >
              x²
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setOperator("pow")}
            >
              xʸ
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("inverse")}
            >
              1/x
            </button>
          </div>

          {/* Scientific functions row 2 */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("sin")}
            >
              sin
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("cos")}
            >
              cos
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("tan")}
            >
              tan
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("percent")}
            >
              %
            </button>
          </div>

          {/* Scientific functions row 3 */}
          <div className="grid grid-cols-4 gap-1 mb-2">
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("log10")}
            >
              log
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("ln")}
            >
              ln
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("pi")}
            >
              π
            </button>
            <button
              className="p-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => scientificFunction("exp")}
            >
              eˣ
            </button>
          </div>

          {/* Basic calculator */}
          <div className="grid grid-cols-4 gap-1">
            <button
              className="p-2 bg-red-100 rounded hover:bg-red-200"
              onClick={clearCalc}
            >
              C
            </button>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setOperator("÷")}
            >
              ÷
            </button>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setOperator("×")}
            >
              ×
            </button>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => scientificFunction("negate")}
            >
              ±
            </button>

            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(7)}
            >
              7
            </button>
            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(8)}
            >
              8
            </button>
            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(9)}
            >
              9
            </button>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setOperator("-")}
            >
              −
            </button>

            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(4)}
            >
              4
            </button>
            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(5)}
            >
              5
            </button>
            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(6)}
            >
              6
            </button>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setOperator("+")}
            >
              +
            </button>

            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(1)}
            >
              1
            </button>
            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(2)}
            >
              2
            </button>
            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => appendNumber(3)}
            >
              3
            </button>
            <button
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold"
              onClick={calculateResult}
            >
              =
            </button>

            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100 col-span-2"
              onClick={() => appendNumber(0)}
            >
              0
            </button>
            <button
              className="p-2 bg-blue-50 rounded hover:bg-blue-100"
              onClick={appendDecimal}
            >
              .
            </button>
          </div>

          <button
            className="w-full bg-green-600 text-white p-2 rounded mt-3 font-bold"
            onClick={() => {
              setUserAnswer(calcDisplay);
              setShowCalculator(false);
            }}
          >
            Use Result
          </button>
        </div>
      </div>
    );
  };

  // Render different game screens
  const renderScreen = () => {
    switch (screen) {
      case "intro":
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">K-Pop Academy Detective</h1>
            <div className="bg-red-600 text-white p-2 rounded mb-4 text-center animate-pulse">
              <span className="font-bold">BREAKING NEWS:</span> Trainee Missing
              Before Debut!
            </div>
            <p className="mb-4">
              Min-ji, a promising trainee at Seoul's elite K-Pop Academy, has
              mysteriously disappeared right before her scheduled debut. As a
              math detective, you'll need to solve equations to find her!
            </p>
            <button
              className="w-full bg-blue-600 text-white p-3 rounded-lg mb-2"
              onClick={() => startMystery(1)}
            >
              Begin Investigation
            </button>
          </div>
        );

      case "mysteryIntro":
        const mysteryData = mysteries[mystery - 1];

        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="bg-red-600 text-white p-2 rounded mb-4 text-center animate-pulse">
              <span className="font-bold">BREAKING NEWS:</span>{" "}
              {mysteryData.title}
            </div>

            {renderDialogue()}

            <div className="mb-4 bg-blue-50 p-3 rounded border-l-4 border-blue-500">
              <h3 className="font-bold mb-2">Your Challenge:</h3>
              <ul className="list-disc pl-5">
                {mysteryData.clues.map((clue, index) => (
                  <li key={index}>
                    Find <strong>{clue}</strong>
                  </li>
                ))}
                <li>
                  Use the formula: <strong>{mysteryData.formula}</strong>
                </li>
              </ul>
            </div>

            <div className="flex gap-2 mb-4">
              <button
                className="flex-1 bg-blue-600 text-white p-3 rounded-lg"
                onClick={() => startPractice()}
              >
                Practice First
              </button>

              <button
                className="flex-1 bg-purple-600 text-white p-3 rounded-lg"
                onClick={() => startClue(1)}
              >
                Begin Investigation
              </button>
            </div>
          </div>
        );

      case "practice":
        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-3">Practice Mode</h2>

            <div className="mb-4 bg-yellow-50 p-3 rounded border-l-4 border-yellow-500">
              <p>
                Solve at least 5 problems with 80% accuracy to continue to the
                mystery.
              </p>
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Progress: {practiceStats.correct}/{practiceStats.attempted}{" "}
                    correct
                  </span>
                  <span>Accuracy: {practiceStats.accuracy}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                  <div
                    className={`h-2 rounded-full ${
                      practiceStats.accuracy >= 80
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{
                      width: `${Math.min(100, practiceStats.accuracy)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg text-center text-xl mb-4">
              {equation}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Solve for x:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                  placeholder="Enter your answer..."
                />
                <button
                  onClick={checkAnswer}
                  className="bg-blue-600 text-white p-3 rounded-lg"
                >
                  Check
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  feedback.includes("Correct")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {feedback}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowCalculator(true)}
                className="flex-1 bg-gray-200 p-3 rounded-lg"
              >
                Calculator
              </button>

              <button
                onClick={exitPractice}
                className={`flex-1 p-3 rounded-lg ${
                  practiceStats.accuracy >= 80 && practiceStats.attempted >= 5
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                Continue to Mystery
              </button>
            </div>
          </div>
        );

      case "gameplay":
        const currentMystery = mysteries[mystery - 1];

        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="bg-red-600 text-white p-2 rounded mb-4 text-center animate-pulse">
              <span className="font-bold">BREAKING NEWS:</span>{" "}
              {currentMystery.title}
            </div>

            <div className="text-sm text-gray-500 mb-2">
              Clue {clue}/3 • {currentMystery.clues[clue - 1]}
            </div>

            {renderDialogue()}

            <div className="bg-blue-100 p-4 rounded-lg text-center text-xl mb-4">
              {equation}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Solve for x:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                  placeholder="Enter your answer..."
                />
                <button
                  onClick={checkAnswer}
                  className="bg-blue-600 text-white p-3 rounded-lg"
                >
                  Check
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  feedback.includes("Correct")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {feedback}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowCalculator(true)}
                className="flex-1 bg-gray-200 p-3 rounded-lg"
              >
                Calculator
              </button>

              <button
                onClick={() => startPractice()}
                className="flex-1 bg-yellow-500 text-white p-3 rounded-lg"
              >
                More Practice
              </button>
            </div>
          </div>
        );

      case "finalPuzzle":
        const finalMystery = mysteries[mystery - 1];

        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="bg-red-600 text-white p-2 rounded mb-4 text-center animate-pulse">
              <span className="font-bold">BREAKING NEWS:</span>{" "}
              {finalMystery.title}
            </div>

            <h2 className="text-xl font-bold mb-3">Final Puzzle</h2>
            <p className="mb-4">
              You've collected all the clues! Now use the formula to solve the
              mystery.
            </p>

            <div className="bg-blue-100 p-3 rounded-lg mb-4">
              <p className="font-bold">Formula: {finalMystery.formula}</p>
              <p className="text-sm text-gray-600">
                Example: {finalMystery.example}
              </p>
            </div>

            <div className="mb-4 bg-gray-100 p-3 rounded-lg">
              <h3 className="font-bold mb-2">Your Clues:</h3>
              <ul>
                {finalMystery.clues.map((clue, index) => (
                  <li key={index} className="flex justify-between mb-1">
                    <span>{clue}:</span>
                    <span className="font-bold">{clueValues[clue] || "?"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Calculate the final answer:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="flex-1 p-3 border rounded-lg"
                  placeholder="Enter the result..."
                />
                <button
                  onClick={checkAnswer}
                  className="bg-blue-600 text-white p-3 rounded-lg"
                >
                  Check
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  feedback.includes("solved")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {feedback}
              </div>
            )}

            <button
              onClick={() => setShowCalculator(true)}
              className="w-full bg-gray-200 p-3 rounded-lg"
            >
              Calculator
            </button>
          </div>
        );

      case "mysteryComplete":
        const completedMystery = mysteries[mystery - 1];

        return (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="bg-green-600 text-white p-2 rounded mb-4 text-center">
              <span className="font-bold">MYSTERY SOLVED:</span>{" "}
              {completedMystery.title}
            </div>

            <h2 className="text-xl font-bold mb-3">
              Mystery {mystery} Complete!
            </h2>

            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              {mystery === 1
                ? "Great work! Min-ji was last seen on the 3rd floor in practice room 12 at 9PM. Now we have a lead on where to look next!"
                : "You found the hidden choreography video! It was captured on camera 4 at 7:00 and stored in unit 3. The choreography is amazing!"}
            </div>

            <div className="flex flex-col gap-2">
              {mystery < 2 ? (
                <button
                  className="w-full bg-blue-600 text-white p-3 rounded-lg"
                  onClick={() => startMystery(mystery + 1)}
                >
                  Continue to Next Mystery
                </button>
              ) : (
                <button
                  className="w-full bg-purple-600 text-white p-3 rounded-lg"
                  onClick={() => setScreen("intro")}
                >
                  Play Again
                </button>
              )}

              <button
                className="w-full bg-yellow-500 text-white p-3 rounded-lg"
                onClick={() => startPractice()}
              >
                Practice These Levels
              </button>
            </div>
          </div>
        );

      default:
        return <div>Loading...</div>;
    }
  };

  // Main component render
  return (
    <div className="bg-blue-50 min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <h1 className="text-xl font-bold">K-Pop Academy Detective</h1>
          <div className="font-bold">Score: {score}</div>
        </div>

        {renderScreen()}
        {renderCalculator()}
      </div>
    </div>
  );
}

export default MathMysteryGame;
