import { AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { useSnapshot } from 'valtio';
import state from '../store';

const Backdrop = () => {
	const snap = useSnapshot(state);
	const shadows = useRef();

	return (
		<>
			<AccumulativeShadows
				ref={shadows}
				color={snap.color}
				temporal
				frames={60}
				alphaTest={0.9}
				scale={10}
				rotation={[Math.PI / 2, 0.3, 0]}
				position={[-3, 0, -0.15]}
			>
				<RandomizedLight
					amount={6}
					radius={50}
					intensity={0.99}
					ambient={0.85}
					position={[30, -1, -5]}
				/>
			</AccumulativeShadows>
			{/* Add a point light at the back of the T-shirt */}
			<pointLight
	position={[0, 0, -3]}
	intensity={0.7}
	color="#ffffff"
	decay={2}
	shadow-mapSize-width={512} // Adjust shadow map size
	shadow-mapSize-height={512}
	shadow-radius={10} // Softens shadow edges
	distance={10}
/>

		</>
	);
};

export default Backdrop;
