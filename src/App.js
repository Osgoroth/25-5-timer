import "./App.scss";
import { useEffect, useState, useRef } from "react";

import ticking from "./ticking-clock.mp3";
import alarm from "./alarm.mp3";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [sessionLength, setSessionLength] = useState(sessionTime / 60);

  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [status, setStatus] = useState("default");
  const clockInterval = 1000;

  const alarmRef = useRef(null);
  const tickingRef = useRef(null);

  // const tick = new Audio(ticking);
  function play() {
    alarmRef.current.play();
  }

  function rewind() {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
  }

  function startTicking() {
    tickingRef.current.loop = true;
    tickingRef.current.play();
  }

  function stopTicking() {
    tickingRef.current.pause();
    tickingRef.current.currentTime = 0;
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
    if (isRunning) {
      console.log("paused");
      stopTicking();
    } else {
      startTicking();
      console.log("resumed");
    }
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
    <>
      <div className="App">
        <h1 id="title">25 + 5 Clock</h1>
        <div id="timer-settings">
          <TimerSetting
            title={"Break"}
            type={"break"}
            time={breakLength}
            changeTime={changeTime}
            formatTime={formatTime}
          />
          <TimerSetting
            title={"Session"}
            type={"session"}
            time={sessionLength}
            changeTime={changeTime}
            formatTime={formatTime}
          />
        </div>
        {/* displayed time */}
        <div id="timer">
          <div id="timer-label">{onBreak ? "Break" : "Session"}</div>
          <div id="time-left">{formatTime(sessionTime)}</div>
          <i
            id="start_stop"
            className={`bi ${!isRunning ? "bi-play-fill" : " bi-pause-fill"}`}
            onClick={startStopTimer}
          />
          <i
            id="reset"
            className="bi bi-skip-start-fill"
            onClick={resetTimer}
          />
          <audio
            ref={alarmRef}
            type="audio/mp3"
            id="beep"
            preload="auto"
            src={alarm}
          />
          <audio
            ref={tickingRef}
            type="audio/mp3"
            id="tick"
            preload="auto"
            src={ticking}
          />
        </div>
        <div id="footer">
          <p>Created by</p>
          <p id="creator">David Lucas</p>
        </div>
      </div>
    </>
  );
}

function TimerSetting({ title, type, time, changeTime }) {
  return (
    <div className="timer-group">
      <div id={`${type}-label`} className="full-title">
        {title} length
      </div>
      <div id={`${type}-label`} className="short-title">
        {title}
      </div>
      <div className="button-group">
        <i
          id={`${type}-decrement`}
          onClick={() => changeTime(type, -1)}
          className="bi bi-dash-square-fill"
        />
        <div id={`${type}-length`}>{time}</div>
        <i
          id={`${type}-increment`}
          onClick={() => changeTime(type, 1)}
          className="bi bi-plus-square-fill"
        />
      </div>
    </div>
  );
}
export default App;
