const passwordDisplay = document.querySelector(".password-display");
const passwordPlaceholder = document.querySelector(".password-placeholder");
const passwordCopyButton = document.querySelector(".copy-btn");
const passwordCopiedNotification = document.querySelector(".copied-text");

const passwordForm = document.querySelector(".password-settings");
const lengthSlider = document.querySelector(".char-length-slider");
const charCount = document.querySelector(".char-count");
const checkBoxes = document.querySelectorAll("input[type=checkbox]");

const strengthDescription = document.querySelector(".strength-rating-text");
const strengthRatingBars = document.querySelectorAll(".bar");

const CHARACTER_SETS = {
  uppercase: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", 26],
  lowercase: ["abcdefghijklmnopqrstuvwxyz", 26],
  numbers: ["1234567890", 10],
  symbols: ["!@#$%^&*()", 10],
};

let canCopy = false;

const getSliderVal = () => {
  charCount.textContent = lengthSlider.value;
};

const styleRangeSlider = () => {
  const min = lengthSlider.min;
  const max = lengthSlider.max;
  const val = lengthSlider.value;

  lengthSlider.style.backgroundSize =
    ((val - min) * 100) / (max - min) + "% 100%";
};

const handleSliderInput = () => {
  getSliderVal();
  styleRangeSlider();
};

const resetBarStyles = () => {
  strengthRatingBars.forEach((bar) => {
    bar.style.backgroundColor = "transparent";
    bar.style.borderColor = "hsl(252, 11%, 91%)";
  });
};

const styleBars = ([...barElements], color) => {
  barElements.forEach((bar) => {
    bar.style.backgroundColor = color;
    bar.style.borderColor = color;
  });
};

const styleMeter = (rating) => {
  const text = rating[0];
  const numBars = rating[1];
  const barsToFill = Array.from(strengthRatingBars).slice(0, numBars);

  resetBarStyles();

  strengthDescription.textContent = text;

  switch (numBars) {
    case 1:
      return styleBars(barsToFill, "hsl(0, 91%, 63%)");
    case 2:
      return styleBars(barsToFill, "hsl(13, 95%, 66%)");
    case 3:
      return styleBars(barsToFill, "hsl(42, 91%, 68%)");
    case 4:
      return styleBars(barsToFill, "hsl(127, 100%, 82%");
    default:
      throw new Error("Invalid value for numBars");
  }
};

const calcStrength = (passwordLength, charPoolSize) => {
  const strength = passwordLength * Math.log2(charPoolSize);

  if (strength < 25) {
    return ["Too Weak!", 1];
  } else if (strength >= 25 && strength < 50) {
    return ["Weak", 2];
  } else if (strength >= 50 && strength < 75) {
    return ["Medium", 3];
  } else {
    return ["Strong", 4];
  }
};

const generatePassword = (e) => {
  e.preventDefault();
  try {
    validateInput();

    let generatedPassword = "";
    let includedSets = [];
    let charPool = 0;

    checkBoxes.forEach((box) => {
      if (box.checked) {
        includedSets.push(CHARACTER_SETS[box.value][0]);
        charPool += CHARACTER_SETS[box.value][1];
      }
    });

    if (includedSets) {
      for (let i = 0; i < lengthSlider.value; i++) {
        const randSetIndex = Math.floor(Math.random() * includedSets.length);
        const randSet = includedSets[randSetIndex];

        const randCharIndex = Math.floor(Math.random() * randSet.length);
        const randChar = randSet[randCharIndex];

        generatedPassword += randChar;
      }
    }

    const strength = calcStrength(lengthSlider.value, charPool);
    styleMeter(strength);

    passwordDisplay.textContent = generatedPassword;
    canCopy = true;
  } catch (err) {
    console.log(err);
  }
};

const validateInput = () => {
  if (Array.from(checkBoxes).every((box) => box.checked === false)) {
    throw new Error("Make sure to check at least one box");
  }
};

const copyPassword = async () => {
  if (!passwordDisplay.textContent || passwordCopiedNotification.textContent)
    return;
  if (!canCopy) return;

  await navigator.clipboard.writeText(passwordDisplay.textContent);
  passwordCopiedNotification.textContent = "Copied";

  setTimeout(() => {
    passwordCopiedNotification.style.transition = "all 1s";
    passwordCopiedNotification.style.opacity = 0;

    setTimeout(() => {
      passwordCopiedNotification.style.removeProperty("opacity");
      passwordCopiedNotification.style.removeProperty("transition");
      passwordCopiedNotification.textContent = "";
    }, 1000);
  }, 1000);
};

charCount.textContent = lengthSlider.value;

passwordCopyButton.addEventListener("click", copyPassword);
lengthSlider.addEventListener("input", handleSliderInput);
passwordForm.addEventListener("submit", generatePassword);
