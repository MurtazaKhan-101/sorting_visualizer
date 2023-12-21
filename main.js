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
}

function insertionSort() {
  let start = performance.now();
  sortedNumbers = insertionSortHelper([...originalNumbers]);
  let end = performance.now();
  displayResults(start, end, "Insertion Sort", sortedNumbers);
  timeComplexityElement.textContent = "Time Complexity: O(n^2)";
}

function insertionSortHelper(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  // Update bars after each pass of the outer loop
  updateBars(arr);

  return arr;
}

function heapSort() {
  let start = performance.now();
  heapSortHelper([...originalNumbers]);
  let end = performance.now();
  displayResults(start, end, "Heap Sort", sortedNumbers);
  timeComplexityElement.textContent = "Time Complexity: O(n log n)";
}

function heapSortHelper(arr) {
  let n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from the heap in descending order
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  sortedNumbers = arr;
  updateBars();
}

function heapify(arr, n, i) {
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
    heapify(arr, n, largest);
  }
}


function quickSort() {
  let start = performance.now();
  quickSortHelper([...originalNumbers], 0, originalNumbers.length - 1);
  let end = performance.now();
  displayResults(start, end, "Quick Sort", sortedNumbers);
  timeComplexityElement.textContent =
    "Time Complexity: O(n^2) (worst case) | O(n log n) (average case)";
}

function quickSortHelper(arr, low, high) {
  while (low < high) {
    let pi = partition(arr, low, high);

    // Tail call optimization
    if (pi - low < high - pi) {
      quickSortHelper(arr, low, pi - 1);
      low = pi + 1;
    } else {
      quickSortHelper(arr, pi + 1, high);
      high = pi - 1;
    }
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  sortedNumbers = arr;
  updateBars();
  return i + 1;
}


function countingSort() {
  let start = performance.now();
  sortedNumbers = countingSortHelper([...originalNumbers]);
  let end = performance.now();
  displayResults(start, end, "Counting Sort", sortedNumbers);
  timeComplexityElement.textContent = "Time Complexity: O(n + k)";
}

function countingSortHelper(arr) {
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
      updateBars(sortedArr);
    }
  }

  return sortedArr;
}

function findLCS() {
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

function updateBars(arr) {
  barsContainer.innerHTML = "";
  let numbers = arr || sortedNumbers;

  for (let i = 0; i < numbers.length; i++) {
    let bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${numbers[i] * 0.3}px`;
    barsContainer.appendChild(bar);
  }

  setTimeout(() => {}, 50);
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
