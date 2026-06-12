"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import * as THREE from "three";
import { gsap } from "gsap";
import { MOUSE_EFFECTS_MIN_WIDTH } from "@/hooks/useMouseEffectsEnabled";

interface PreloaderProps {
  onComplete: () => void;
  onStartExit: () => void;
}

function BackgroundStreams({ compact = false }: { compact?: boolean }) {
  const streams = [
    { text: "012345678901234567890123456789", duration: 25 },
    { text: "MAHERFAYADPRODUCTDESIGNER", duration: 35 },
    { text: "987654321098765432109876543210", duration: 30 },
    { text: "INTERFACEEXPERIENCEACCESSIBILITY", duration: 45 },
    { text: "012345678901234567890123456789", duration: 28 },
    { text: "DEVELOPMENTMOTIONGRAPHICS", duration: 40 },
    { text: "987654321098765432109876543210", duration: 22 },
    { text: "UXUIFINTECHFINANCEBANKING", duration: 48 },
  ];

  const visibleStreams = compact ? streams.filter((_, idx) => idx % 2 === 0) : streams;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05] max-sm:opacity-[0.03] select-none flex justify-around max-sm:px-2">
      {visibleStreams.map((stream, idx) => {
        const chars = (stream.text + stream.text + stream.text).split("");
        return (
          <div
            key={idx}
            className="w-4 max-sm:w-3 flex flex-col items-center overflow-hidden h-full text-[10px] max-sm:text-[8px] font-mono text-white select-none"
          >
            <div
              className="flex flex-col gap-1.5 animate-vertical-scroll"
              style={{
                animationDuration: `${stream.duration}s`,
                animationDirection: idx % 2 === 0 ? "normal" : "reverse",
              }}
            >
              {chars.map((char, cidx) => (
                <span key={cidx} className="block leading-none">
                  {char}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Preloader({ onComplete, onStartExit }: PreloaderProps) {
  const [exiting, setExiting] = useState(false);
  const [spheresExiting, setSpheresExiting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const progress = useMotionValue(0);
  const roundedProgress = useTransform(progress, (latest) => Math.round(latest));
  const mountRef = useRef<HTMLDivElement>(null);

  const mouseRef = useRef({ x: 0, y: 0 });
  const ringARef = useRef<THREE.Mesh | null>(null);
  const ringBRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    // Animate progress count from 0 to 100 in 3 seconds
    const countAnimation = animate(progress, 100, {
      duration: 3.0,
      ease: [0.76, 0, 0.24, 1],
    });

    const spheresExitTimer = setTimeout(() => {
      setSpheresExiting(true);
    }, 2500);

    const exitTimer = setTimeout(() => {
      setExiting(true);
    }, 3000);

    const startExitTimer = setTimeout(() => {
      onStartExit?.();
    }, 3400);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 5200);

    return () => {
      countAnimation.stop();
      clearTimeout(spheresExitTimer);
      clearTimeout(exitTimer);
      clearTimeout(startExitTimer);
      clearTimeout(completeTimer);
    };
  }, [progress, onComplete, onStartExit]);

  // Read percentage as string for rendering
  const [progressVal, setProgressVal] = useState(0);
  useEffect(() => {
    return roundedProgress.on("change", (val) => setProgressVal(val));
  }, [roundedProgress]);

  // Track viewport for mobile-specific layout and scene tuning
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Track mouse coordinates over window bounds (-1 to 1) on desktop only
  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${MOUSE_EFFECTS_MIN_WIDTH}px)`);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current = { x, y };
    };

    const attach = () => {
      if (query.matches) {
        window.addEventListener("mousemove", handleMouseMove);
      }
    };

    const detach = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      mouseRef.current = { x: 0, y: 0 };
    };

    const onChange = () => {
      detach();
      attach();
    };

    attach();
    query.addEventListener("change", onChange);
    return () => {
      query.removeEventListener("change", onChange);
      detach();
    };
  }, []);
  // Animate ThreeJS exit sequence when state changes to spheresExiting
  useEffect(() => {
    if (spheresExiting && ringARef.current && ringBRef.current) {
      gsap.timeline()
        .to(ringBRef.current.position, { y: -10, duration: 0.8, ease: "power4.in" })
        .to(ringARef.current.position, { y: -10, duration: 0.8, ease: "power4.in" }, "-=0.7");
    }
  }, [spheresExiting]);

  // Three.js spheres preloader initialization with mouse interaction and fonts ready lifecycle
  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    let animationFrameId = 0;
    let disposed = false;
    let resizeObserver: ResizeObserver | null = null;
    let removeResizeListener: (() => void) | null = null;

    const initScene = (): (() => void) | null => {
      if (disposed) return null;

      const width = mountEl.clientWidth;
      const height = mountEl.clientHeight;
      if (width === 0 || height === 0) return null;

      const mobile = window.innerWidth < 768;
      const mobileRingScale = 0.56 * 2;

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(mobile ? 42 : 50, width / height, 0.1, 100);
      camera.position.set(0, mobile ? 0.15 : 0, mobile ? 8.8 : 6);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
      mountEl.appendChild(renderer.domElement);

      // Grouping for wobble and tilt
      const tiltGroup = new THREE.Group();
      tiltGroup.rotation.x = mobile ? -0.22 : -0.6;
      scene.add(tiltGroup);

      const wobbleGroup = new THREE.Group();
      wobbleGroup.scale.setScalar(mobile ? mobileRingScale : 1);
      wobbleGroup.position.y = mobile ? 0.35 : 0;
      tiltGroup.add(wobbleGroup);

      // Custom shader material: alpha smooth mapping
      const alphaSmoothMaterial = (map: THREE.Texture) => {
        return new THREE.ShaderMaterial({
          uniforms: { map: { value: map } },
          vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
          fragmentShader: `
          uniform sampler2D map;
          varying vec2 vUv;
          void main() {
            vec4 texColor = texture2D(map, vUv);
            float alphaThreshold = 0.05;
            if (texColor.a < alphaThreshold) discard;
            float alphaFactor = smoothstep(alphaThreshold, alphaThreshold + 0.05, texColor.a);
            vec3 premultipliedRGB = texColor.rgb * alphaFactor;
            gl_FragColor = vec4(premultipliedRGB, texColor.a * alphaFactor);
          }
        `,
          transparent: true,
          side: THREE.DoubleSide,
        });
      };

      // Helper to generate text ribbons procedurally without solid background strip
      const makeRibbonTexture = (text: string, fontCSS: string, stripHeight: number, letterSpacing = 0, textColor = "#ffffff") => {
        const W = 2048, H = 1024;
        const cnv = document.createElement("canvas");
        cnv.width = W;
        cnv.height = H;
        const ctx = cnv.getContext("2d");
        if (!ctx) return new THREE.Texture();

        // Clear the canvas to be completely transparent - no background strip!
        ctx.clearRect(0, 0, W, H);

        // Draw text
        ctx.fillStyle = textColor;
        ctx.font = fontCSS;
        ctx.textBaseline = "middle";

        const metrics = ctx.measureText(text);
        const pad = 24;
        const scaleX = (W - pad * 2) / (metrics.width + letterSpacing * text.length);

        ctx.save();
        ctx.translate(pad, H / 2);
        ctx.scale(scaleX, 1);

        if (letterSpacing > 0) {
          let x = 0;
          for (const ch of text) {
            ctx.fillText(ch, x, 2);
            x += ctx.measureText(ch).width + letterSpacing;
          }
        } else {
          ctx.fillText(text, 0, 2);
        }
        ctx.restore();

        const tex = new THREE.CanvasTexture(cnv);
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.needsUpdate = true;
        return tex;
      };

      const geo = new THREE.SphereGeometry(1, mobile ? 40 : 64, mobile ? 40 : 64);

      const RIBBON_A = mobile
        ? {
            text: "DESIGN THAT CHANGES THE WORLD",
            stripHeight: 88,
            fontCSS: '400 88px "Bebas Neue", sans-serif',
          }
        : {
            text: "DESIGN THAT CHANGES THE WORLD",
            stripHeight: 150,
            fontCSS: '400 150px "Bebas Neue", sans-serif',
          };
      const RIBBON_B = mobile
        ? {
            text: "UX/UI • PRODUCT DESIGN • DEVELOPMENT",
            stripHeight: 30,
            fontCSS: '400 22px "Space Mono", monospace',
          }
        : {
            text: "WEB DESIGN • UX/UI DESIGN • CREATIVE DESIGN • PRODUCT AND APP DESIGN • DEVELOPMENT",
            stripHeight: 44,
            fontCSS: '400 30px "Space Mono", monospace',
          };

      const texA = makeRibbonTexture(RIBBON_A.text, RIBBON_A.fontCSS, RIBBON_A.stripHeight, 0, "#D9D9D9");
      const texB = makeRibbonTexture(RIBBON_B.text, RIBBON_B.fontCSS, RIBBON_B.stripHeight, 0, "#757575");

      const ringA = new THREE.Mesh(geo, alphaSmoothMaterial(texA));
      const ringB = new THREE.Mesh(geo, alphaSmoothMaterial(texB));

      ringARef.current = ringA;
      ringBRef.current = ringB;

      wobbleGroup.add(ringA, ringB);

      // Set initial positions off-screen below
      ringA.position.y = -8;
      ringB.position.y = -8;

      const targetAngle = { x: 0, y: 0 };

      // Wait for the fonts to load, then swap textures and play entrance GSAP timeline
      Promise.all([
        document.fonts.load(RIBBON_A.fontCSS),
        document.fonts.load(RIBBON_B.fontCSS),
      ]).catch(() => { }).then(() => {
        if (disposed) return;
        (ringA.material as THREE.ShaderMaterial).uniforms.map.value = makeRibbonTexture(RIBBON_A.text, RIBBON_A.fontCSS, RIBBON_A.stripHeight, 0, "#D9D9D9");
        (ringB.material as THREE.ShaderMaterial).uniforms.map.value = makeRibbonTexture(RIBBON_B.text, RIBBON_B.fontCSS, RIBBON_B.stripHeight, 0, "#757575");

        gsap.timeline()
          .to(ringA.position, { y: mobile ? 0.11 : 0.18, duration: 2.0, delay: 0.5, ease: "power4.out" })
          .to(ringB.position, { y: mobile ? -0.11 : -0.18, duration: 1.5, ease: "power4.out" }, "-=1.5");
      });

      // Animation render loop
      const clock = new THREE.Clock();
      const wobbleStrength = mobile ? 0.5 : 1;

      const animateLoop = () => {
        if (disposed) return;

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // 1. Revolve spheres in the same direction at different speeds
        ringA.rotation.y -= (mobile ? 0.22 : 0.3) * delta;
        ringB.rotation.y -= (mobile ? 0.36 : 0.5) * delta;

        // 2. Slow ambient wobble on the parent group
        wobbleGroup.rotation.x = 0.4 + 0.05 * wobbleStrength * Math.sin(0.2 * elapsed);
        wobbleGroup.rotation.z = 0.2 + 0.05 * wobbleStrength * Math.cos(0.25 * elapsed);
        wobbleGroup.position.y = (mobile ? 0.35 : 0) + 0.05 * wobbleStrength * Math.sin(0.3 * elapsed);

        // 3. Camera mouse orbit interpolation (desktop only)
        if (!mobile) {
          targetAngle.x += 0.05 * (0.6 * mouseRef.current.y - targetAngle.x);
          targetAngle.y += 0.05 * (0.6 * mouseRef.current.x - targetAngle.y);

          const theta = Math.PI / 2 - targetAngle.x;
          const phi = targetAngle.y + Math.PI;

          camera.position.x = 6 * Math.sin(theta) * Math.cos(phi);
          camera.position.y = 6 * Math.cos(theta);
          camera.position.z = 6 * Math.sin(theta) * Math.sin(phi);
          camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animateLoop);
      };

      animateLoop();

      const handleResize = () => {
        if (disposed) return;
        const w = mountEl.clientWidth;
        const h = mountEl.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", handleResize);
      removeResizeListener = () => window.removeEventListener("resize", handleResize);

      return () => {
        disposed = true;
        cancelAnimationFrame(animationFrameId);
        removeResizeListener?.();
        if (renderer.domElement.parentElement === mountEl) {
          mountEl.removeChild(renderer.domElement);
        }
        geo.dispose();
        ringA.geometry.dispose();
        (ringA.material as THREE.ShaderMaterial).dispose();
        texA.dispose();

        ringB.geometry.dispose();
        (ringB.material as THREE.ShaderMaterial).dispose();
        texB.dispose();

        renderer.dispose();
        ringARef.current = null;
        ringBRef.current = null;
      };
    };

    let cleanupScene: (() => void) | undefined;

    const tryInit = () => {
      if (cleanupScene) return;
      const cleanup = initScene();
      if (cleanup) {
        cleanupScene = cleanup;
        resizeObserver?.disconnect();
        resizeObserver = null;
      }
    };

    tryInit();

    if (!cleanupScene) {
      resizeObserver = new ResizeObserver(() => tryInit());
      resizeObserver.observe(mountEl);
    }

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      cleanupScene?.();
    };
  }, []);

  return (
    <motion.div
      className="loader bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
      style={{ pointerEvents: exiting ? "none" : "auto" }}
    >
      <BackgroundStreams compact={isMobile} />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes preloader-scroll-vertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); }
        }
        .animate-vertical-scroll {
          animation: preloader-scroll-vertical linear infinite;
        }
      `}} />

      <div className="h-full px-5 max-sm:px-4 relative pointer-events-none z-10">
        <div className="hidden lg:grid grid-cols-12 gap-5 h-full max-w-[1920px] mx-auto">

          {/* Bottom Left Info Text */}
          <motion.div
            className={`col-[5/8] flex items-end justify-start pb-[140px] ${exiting ? "pointer-events-none" : "pointer-events-auto"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={exiting ? { opacity: 0, x: -60 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.3 }}
          >
            <div className="flex flex-col font-semibold text-sm tracking-[-0.03em] uppercase text-white/40 [&_span]:block leading-none">
              <div className="text-left">
                <span>Making high-</span>
                <span>quality projects</span>
              </div>
              <div className="text-right mt-1">
                <span>since</span>
                <span>2022</span>
              </div>
            </div>
          </motion.div>

          {/* Top Right Logo */}
          <motion.div
            className={`col-[8/9] flex items-start justify-start pt-40 ${exiting ? "pointer-events-none" : "pointer-events-auto"}`}
            initial={{ opacity: 0, x: 20 }}
            animate={exiting ? { opacity: 0, x: 60 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.3 }}
          >
            <img
              src="/assets/logo.svg"
              alt="Maher Fayad"
              width={98}
              height={27}
              className="w-auto h-auto max-w-[75px]"
            />
          </motion.div>

        </div>

        {/* Mobile chrome: fixed corners with safe-area padding */}
        <div className="lg:hidden h-full relative">
          <motion.div
            className={`absolute top-[max(1.25rem,env(safe-area-inset-top))] right-0 ${exiting ? "pointer-events-none" : "pointer-events-auto"}`}
            initial={{ opacity: 0, y: -12 }}
            animate={exiting ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.3 }}
          >
            <img
              src="/assets/logo.svg"
              alt="Maher Fayad"
              width={58}
              height={16}
              className="w-[46px] h-auto"
            />
          </motion.div>

          <motion.div
            className={`absolute left-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] max-w-[11rem] ${exiting ? "pointer-events-none" : "pointer-events-auto"}`}
            initial={{ opacity: 0, y: 16 }}
            animate={exiting ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.3 }}
          >
            <div className="flex flex-col font-semibold text-[11px] leading-[1.15] tracking-[-0.03em] uppercase text-white/40 [&_span]:block">
              <span>Making high-quality</span>
              <span>projects since 2022</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fullscreen Three.js Canvas Container */}
      <div
        ref={mountRef}
        className={`absolute inset-0 z-0 ${exiting ? "pointer-events-none" : "pointer-events-auto"}`}
      />

      {/* Centered progress counter */}
      <motion.div
        className="loader-counter"
        initial={{ opacity: 0 }}
        animate={exiting ? { opacity: 0, scale: 0.8, filter: "blur(20px)" } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1], delay: exiting ? 0 : 0.25 }}
      >
        <span>{progressVal}</span>%
      </motion.div>
    </motion.div>
  );
}
