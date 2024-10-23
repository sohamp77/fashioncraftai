import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import React, { useRef, useState } from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';
import Backdrop from './Backdrop'; // Import the Backdrop component

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  // State to track the accumulated rotation
  const [rotationX, setRotationX] = useState(0); // Track current rotation
  const maxRotation = Math.PI; // 180 degrees in radians
  const minRotation = -Math.PI; // -180 degrees in radians

  const [lastMouseX, setLastMouseX] = useState(0); // Track the last mouse position to calculate distance moved

  useFrame((state, delta) => {
    const isBreakpointLarge = window.innerWidth > 1920;
    const isBreakpoint1920 = window.innerWidth > 1440 && window.innerWidth <= 1920;
    const isBreakpoint1440 = window.innerWidth > 1280 && window.innerWidth <= 1440;
    const isBreakpoint1280 = window.innerWidth > 1024 && window.innerWidth <= 1280;
    const isBreakpoint768 = window.innerWidth > 768 && window.innerWidth <= 1024;
    const isBreakpoint430 = window.innerWidth > 430 && window.innerWidth <= 768;
    const isMobile = window.innerWidth > 320 && window.innerWidth <= 430;

    //* Set the initial position of the model based on breakpoints
    let targetPosition = [-0.4, 0, 2];
    if (snap.intro) {
      switch (true) {
        case isBreakpointLarge:
          targetPosition = [-0.35, 0, 2.5];
          break;
        case isBreakpoint1920:
          targetPosition = [-0.25, 0, 2];
          break;
        case isBreakpoint1440:
          targetPosition = [-0.25, 0, 2];
          break;
        case isBreakpoint1280:
          targetPosition = [-0.35, 0, 2.5];
          break;
        case isBreakpoint768:
          targetPosition = [-0.35, 0, 2.8];
          break;
        case isBreakpoint430:
          targetPosition = [0, 0.2, 3];
          break;
        case isMobile:
          targetPosition = [0, 0.18, 2.8];
          break;
        default:
          targetPosition = [0, 0.18, 2.8];
          break;
      }
    } else {
      if (isBreakpoint430) {
        targetPosition = [0, 0, 2.8];
      } else if (isMobile) {
        targetPosition = [0, -0.05, 3];
      } else {
        targetPosition = [0, -0.025, 2];
      }
    }

    //* Set the camera position smoothl
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    //* Calculate rotation based on horizontal mouse movement
    const mouseX = state.pointer.x;
    const distanceMoved = mouseX - lastMouseX; // Calculate how far the mouse has moved horizontally
    const sensitivity = 4; // Adjust sensitivity to slow down rotation
    const rotationSpeed = distanceMoved * sensitivity; // The longer the mouse movement, the faster it rotates

    // Accumulate rotation but clamp between -180 and 180 degrees
    setRotationX((prev) => {
      let newRotation = prev + rotationSpeed;

      // Clamp the rotation between -180 and 180 degrees (or -π and π in radians)
      if (newRotation > maxRotation) newRotation = maxRotation;
      if (newRotation < minRotation) newRotation = minRotation;

      return newRotation;
    });

    // Update the last mouse position
    setLastMouseX(mouseX);

    //* Apply the calculated rotation to the group (limited to one full 180-degree rotation)
    group.current.rotation.y = rotationX;

    //* Smooth rotation based on vertical mouse movement (optional)
    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 10, rotationX, 0], // Horizontal rotation is now based on accumulated mouseX
      0.25,
      delta
    );
  });

  return (
    <>
      {/* Pass the shirt rotation to the Backdrop component */}
      <Backdrop shirtRotation={rotationX} />
      <group ref={group}>{children}</group>
    </>
  );
};

export default CameraRig;
