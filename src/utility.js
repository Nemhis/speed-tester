const MILLISECOND_PER_SECOND = 1000;

const mSecondToSeconds = (milliseconds) => milliseconds > 0 ? milliseconds / MILLISECOND_PER_SECOND : milliseconds;

module.exports = {
  mSecondToSeconds
};
