import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import { usePressedKeys } from "../Player/usePressedKeys";
import { Direction } from "../Scene";

export const JOYSTICK_RADIUS = 64;
const JOYSTICK_THUMB_RADIUS = JOYSTICK_RADIUS / 2;
export const JOYSTICK_PADDING = JOYSTICK_RADIUS / 2;

export const THRESHOLD = JOYSTICK_RADIUS / 2 - JOYSTICK_THUMB_RADIUS / 2;
export const MAX_THUMB_XY = THRESHOLD;
export const MIN_THUMB_YY = -THRESHOLD;

const trans1 = (x, y) => `translate3d(${x}px,${y}px,0)`;

export function Joystick() {
  const { setPressedKeys, setLastPressedKey } = usePressedKeys();

  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 0.1, tension: 1050, friction: 100 },
  }));

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    onMouseMove(e);
  }
  function onMouseMove(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    // x ranges from -JOYSTICK_RADIUS to JOYSTICK_RADIUS
    const mouseX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const mouseY = "clientY" in e ? e.clientY : e.touches[0].clientY;
    const joystickCenterX =
      window.innerWidth - JOYSTICK_RADIUS - JOYSTICK_PADDING;
    const joystickCenterY =
      window.innerHeight - JOYSTICK_RADIUS - JOYSTICK_PADDING;

    const x = Math.max(
      MIN_THUMB_YY,
      Math.min(MAX_THUMB_XY, mouseX - joystickCenterX)
    );
    const y = Math.max(
      MIN_THUMB_YY,
      Math.min(MAX_THUMB_XY, mouseY - joystickCenterY)
    );

    const distance = Math.sqrt(x * x + y * y);
    if (distance < JOYSTICK_RADIUS) {
      const angle = Math.atan2(y, x);
      const x2 = (JOYSTICK_RADIUS / 2) * Math.cos(angle);
      const y2 = (JOYSTICK_RADIUS / 2) * Math.sin(angle);

      const up = y2 < THRESHOLD;
      const down = y2 > -THRESHOLD;
      const left = x2 < THRESHOLD;
      const right = x2 > -THRESHOLD;

      const moveX = Math.abs(x) > THRESHOLD / 2;
      const moveY = Math.abs(y) > THRESHOLD / 2;

      const nextPressedKeys = [
        ...(moveY && up ? ["ArrowUp"] : []),
        ...(moveY && down ? ["ArrowDown"] : []),
        ...(moveX && left ? ["ArrowLeft"] : []),
        ...(moveX && right ? ["ArrowRight"] : []),
      ] as Direction[];

      const dxFromCenter = Math.abs(x) / THRESHOLD;
      const dyFromCenter = Math.abs(y) / THRESHOLD;

      setPressedKeys(nextPressedKeys);
      setLastPressedKey(nextPressedKeys[nextPressedKeys.length - 1]);
      set({ xy: [x2 * dxFromCenter, y2 * dyFromCenter] });
    } else {
      setPressedKeys([]);
    }
  }
  const onMouseUp = (e) => {
    // e.stopPropagation();
    // e.preventDefault();

    setPressedKeys([]);
    set({ xy: [0, 0] });
  };

  return (
    <JoystickStyles
      {...{
        onMouseMove,
        onPointerMove: onMouseMove,
        onTouchMove,
        onTouchStart: onMouseMove,
        onMouseUp,
        onPointerUp: onMouseUp,
        onTouchEnd: onMouseUp,
        onDrag: onMouseMove,
        onDragEnd: onMouseUp,
        onDragStart: onMouseMove,
        onMouseDown: onMouseMove,
        onPointerDown: onMouseMove,
      }}
    >
      <animated.div
        style={{ transform: xy.to(trans1) }}
        className="joystickThumb"
      ></animated.div>
    </JoystickStyles>
  );
}
const JoystickStyles = styled.div`
  position: fixed;
  bottom: ${JOYSTICK_PADDING}px;
  right: ${JOYSTICK_PADDING}px;
  background: rgb(255 255 255 / 35%);
  border-radius: 50%;
  width: ${JOYSTICK_RADIUS * 2}px;
  height: ${JOYSTICK_RADIUS * 2}px;
  box-shadow: inset 0 0 4px 4px rgb(68 63 63 / 17%);
  pointer-events: none;
  .joystickThumb {
    pointer-events: auto;
    margin-top: ${JOYSTICK_THUMB_RADIUS - 1}px;
    margin-left: ${JOYSTICK_THUMB_RADIUS - 1}px;
    width: ${JOYSTICK_THUMB_RADIUS * 2}px;
    height: ${JOYSTICK_THUMB_RADIUS * 2}px;
    background: rgba(85, 80, 80, 0.815);
    box-shadow: 0 0 3px 1px rgb(68 63 63 / 37%);
    border-radius: 50%;
  }
`;
