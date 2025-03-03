// 删除import语句，使用全局THREE对象
// const THREE = window.THREE;
// const OrbitControls = window.THREE.OrbitControls;

// 初始化函数，在DOM加载完成后运行
function initSpacetimeSimulation() {
    // 获取容器元素
    const container = document.getElementById('spacetime-container');
    if (!container) {
        console.error('找不到spacetime-container元素');
        return;
    }

    // 获取容器尺寸
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 创建场景
    const scene = new THREE.Scene();

    // 创建摄像机
    const camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
    );
    camera.position.set(0, 0, 15);

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    // 添加到容器而非body
    container.appendChild(renderer.domElement);

    // 添加轨道控制器
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 创建代表重物（例如恒星或黑洞）的球体
    const heavyGeometry = new THREE.SphereGeometry(2, 32, 32);
    const heavyMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const heavyObject = new THREE.Mesh(heavyGeometry, heavyMaterial);
    scene.add(heavyObject);

    // 添加时空网格以显示弯曲效果
    const gridSize = 20;
    const gridDivisions = 100;
    const grid = new THREE.Group();

    // 创建网格平面
    const planeGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3498db, 
        wireframe: true,
        transparent: true,
        opacity: 0.5 
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -3; // 将平面放在黑洞下方
    plane.rotation.x = -Math.PI / 2; // 水平放置
    
    // 变形网格以模拟时空弯曲
    const vertices = planeGeometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
        const x = vertices.getX(i);
        const y = vertices.getY(i);
        
        // 计算到中心的距离的平方
        const distance = x * x + y * y;
        // 创建凹陷效果
        if (distance < 400) {
            // 根据距离创建弯曲效果
            const depression = -4 * Math.exp(-distance/20);
            vertices.setZ(i, depression);
        }
    }
    
    scene.add(plane);

    // 创建光路径
    const points = [];
    points.push(new THREE.Vector3(-10, 2, 0));
    points.push(new THREE.Vector3(-5, 3, 0));
    points.push(new THREE.Vector3(0, 4, 0)); // 接近重物处，路径发生弯曲
    points.push(new THREE.Vector3(5, 3, 0));
    points.push(new THREE.Vector3(10, 2, 0));

    const lightPathCurve = new THREE.CatmullRomCurve3(points);
    const curvePoints = lightPathCurve.getPoints(100);
    const lightPathGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lightPathMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const lightPathLine = new THREE.Line(lightPathGeometry, lightPathMaterial);
    scene.add(lightPathLine);

    // 创建光子
    const photonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const photonMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const photon = new THREE.Mesh(photonGeometry, photonMaterial);
    scene.add(photon);

    let t = 0; // 光子在曲线上的位置参数

    // 基于容器尺寸变化调整渲染
    const resizeObserver = new ResizeObserver(() => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    resizeObserver.observe(container);

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);
        
        controls.update();

        // 更新光子的运动位置
        t += 0.002; // 调整步长可以改变光子的运动速度
        if (t > 1) t = 0;
        const photonPosition = lightPathCurve.getPointAt(t);
        photon.position.copy(photonPosition);

        renderer.render(scene, camera);
    }
    animate();
}

// 在页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 等待THREE加载完成
    if (typeof THREE === 'undefined') {
        console.error('THREE.js未加载');
        return;
    }
    initSpacetimeSimulation();
});