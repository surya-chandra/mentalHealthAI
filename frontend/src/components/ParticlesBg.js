import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBg() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      init={particlesInit}
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        particles: {
          number: { value: 35 },
          color: { value: "#00c6ff" },
          links: {
            enable: true,
            color: "#00c6ff",
            opacity: 0.2
          },
          move: {
            enable: true,
            speed: 0.5
          },
          opacity: { value: 0.3 },
          size: { value: 2 }
        }
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0
      }}
    />
  );
}
