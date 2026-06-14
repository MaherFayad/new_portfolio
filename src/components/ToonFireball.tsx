"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// Shader code from CodePen
const vert = `
    varying vec3 vNormal;
    varying vec3 camPos;
    varying vec2 vUv;

    void main() {
      vNormal = normal;
      vUv = uv;
      camPos = cameraPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;


const frag = `
#define NUM_OCTAVES 5
#define M_PI 3.1415926535897932384626433832795
uniform vec4 resolution;
varying vec3 vNormal;
uniform sampler2D perlinnoise;
uniform sampler2D sparknoise;
uniform float time;
uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;
varying vec3 camPos;
varying vec2 vUv;

float setOpacity(float r, float g, float b, float tonethreshold) {
  float tone = (r + g + b) / 3.0;
  float alpha = 1.0;
  if(tone<tonethreshold) {
    alpha = 0.0;
  }
  return alpha;
}

vec3 rgbcol(vec3 col) {
  return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
  vec2 delta = UV - Center;
  float radius = length(delta) * 2. * RadialScale;
  float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
  return vec2(radius, angle);
}

void main() {
  vec2 olduv = gl_FragCoord.xy/resolution.xy ;
  vec2 uv = vUv ; 
  vec2 imguv = uv;
  float scale = 1.;
  olduv *= 0.5 + time; 
  olduv.y = olduv.y ;
  vec2 p = olduv*scale;
  vec4 txt = texture2D(perlinnoise, olduv);
  float gradient = dot(normalize( -camPos ), normalize( vNormal ));
  float pct = distance(vUv,vec2(0.5));

  vec3 rgbcolor0 = rgbcol(color0);
  vec3 rgbcolor1 = rgbcol(color1);
  vec3 rgbcolor2 = rgbcol(color2);
  vec3 rgbcolor5 = rgbcol(color5);

  float y = smoothstep(0.16,0.525,pct);
  vec3 backcolor = mix(rgbcolor0, rgbcolor5, y);

  gl_FragColor = vec4(backcolor,1.);

  vec2 center = vec2(0.5);
  vec2 cor = UnityPolarCoordinates(vec2(vUv.x,vUv.y), center, 1., 1.);

  vec2 newUv = vec2(cor.x + time,cor.x*0.2+cor.y);
  vec3 noisetex = texture2D(perlinnoise,mod(newUv,1.)).rgb;    
  vec3 noisetex2 = texture2D(sparknoise,mod(newUv,1.)).rgb;    

  float tone0 =  1. - smoothstep(0.3,0.6,noisetex.r);
  float tone1 =  smoothstep(0.3,0.6,noisetex2.r);

  float opacity0 = setOpacity(tone0,tone0,tone0,.29);
  float opacity1 = setOpacity(tone1,tone1,tone1,.49);

  if(opacity1>0.0){
    gl_FragColor = vec4(rgbcolor2,0.)*vec4(opacity1);
  } else if(opacity0>0.0){
    gl_FragColor = vec4(rgbcolor1,0.)*vec4(opacity0);
  }   
}
`;

const vertcylinder = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 pos = vec3(position.x/1.,position.y,position.z/1.);
        if(pos.y >= 1.87){
            pos = vec3(position.x*(sin((position.y - 0.6)*1.27)-0.16),position.y,position.z*(sin((position.y - 0.6)*1.27)-0.16));
        } else{
            pos = vec3(position.x*(sin((position.y/2. -  .01)*.11)+0.75),position.y,position.z*(sin((position.y/2. -  .01)*.11)+0.75));
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
`;

const fragcylinder = `
    varying vec2 vUv;
    uniform sampler2D perlinnoise;
    uniform vec3 color4;
    uniform float time;
    varying vec3 vNormal;

    vec3 rgbcol(vec3 col) {
        return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
    }

    void main() {
        vec3 noisetex = texture2D(perlinnoise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;    
        gl_FragColor = vec4(noisetex.r);

        if(gl_FragColor.r >= 0.5){
            gl_FragColor = vec4(rgbcol(color4),gl_FragColor.r);
        }else{
            gl_FragColor = vec4(0.);
        }
        gl_FragColor *= vec4(sin(vUv.y) - 0.1);
        gl_FragColor *= vec4(smoothstep(0.3,0.628,vUv.y));
    }
`;

const vertflame = `
    varying vec2 vUv;
    varying vec3 camPos;
    varying vec3 vNormal;
    varying vec3 nois;
    uniform sampler2D noise;
    uniform float time;

    void main() {
        vUv = uv;
        camPos = cameraPosition;
        vNormal = normal;
        vec3 pos = vec3(position.x/1.,position.y,position.z/1.);
        vec3 noisetex = texture2D(noise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;
        if(pos.y >= 1.87){
            pos = vec3(position.x*(sin((position.y - 0.64)*1.27)-0.12),position.y,position.z*(sin((position.y - 0.64)*1.27)-0.12));
        } else{
            pos = vec3(position.x*(sin((position.y/2. -  .01)*.11)+0.79),position.y,position.z*(sin((position.y/2. -  .01)*.11)+0.79));
        }
        pos.xz *= noisetex.r;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
`;

const fragflame = `
    varying vec2 vUv;
    uniform sampler2D perlinnoise;
    uniform sampler2D noise;
    uniform vec3 color4;
    uniform float time;
    varying vec3 camPos;
    varying vec3 vNormal;
    varying vec3 nois;

    vec3 rgbcol(vec3 col) {
        return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
    }
      
    void main() {
        vec3 noisetex = texture2D(noise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;
        gl_FragColor = vec4(noisetex.r);

        if(gl_FragColor.r >= 0.44){
            gl_FragColor = vec4(rgbcol(color4),gl_FragColor.r);
        } else{
            gl_FragColor = vec4(0.);
        }
        gl_FragColor *= vec4(smoothstep(0.2,0.628,vUv.y));
    }
`;

const options = {
  bloomStrength: 1.0, // Tamed down the brightness/glare
  bloomRadius: 0.39,
  color0: [0, 0, 0],
  color1: [81, 14, 5],
  color2: [181, 156, 24],
  color3: [66, 66, 66],
  color4: [79, 79, 79],
  color5: [64, 27, 0]
};

export default function ToonFireball() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 482;
    let height = container.clientHeight || 600;

    // Expand canvas rendering size and camera distance relative to the visual container
    // to allow the bloom glow and trails to render fully without hard-edge WebGL viewport clipping.
    const overflowScale = 1.4;
    const canvasWidth = width * overflowScale;
    const canvasHeight = height * overflowScale;

    // 1. Create Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    camera.position.set(
      3.4369982203815655 * 1.25,
      3.5239085092722098 * 1.25,
      2.994862383531814 * 1.25
    );
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 2. Create Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(new THREE.Color('#000'));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvasWidth, canvasHeight);

    // Position and scale the canvas centered with negative offsets to overflow the container bounds
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.width = "140%";
    renderer.domElement.style.height = "140%";
    renderer.domElement.style.left = "-20%";
    renderer.domElement.style.top = "-20%";
    renderer.domElement.style.pointerEvents = "none";

    container.appendChild(renderer.domElement);


    // 3. Post Processing (Bloom)
    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(canvasWidth, canvasHeight),
      options.bloomStrength,
      options.bloomRadius,
      0.0 // Set threshold to 0.0 to match original CodePen glow
    );

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    // 5. Load textures locally from /assets/...
    const textureLoader = new THREE.TextureLoader();
    const noise9 = textureLoader.load("/assets/noise9.jpg");
    const sparklenoise = textureLoader.load("/assets/sparklenoise.jpg");
    const waterMin = textureLoader.load("/assets/water-min.jpg");

    // 6. Mesh (Core Fireball Sphere)
    const sphereGeometry = new THREE.SphereGeometry(1, 30, 30);
    const sphereMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        perlinnoise: { value: noise9 },
        sparknoise: { value: sparklenoise },
        color5: { value: new THREE.Vector3(...options.color5) },
        color4: { value: new THREE.Vector3(...options.color4) },
        color3: { value: new THREE.Vector3(...options.color3) },
        color2: { value: new THREE.Vector3(...options.color2) },
        color1: { value: new THREE.Vector3(...options.color1) },
        color0: { value: new THREE.Vector3(...options.color0) },
        resolution: { value: new THREE.Vector2(canvasWidth, canvasHeight) }
      },
      vertexShader: vert,
      fragmentShader: frag
    });

    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.scale.set(0.78, 0.78, 0.78);
    sphereMesh.position.set(1, 0, 0);
    scene.add(sphereMesh);

    // 7. Cylinder (Toon Steam Trail)
    const cylinderGeometry = new THREE.CylinderGeometry(1.11, 0, 5.3, 50, 50, true);
    const cylinderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        perlinnoise: { value: waterMin },
        color4: { value: new THREE.Vector3(...options.color4) },
        time: { value: 0.0 },
        noise: { value: noise9 }
      },
      vertexShader: vertcylinder,
      fragmentShader: fragcylinder,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinderMesh.rotation.set(0, 0, -Math.PI / 2);
    cylinderMesh.position.set(1 - 4.05, 0, 0);
    cylinderMesh.scale.set(1.5, 1.7, 1.5);
    scene.add(cylinderMesh);

    // 8. Flame (Flame Trail)
    const flameGeometry = new THREE.CylinderGeometry(1, 0, 5.3, 50, 50, true);
    const flameMaterial = new THREE.ShaderMaterial({
      uniforms: {
        perlinnoise: { value: waterMin },
        color4: { value: new THREE.Vector3(...options.color5) },
        time: { value: 0.0 },
        noise: { value: noise9 }
      },
      vertexShader: vertflame,
      fragmentShader: fragflame,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const flameMesh = new THREE.Mesh(flameGeometry, flameMaterial);
    flameMesh.rotation.set(0, 0, -Math.PI / 2);
    flameMesh.position.set(1 - 4.78, 0, 0);
    flameMesh.scale.set(2, 2, 2);
    scene.add(flameMesh);

    // 9. Animation Loop
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Update shader uniform times based on elapsed millisecond timestamp
      sphereMaterial.uniforms.time.value = -timestamp / (1000 * 2);
      cylinderMaterial.uniforms.time.value = -timestamp / (3000 * 2);
      flameMaterial.uniforms.time.value = -timestamp / (3000 * 2);

      // Render scene through EffectComposer (Bloom)
      bloomComposer.render();
    };

    animationFrameId = requestAnimationFrame(animate);

    // 10. Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const cw = w * overflowScale;
      const ch = h * overflowScale;

      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
      bloomComposer.setSize(cw, ch);
      sphereMaterial.uniforms.resolution.value.set(cw, ch);
    };

    window.addEventListener("resize", handleResize);

    // 11. Cleanup logic on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose Geometries
      sphereGeometry.dispose();
      cylinderGeometry.dispose();
      flameGeometry.dispose();

      // Dispose Materials
      sphereMaterial.dispose();
      cylinderMaterial.dispose();
      flameMaterial.dispose();

      // Dispose Textures
      noise9.dispose();
      sparklenoise.dispose();
      waterMin.dispose();

      // Remove Canvas
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="relative w-full flex justify-center items-center overflow-visible pointer-events-none"
      style={{ zIndex: -999 }}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-[482px] aspect-[482/600] flex justify-center items-center overflow-visible pointer-events-none"
      />
    </div>
  );
}
