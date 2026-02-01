const getRandomValue = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
}


const doSomeHeavyTask = () => {
  const ms = getRandomValue([100, 150, 200, 250, 300, 600, 500, 1000, 1400, 2500]);
  const shouldThrowError = getRandomValue([false, false, false, false, false, true]);

  if (shouldThrowError) {
    const randomError = getRandomValue([
      "Db Payment Failed",
      "Db Connection Lost",
      "Timeout Error",
      "Unknown Error Occurred",
      "Service Unavailable"
    ]);
    throw new Error(randomError );
  }

  return new Promise((resolve) => setTimeout(() => resolve(ms), ms));


}

module.exports = { doSomeHeavyTask };