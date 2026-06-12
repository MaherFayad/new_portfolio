"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export interface DisplacementHoverProps {
  initialImage: string;
  displacementImage: string;
  intensity?: number;
  speedIn?: number;
  width: number;
  height: number;
  onWebGLReady?: () => void;
}

export interface DisplacementHoverRef {
  transitionTo: (image: string) => void;
  preloadImages: (images: string[]) => void;
}

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float dispFactor;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D disp;
uniform float intensity;
uniform float angle1;
uniform float angle2;
uniform vec2 uvScale1;
uniform vec2 uvScale2;

mat2 getRotM(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

void main() {
  vec4 dispVal = texture2D(disp, vUv);
  vec2 dispVec = vec2(dispVal.r, dispVal.g);

  vec2 scaledUv1 = (vUv - 0.5) * uvScale1 + 0.5;
  vec2 scaledUv2 = (vUv - 0.5) * uvScale2 + 0.5;

  vec2 distPos1 = scaledUv1 + getRotM(angle1) * dispVec * intensity * dispFactor;
  vec2 distPos2 = scaledUv2 + getRotM(angle2) * dispVec * intensity * (1.0 - dispFactor);

  vec4 t1 = texture2D(texture1, distPos1);
  vec4 t2 = texture2D(texture2, distPos2);

  gl_FragColor = mix(t1, t2, dispFactor);
}
`;

interface WebGLState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  loader: THREE.TextureLoader;
  textureCache: Map<string, THREE.Texture>;
  currentImage: string;
  activeTargetImage: string | null;
  requestedImage: string | null;
  tween: gsap.core.Tween | null;
  ready: boolean;
}

const getUvScale = (texture: THREE.Texture, containerWidth: number, containerHeight: number): THREE.Vector2 => {
  const image = texture.image as any;
  if (!image || !image.width || !image.height) {
    return new THREE.Vector2(1, 1);
  }
  const r = containerWidth / containerHeight;
  const ri = image.width / image.height;
  if (r > ri) {
    return new THREE.Vector2(1, ri / r);
  } else {
    return new THREE.Vector2(r / ri, 1);
  }
};

const DisplacementHover = forwardRef<DisplacementHoverRef, DisplacementHoverProps>(
  (
    {
      initialImage,
      displacementImage,
      intensity = 0.5,
      speedIn = 1.4,
      width,
      height,
      onWebGLReady,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onWebGLReadyRef = useRef(onWebGLReady);
    onWebGLReadyRef.current = onWebGLReady;

    const initialImageRef = useRef(initialImage);
    const webglStateRef = useRef<WebGLState | null>(null);
    const pendingTransitionRef = useRef<string | null>(null);
    const transitionFnRef = useRef<((state: WebGLState, target: string) => void) | (() => void)>(() => {});

    const executeTransition = useCallback(
      (state: WebGLState, targetImage: string) => {
        if (
          targetImage === state.activeTargetImage ||
          targetImage === state.requestedImage ||
          targetImage === state.currentImage
        ) {
          return;
        }

        if (state.tween) {
          state.tween.kill();
          if (state.activeTargetImage) {
            state.material.uniforms.texture1.value = state.material.uniforms.texture2.value;
            state.material.uniforms.uvScale1.value.copy(state.material.uniforms.uvScale2.value);
            state.currentImage = state.activeTargetImage;
          }
          state.material.uniforms.dispFactor.value = 0;
          state.activeTargetImage = null;
          state.tween = null;
          state.renderer.render(state.scene, state.camera);
        }

        if (targetImage === state.currentImage) return;

        state.requestedImage = targetImage;

        const onTextureLoaded = (tex: THREE.Texture) => {
          if (state.requestedImage === targetImage) {
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            
            const scale2 = getUvScale(tex, width, height);
            state.material.uniforms.uvScale2.value.copy(scale2);
            
            state.material.uniforms.texture2.value = tex;
            state.material.uniforms.dispFactor.value = 0;
            state.activeTargetImage = targetImage;
            state.renderer.render(state.scene, state.camera);

            state.tween = gsap.to(state.material.uniforms.dispFactor, {
              value: 1,
              duration: speedIn,
              ease: "expo.out",
              onUpdate: () => state.renderer.render(state.scene, state.camera),
              onComplete: () => {
                state.material.uniforms.texture1.value = tex;
                state.material.uniforms.uvScale1.value.copy(scale2);
                state.material.uniforms.dispFactor.value = 0;
                state.currentImage = targetImage;
                if (state.requestedImage === targetImage) {
                  state.requestedImage = null;
                }
                state.activeTargetImage = null;
                state.renderer.render(state.scene, state.camera);
                state.tween = null;
              },
            });
          }
        };

        const cached = state.textureCache.get(targetImage);
        if (cached) {
          onTextureLoaded(cached);
        } else {
          state.loader.load(targetImage, (tex) => {
            state.textureCache.set(targetImage, tex);
            onTextureLoaded(tex);
          });
        }
      },
      [speedIn, width, height]
    );

    transitionFnRef.current = executeTransition;

    useImperativeHandle(
      ref,
      () => ({
        transitionTo: (image: string) => {
          const state = webglStateRef.current;
          if (!state?.ready) {
            pendingTransitionRef.current = image;
            return;
          }
          executeTransition(state, image);
        },
        preloadImages: (images: string[]) => {
          const state = webglStateRef.current;
          if (state?.ready) {
            for (const img of images) {
              if (img && !state.textureCache.has(img)) {
                state.loader.load(img, (tex) => {
                  tex.minFilter = THREE.LinearFilter;
                  tex.magFilter = THREE.LinearFilter;
                  state.textureCache.set(img, tex);
                });
              }
            }
          }
        },
      }),
      [executeTransition]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container || width === 0 || height === 0) return;

      pendingTransitionRef.current = null;

      // WebGL Init
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        1,
        1000
      );
      camera.position.z = 1;

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0xffffff, 0);
      renderer.setSize(width, height);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      container.appendChild(renderer.domElement);

      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "";

      let loadedCount = 0;
      const checkLoaded = () => {
        loadedCount += 1;
        if (loadedCount < 2) return;

        const handleReady = () => {
          const state = webglStateRef.current;
          if (!state) return;
          state.ready = true;
          renderer.render(scene, camera);
          onWebGLReadyRef.current?.();

          const pending = pendingTransitionRef.current;
          pendingTransitionRef.current = null;
          if (pending && pending !== state.currentImage) {
            executeTransition(state, pending);
          }
        };

        handleReady();
      };

      const dispTex = loader.load(displacementImage, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        checkLoaded();
      });

      const material = new THREE.ShaderMaterial({
        uniforms: {
          intensity: { value: intensity },
          dispFactor: { value: 0 },
          texture1: { value: new THREE.Texture() },
          texture2: { value: new THREE.Texture() },
          disp: { value: dispTex },
          angle1: { value: Math.PI / 4 },
          angle2: { value: -3 * Math.PI / 4 },
          uvScale1: { value: new THREE.Vector2(1, 1) },
          uvScale2: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
      });

      const initTex = loader.load(initialImageRef.current, (tex) => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        
        const scale = getUvScale(tex, width, height);
        material.uniforms.uvScale1.value.copy(scale);
        material.uniforms.uvScale2.value.copy(scale);
        material.uniforms.texture1.value = tex;
        material.uniforms.texture2.value = tex;
        
        renderer.render(scene, camera);
        checkLoaded();
      });

      const geometry = new THREE.PlaneGeometry(width, height, 1);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      renderer.render(scene, camera);

      webglStateRef.current = {
        renderer,
        scene,
        camera,
        material,
        loader,
        textureCache: new Map([[initialImageRef.current, initTex]]),
        currentImage: initialImageRef.current,
        activeTargetImage: null,
        requestedImage: null,
        tween: null,
        ready: false,
      };

      return () => {
        const state = webglStateRef.current;
        if (state) {
          state.tween?.kill();
          state.renderer.dispose();
          state.material.dispose();
          state.textureCache.forEach((tex) => tex.dispose());
        }
        geometry.dispose();
        const canvas = container.querySelector("canvas");
        canvas?.remove();
        webglStateRef.current = null;
      };
    }, [displacementImage, width, height, intensity, executeTransition]);

    return <div ref={containerRef} style={{ width: "100%", aspectRatio: "1 / 1" }} />;
  }
);

DisplacementHover.displayName = "DisplacementHover";

export default DisplacementHover;
