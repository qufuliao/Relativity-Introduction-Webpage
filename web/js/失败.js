// 时空弯曲模拟 - 使用Three.js
function initSpacetimeSimulation() {
    // 创建场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    
    // 创建相机
    const container = document.getElementById('spacetime-container');
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 30, 30);
    camera.lookAt(0, 0, 0);
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    // 创建网格表示时空
    const gridSize = 30;
    const gridDivisions = 20;
    const grid = new THREE.Group();
    
    // 创建网格线
    for (let i = -gridSize / 2; i <= gridSize / 2; i += gridSize / gridDivisions) {
        // X方向线
        const xLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, 0, -gridSize / 2),
                new THREE.Vector3(i, 0, gridSize / 2)
            ]),
            new THREE.LineBasicMaterial({ color: 0x3498db, transparent: true, opacity: 0.5 })
        );
        grid.add(xLine);
        
        // Z方向线
        const zLine = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-gridSize / 2, 0, i),
                new THREE.Vector3(gridSize / 2, 0, i)
            ]),
            new THREE.LineBasicMaterial({ color: 0x3498db, transparent: true, opacity: 0.5 })
        );
        grid.add(zLine);
    }
    scene.add(grid);
    
    // 创建黑洞/重物
    const blackHoleRadius = 2;
    const blackHoleGeometry = new THREE.SphereGeometry(blackHoleRadius, 32, 32);
    const blackHoleMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        emissive: 0x000000,
        specular: 0x222222,
        shininess: 100
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);
    
    // 创建黑洞周围的光晕
    const glowGeometry = new THREE.SphereGeometry(blackHoleRadius * 1.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x3498db,
        transparent: true,
        opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);
    
    // 创建光线粒子群
    const lightBeams = [];
    const createLightBeam = (startPos) => {
        const particles = [];
        for (let i = 0; i < 20; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffff00 })
            );
            particle.position.copy(startPos);
            scene.add(particle);
            particles.push({
                mesh: particle,
                velocity: new THREE.Vector3(0, 0, 0),
                startPos: startPos.clone()
            });
        }
        return particles;
    };
    
    // 创建几道光线
    lightBeams.push(createLightBeam(new THREE.Vector3(-15, 0, 2)));
    lightBeams.push(createLightBeam(new THREE.Vector3(-15, 0, -2)));
    lightBeams.push(createLightBeam(new THREE.Vector3(-15, 0, 4)));
    lightBeams.push(createLightBeam(new THREE.Vector3(-15, 0, -4)));
    lightBeams.push(createLightBeam(new THREE.Vector3(-15, 0, 10)));
    lightBeams.push(createLightBeam(new THREE.Vector3(-15, 0, -10)));
    
    // 变形时空网格
    function deformGrid() {
        const blackHolePos = blackHole.position;
        const strength = 1000; // 黑洞引力强度
        
        // 遍历网格中的每个点
        grid.children.forEach(line => {
            const positions = line.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const x = positions[i];
                const y = positions[i + 1];
                const z = positions[i + 2];
                
                // 计算点到黑洞的距离
                const dx = x - blackHolePos.x;
                const dz = z - blackHolePos.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                
                // 基于距离计算下沉的程度 (反比例)
                if (distance > blackHoleRadius) {
                    const deformation = -strength / Math.pow(distance, 3);
                    positions[i + 1] = deformation;
                }
            }
            
            line.geometry.attributes.position.needsUpdate = true;
        });
    }
    
    // 初始变形
    deformGrid();
    
    // 光线路径计算
    function updateLightBeams() {
        const blackHolePos = blackHole.position;
        const speed = 0.2;
        
        lightBeams.forEach(beam => {
            beam.forEach((particle, index) => {
                // 初始化速度
                if (particle.velocity.length() === 0) {
                    particle.velocity.set(speed, 0, 0);
                }
                
                // 与黑洞的距离向量
                const toBlackHole = new THREE.Vector3();
                toBlackHole.subVectors(blackHolePos, particle.mesh.position);
                const distance = toBlackHole.length();
                
                // 应用引力
                if (distance > blackHoleRadius * 1.5) {
                    // 归一化距离向量
                    toBlackHole.normalize();
                    
                    // 引力强度反比于距离的平方
                    const gravity = 1.5 / (distance * distance);
                    
                    // 向黑洞方向施加引力
                    toBlackHole.multiplyScalar(gravity);
                    particle.velocity.add(toBlackHole);
                    
                    // 保持速度大小不变 (只改变方向)
                    particle.velocity.normalize().multiplyScalar(speed);
                    
                    // 更新位置
                    particle.mesh.position.add(particle.velocity);
                    
                    // 如果粒子飞得太远，重置它
                    if (particle.mesh.position.x > gridSize/2 || 
                        Math.abs(particle.mesh.position.z) > gridSize/2 ||
                        distance < blackHoleRadius * 1.5) {
                        // 有延迟地重置此粒子
                        setTimeout(() => {
                            particle.mesh.position.copy(particle.startPos);
                            particle.velocity.set(speed, 0, 0);
                        }, index * 100);
                    }
                } else {
                    // 粒子被黑洞"吸收"，重置它
                    setTimeout(() => {
                        particle.mesh.position.copy(particle.startPos);
                        particle.velocity.set(speed, 0, 0);
                    }, index * 100);
                }
            });
        });
    }
    
    // 为了增加互动性，允许用户旋转视角
    const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.maxPolarAngle = Math.PI / 2;
    
    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        // 每帧更新网格变形
        deformGrid();
        
        // 更新光线路径
        updateLightBeams();
        
        // 更新控制器
        orbitControls.update();
        
        // 渲染场景
        renderer.render(scene, camera);
    }
    
    animate();
}

// 页面加载完成后初始化模拟
window.addEventListener('load', initSpacetimeSimulation);
