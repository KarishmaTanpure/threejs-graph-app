import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDGraph = ({ data }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        mount.appendChild(renderer.domElement);

      
        scene.background = new THREE.Color(0x000000);
        camera.position.set(0, 50, 100);
        camera.lookAt(0, 0, 0);

     
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 10, 10).normalize();
        scene.add(directionalLight);

       
        const gridHelper = new THREE.GridHelper(200, 50);
        scene.add(gridHelper);

      
        data.forEach(item => {
            const startNode = parseFloat(item.startNode);
            const endNode = parseFloat(item.endNode);

            if (isNaN(startNode) || isNaN(endNode)) return;

            const startVector = new THREE.Vector3(startNode, 0, 0);
            const endVector = new THREE.Vector3(endNode, 0, 0);

          
            const distance = startVector.distanceTo(endVector);
            const midPoint = new THREE.Vector3().addVectors(startVector, endVector).divideScalar(2);
            
         
            const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, distance, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

           
            const pipe = new THREE.Mesh(cylinderGeometry, material);
            pipe.position.copy(midPoint); 

           
            pipe.lookAt(endVector); 

         
            const offset = 0.1; 
            pipe.position.y += offset; 

            scene.add(pipe);
        });

        
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            mount.removeChild(renderer.domElement);
        };
    }, [data]);

    return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
};

export default ThreeDGraph;
