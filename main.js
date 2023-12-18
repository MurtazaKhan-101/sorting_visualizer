let originalNumbers = [];
let sortedNumbers = [];
let compilationTimeElement = document.getElementById("compilationTime");
let timeComplexityElement = document.getElementById("timeComplexity");
let lcsResultElement = document.getElementById("lcsResult");
let barsContainer = document.getElementById("bars-container");
let slider = document.getElementById("slider-visualizer");
let sliderSpan = document.getElementById("slider-span");

function sliderChange() {
  let sliderValue = document.getElementById("slider-visualizer").value;
  document.getElementById("slider-span").textContent = sliderValue;
  generateNumbers(sliderValue);
}

function generateNumbers() {
  originalNumbers = [];
  sortedNumbers = [];
  compilationTimeElement.textContent = "";
  timeComplexityElement.textContent = "";
  lcsResultElement.textContent = "";

  barsContainer.innerHTML = "";

  let numElements = parseInt(slider.value);
  let maxHeight = 0;

  for (let i = 0; i < numElements; i++) {
    let number = Math.floor(Math.random() * 1000) + 1;
    originalNumbers.push(number);
    maxHeight = Math.max(maxHeight, number);

    let bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${number * 0.3}px`;
    barsContainer.appendChild(bar);
  }

  barsContainer.style.height = `${maxHeight * 0.3}px`;

  // document.getElementById(
  //   "originalNumbers"
  // ).innerHTML = `Original Numbers:<br>${originalNumbers.join(", ")}`;
  // document.getElementById("sortedNumbers").textContent = "";
}

async function insertionSort() {
  let start = performance.now();
  sortedNumbers = await insertionSortHelper([...originalNumbers]);
  let end = performance.now();
  displayResults(start, end, "Insertion Sort", sortedNumbers);
  timeComplexityElement.textContent = "Time Complexity: O(n^2)";
}

async function insertionSortHelper(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      await updateBars(arr);
    }

    arr[j + 1] = key;
    await updateBars(arr);
  }

  return arr;
}

async function heapSort() {
  let start = performance.now();
  await heapSortHelper([...originalNumbers]);
  let end = performance.now();
  displayResults(start, end, "Heap Sort", sortedNumbers);
  timeComplexityElement.textContent = "Time Complexity: O(n log n)";
}

async function heapSortHelper(arr) {
  let n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    await heapify(arr, i, 0);
    await updateBars(arr);
  }

  sortedNumbers = arr;
  updateBars();
}

async function heapify(arr, n, i) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    await new Promise((resolve) => setTimeout(resolve, 50));
    await heapify(arr, n, largest);
    await updateBars(arr);
  }
}

async function quickSort() {
  let start = performance.now();
  await quickSortHelper([...originalNumbers], 0, originalNumbers.length - 1);
  let end = performance.now();
  displayResults(start, end, "Quick Sort", sortedNumbers);
  timeComplexityElement.textContent =
    "Time Complexity: O(n^2) (worst case) | O(n log n) (average case)";
}

async function quickSortHelper(arr, low, high) {
  if (low < high) {
    let pi = await partition(arr, low, high);
    await quickSortHelper(arr, low, pi - 1);
    await quickSortHelper(arr, pi + 1, high);
  }
}

async function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      await new Promise((resolve) => setTimeout(resolve, 50));
      await updateBars(arr);
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  sortedNumbers = arr;
  updateBars();
  return i + 1;
}

async function countingSort() {
  let start = performance.now();
  sortedNumbers = await countingSortHelper([...originalNumbers]);
  let end = performance.now();
  displayResults(start, end, "Counting Sort", sortedNumbers);
  timeComplexityElement.textContent = "Time Complexity: O(n + k)";
}

async function countingSortHelper(arr) {
  let max = Math.max(...arr);
  let min = Math.min(...arr);
  let count = Array.from({ length: max - min + 1 }, () => 0);

  for (let num of arr) {
    count[num - min]++;
  }

  let sortedArr = [];
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      sortedArr.push(i + min);
      count[i]--;
      await new Promise((resolve) => setTimeout(resolve, 50));
      await updateBars(sortedArr);
    }
  }

  return sortedArr;
}

async function findLCS() {
  let start = performance.now();
  let string1 = document.getElementById("string1").value;
  let string2 = document.getElementById("string2").value;
  let lcsResult = longestCommonSubsequence(string1, string2);
  let end = performance.now();
  displayResults(start, end, "Find LCS", lcsResult);
  timeComplexityElement.textContent = "Time Complexity: O(m * n)";
}

function longestCommonSubsequence(str1, str2) {
  let m = str1.length;
  let n = str2.length;

  let dp = new Array(m + 1).fill(null).map(() => new Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  let lcs = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcs.unshift(str1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  let lcsResult = lcs.join("");
  lcsResultElement.textContent = `LCS Result: ${lcsResult} (length: ${lcsResult.length}) between "${str1}" and "${str2}"`;
  return lcsResult;
}

async function updateBars(arr) {
  barsContainer.innerHTML = "";
  let numbers = arr || sortedNumbers;

  for (let i = 0; i < numbers.length; i++) {
    let bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${numbers[i] * 0.3}px`;
    barsContainer.appendChild(bar);
  }

  await new Promise((resolve) => setTimeout(resolve, 50));
}

function displayResults(start, end, algorithm, result) {
  compilationTimeElement.textContent = `Compilation time for ${algorithm}: ${
    end - start
  } milliseconds`;
  // document.getElementById(
  //   "sortedNumbers"
  // ).textContent = `${algorithm} Result: ${result}`;
}

generateNumbers();
