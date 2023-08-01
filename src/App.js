import "./App.scss";
import { useRef, useEffect, useState } from "react";
import alarm from "./alarm.mp3";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [sessionLength, setSessionLength] = useState(sessionTime / 60);

  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [status, setStatus] = useState("default");
  const clockInterval = 1000;
  // tried with local beep file but it doesnt work for some reason TODO: find out why local files are 'unsuitable' to be played
  const beep =
    "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";
  function play() {
    alarm.play();
  }

  function rewind() {
    alarm.pause();
    alarm.currentTime = 0;
  }
  // when the user presses the start_stop button the timer begins counting down to zero
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        // console.log(sessionTime);
        setSessionTime((previousSessionTime) => {
          if (previousSessionTime <= 0 && !onBreak) {
            setOnBreak(!onBreak);
            play();
            return breakLength * 60;
          } else if (previousSessionTime <= 0 && onBreak) {
            setOnBreak(!onBreak);
            play();
            return sessionLength * 60;
          }

          return previousSessionTime - 1;
        });
      }, clockInterval);
    }
    return () => {
      clearInterval(timer);
    };
  }, [isRunning, breakLength, onBreak, sessionLength]);

  function startStopTimer() {
    //toggle timer
    setIsRunning(!isRunning);
    status === "default" && setStatus("running");
  }
  function resetTimer() {
    setStatus("default");
    setIsRunning(false);
    setOnBreak(false);
    setSessionLength(25);
    setSessionTime(25 * 60);
    setBreakLength(5);
    rewind();
  }

  function formatTime(time) {
    //time is represented in seconds so divide to get mins and mod to get seconds
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  }

  function changeTime(type, amount) {
    if (isRunning || onBreak) return false;
    if (status === "running") return false;
    if (type === "break") {
      if (amount === -1 && breakLength === 1) return false;
      if (breakLength === 60) return false;
      setBreakLength((prev) => prev + amount);
    } else if (type === "session") {
      if (amount === -1 && sessionLength === 1) return false;
      if (sessionLength === 60) return false;
      setSessionLength((prev) => prev + amount);
      !isRunning && setSessionTime((sessionLength + amount) * 60);
    }
  }

  return (
    <div className="App">
      <TimerSetting
        title={"Break length"}
        type={"break"}
        time={breakLength}
        changeTime={changeTime}
        formatTime={formatTime}
      />
      <TimerSetting
        title={"Session Length"}
        type={"session"}
        time={sessionLength}
        changeTime={changeTime}
        formatTime={formatTime}
      />
      {/* displayed time */}
      <div id="timer">
        <div id="timer-label">{onBreak ? "Break" : "Session"}</div>
        <div id="time-left">{formatTime(sessionTime)}</div>
        <button id="start_stop" onClick={startStopTimer}>
          <i class="bi bi-play-fill"></i>
          <i class="bi bi-pause-fill"></i>
        </button>
        <button id="reset" onClick={resetTimer}>
          <i class="bi bi-skip-start-fill"></i>
        </button>
        <audio
          ref={(audio) => (alarm = audio)}
          id="beep"
          preload="auto"
          src={beep}
        />
      </div>
    </div>
  );
}

function TimerSetting({ title, type, time, changeTime, formatTime }) {
  return (
    <>
      <div id={`${type}-label`}>{title}</div>
      <button id={`${type}-decrement`} onClick={() => changeTime(type, -1)}>
        <i class="bi bi-dash-square-fill"></i>
      </button>
      <button id={`${type}-increment`} onClick={() => changeTime(type, 1)}>
        <i class="bi bi-plus-square-fill"></i>
      </button>
      <div id={`${type}-length`}>{time}</div>
    </>
  );
}
export default App;
