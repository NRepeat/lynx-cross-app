import { useEffect, useState } from 'react';

const SECOND = 1000;
const MINUTE = SECOND * 60;

export default function useCountdownTimer(
  initialMinutes = 0,
  autoStart = true,
  preCountdownSeconds = 10,
) {
  // Store remaining time in milliseconds for main timer
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * MINUTE);
  // Track if main timer is running
  const [isRunning, setIsRunning] = useState(false);
  // Pre-countdown timer in seconds
  const [preCountdown, setPreCountdown] = useState(
    autoStart ? preCountdownSeconds : 0,
  );
  // Track if pre-countdown is active
  const [isPreCountdownActive, setIsPreCountdownActive] = useState(autoStart);

  // Start the pre-countdown and then the main timer
  const startTimer = (minutes) => {
    setTimeRemaining(minutes * MINUTE);
    setPreCountdown(preCountdownSeconds);
    setIsPreCountdownActive(true);
    setIsRunning(false);
  };

  // Pause both timers
  const pauseTimer = () => {
    setIsRunning(false);
    setIsPreCountdownActive(false);
  };

  // Resume the appropriate timer
  const resumeTimer = () => {
    if (preCountdown > 0) {
      setIsPreCountdownActive(true);
    } else if (timeRemaining > 0) {
      setIsRunning(true);
    }
  };

  // Reset everything
  const resetTimer = () => {
    setTimeRemaining(initialMinutes * MINUTE);
    setPreCountdown(preCountdownSeconds);
    setIsPreCountdownActive(autoStart);
    setIsRunning(false);
  };

  // Skip the pre-countdown and start main timer immediately
  const skipPreCountdown = () => {
    setPreCountdown(0);
    setIsPreCountdownActive(false);
    setIsRunning(true);
  };

  // Pre-countdown effect
  useEffect(() => {
    let intervalId;

    if (isPreCountdownActive && preCountdown > 0) {
      intervalId = setInterval(() => {
        setPreCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setIsPreCountdownActive(false);
            setIsRunning(true); // Auto-start main timer when pre-countdown ends
            return 0;
          }
          return prev - 1;
        });
      }, SECOND);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPreCountdownActive, preCountdown]);

  // Main timer effect
  useEffect(() => {
    let intervalId;

    if (isRunning && timeRemaining > 0) {
      intervalId = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= SECOND) {
            clearInterval(intervalId);
            setIsRunning(false);
            return 0;
          }
          return prev - SECOND;
        });
      }, SECOND);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, timeRemaining]);

  // Calculate hours, minutes, and seconds for main timer
  const hours = Math.floor(timeRemaining / (MINUTE * 60));
  const minutes = Math.floor((timeRemaining % (MINUTE * 60)) / MINUTE);
  const seconds = Math.floor((timeRemaining % MINUTE) / SECOND);

  return {
    hours,
    minutes,
    seconds,
    preCountdown,
    isRunning,
    isPreCountdownActive,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipPreCountdown,
    timeRemaining,
  };
}
