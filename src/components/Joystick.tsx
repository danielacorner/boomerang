import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import { atom, useAtom } from "jotai";
import { SetStateAction } from "react";

const joystickPositionAtom = atom([0, 0]);
export function useJoystickPosition(): [
  number[],
  (update: SetStateAction<number[]>) => void
] {
  const [joystickPosition, setJoystickPosition] = useAtom(joystickPositionAtom);
  return [joystickPosition, setJoystickPosition];
}
const JOYSTICK_RADIUS = 64;

export function Joystick() {
  const [joystickPosition, setJoystickPosition] = useJoystickPosition();
  console.log("🌟🚨 ~ Joystick ~ joystickPosition", joystickPosition);
  const springPosition = useSpring({
    x: joystickPosition[0],
    y: joystickPosition[1],
  });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("🌟🚨 ~ onMouseMove ~ e", e);
    const x = e.clientX - JOYSTICK_RADIUS;

    const mouseDistanceFromBottom = window.innerHeight - e.clientY;
    const y = window.innerHeight - e.clientY - JOYSTICK_RADIUS;
    const distance = Math.sqrt(x * x + y * y);
    console.log("🌟🚨 ~ onMouseMove ~ distance", distance);
    console.log("🌟🚨 ~ onMouseMove ~ x, y", x, y);
    if (distance > JOYSTICK_RADIUS) {
      const angle = Math.atan2(y, x);
      const x2 = JOYSTICK_RADIUS * Math.cos(angle);
      const y2 = JOYSTICK_RADIUS * Math.sin(angle);
      setJoystickPosition([x2, y2]);
    } else {
      setJoystickPosition([x, y]);
    }
  };
  const onMouseUp = () => {
    setJoystickPosition([0, 0]);
  };
  return (
    <JoystickStyles>
      <animated.div
        style={springPosition}
        onMouseMove={onMouseMove}
        onPointerMove={onMouseMove}
        onMouseUp={onMouseUp}
        className="joystickThumb"
      ></animated.div>
    </JoystickStyles>
  );
}
const JoystickStyles = styled.div`
  position: fixed;
  bottom: ${JOYSTICK_RADIUS / 2}px;
  right: ${JOYSTICK_RADIUS / 2}px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  width: ${JOYSTICK_RADIUS * 2}px;
  height: ${JOYSTICK_RADIUS * 2}px;
  .joystickThumb {
    margin-top: ${JOYSTICK_RADIUS / 2 - 1}px;
    margin-left: ${JOYSTICK_RADIUS / 2 - 1}px;
    width: ${JOYSTICK_RADIUS}px;
    height: ${JOYSTICK_RADIUS}px;
    background: rgba(148, 36, 36, 0.5);
    border-radius: 50%;
  }
`;
