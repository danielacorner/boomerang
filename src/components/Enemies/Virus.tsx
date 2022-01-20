export const Virus = ({ RandomVirus }) => {
  return (
    <group
      castShadow={true}
      receiveShadow={true}
      scale={2}
      position={[0, -1.6, 0]}
      rotation={[0, 0, 0]}
    >
      {/* <VirusEnemy {...{ id }} /> */}
      <RandomVirus />
    </group>
  );
};
