class PortScanner {
    constructor() {
        this.canvas = document.getElementById('radarCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.STYLE = {
            ghosting: 0.10,
            grid: 0.030,
            circles: 0.12,
            sweep: 0.18,
            cone: 0.020,
            centerAlpha: 0.60,
            nodeGlow: 6
        };
        this.radarAngle = 0;
        this.radarSpeed = 0.02;
        this.nodes = [];
        this.packets = [];
        this.cveAlerts = [];
        this.vulnerabilityWarnings = [];
        this.exploitAttempts = [];
        this.shellObtained = false;
        this.shellParticles = [];
        this.pwnedCount = 0;
        this.lastShellTime = 0;
        this.target = '10.10.11.23';
        this.scannedPorts = 20326;
        this.totalPorts = 65535;
        this.openPorts = 8;
        this.vulnerabilities = 3;
        this.filtered = 1;
        this.uptime = 0;
        this.scanProgress = 31.0;
        this.discoveredPorts = [
            { port: 22, service: 'ssh', state: 'OPEN', color: '#00ffa0', vulnerable: false },
            { port: 80, service: 'http', state: 'OPEN', color: '#00ffa0', vulnerable: false },
            { port: 443, service: 'https', state: 'OPEN', color: '#00ffa0', vulnerable: false },
            { port: 3306, service: 'mysql', state: 'VULN', color: '#ff5555', vulnerable: true, cve: 'CVE-2023-22102' },
            { port: 8080, service: 'proxy', state: 'FILT', color: '#f0a000', vulnerable: false },
            { port: 21, service: 'ftp', state: 'OPEN', color: '#00e7ff', vulnerable: false },
            { port: 445, service: 'smb', state: 'VULN', color: '#ff5555', vulnerable: true, cve: 'CVE-2020-0796' },
            { port: 5432, service: 'postgresql', state: 'OPEN', color: '#00ffa0', vulnerable: false },
            { port: 27017, service: 'mongodb', state: 'VULN', color: '#ff5555', vulnerable: true, cve: 'CVE-2021-20329' }
        ];
        this.resizeCanvas();
        this.init();
    }

    getOverlayWidth() {
        const el = document.querySelector('.about-overlay');
        return el ? el.offsetWidth : 0;
    }

    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        const pad = 80;
        const overlayW = this.getOverlayWidth() + pad;
        const rightPad = pad;
        const usableWidth = Math.max(300, this.canvas.width - overlayW - rightPad);
        this.centerX = overlayW + usableWidth / 2;
        this.centerY = this.canvas.height / 2;
        this.radarRadius = Math.min(usableWidth / 2 - 20, this.canvas.height / 2 - 120);
        this.radarRadius = Math.max(this.radarRadius, 240);
    }

    init() {
        this.generateNetworkNodes();
        this.animate();
        setInterval(() => this.updateScanInfo(), 1000);
        setInterval(() => this.createPacket(), 800);
        setInterval(() => this.attemptExploit(), 5000);
        setInterval(() => this.triggerShell(), 15000);
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.generateNetworkNodes();
        });
    }

    resetRadar() {
        this.nodes.forEach(node => {
            node.detected = false;
            node.fadeIn = 0;
        });
        this.nodes[0].detected = true;
        this.nodes[0].fadeIn = 1;

        this.packets = [];
        this.cveAlerts = [];
        this.vulnerabilityWarnings = [];
        this.exploitAttempts = [];
        this.shellParticles = [];

        this.radarAngle = 0;
        this.scannedPorts = 0;
        this.scanProgress = 0;
    }

    generateNetworkNodes() {
        this.nodes = [];
        this.nodes.push({
            x: this.centerX,
            y: this.centerY,
            size: 15,
            type: 'target',
            pulsePhase: 0,
            label: this.target,
            detected: true
        });
        this.discoveredPorts.forEach((service, i) => {
            const angle = (Math.PI * 2 / this.discoveredPorts.length) * i;
            const distance = this.radarRadius * 0.68 + Math.random() * (this.radarRadius * 0.18);
            this.nodes.push({
                x: this.centerX + Math.cos(angle) * distance,
                y: this.centerY + Math.sin(angle) * distance,
                angle,
                distance,
                size: 7,
                type: service.state === 'OPEN' ? 'open' : service.state === 'VULN' ? 'vulnerable' : 'filtered',
                pulsePhase: Math.random() * Math.PI * 2,
                label: `${service.port}/${service.service}`,
                color: service.color,
                targetNode: 0,
                detected: false,
                fadeIn: 0,
                vulnerable: service.vulnerable,
                cve: service.cve,
                port: service.port
            });
        });
    }

    createPacket() {
        if (this.nodes.length < 2) return;
        const fromNode = this.nodes[0];
        const toNode = this.nodes[Math.floor(Math.random() * (this.nodes.length - 1)) + 1];
        if (!toNode.detected) return;

        this.packets.push({
            x: fromNode.x,
            y: fromNode.y,
            targetX: toNode.x,
            targetY: toNode.y,
            progress: 0,
            speed: 0.02 + Math.random() * 0.03,
            color: toNode.vulnerable ? '#ff5555' : '#00d9ff',
            size: 3
        });
    }

    createCVEAlert(node) {
        if (!node.cve || !node.detected) return;

        this.cveAlerts.push({
            x: node.x,
            y: node.y,
            cve: node.cve,
            alpha: 1,
            yOffset: 0,
            lifetime: 120
        });
    }

    createVulnWarning(node) {
        this.vulnerabilityWarnings.push({
            x: node.x,
            y: node.y,
            alpha: 1,
            scale: 1,
            lifetime: 60,
            pulse: 0
        });
    }

    attemptExploit() {
        const vulnNodes = this.nodes.filter(n => n.vulnerable && n.detected);
        if (vulnNodes.length === 0) return;

        const targetNode = vulnNodes[Math.floor(Math.random() * vulnNodes.length)];

        this.exploitAttempts.push({
            x: this.centerX,
            y: this.centerY,
            targetX: targetNode.x,
            targetY: targetNode.y,
            progress: 0,
            speed: 0.015,
            alpha: 1,
            particles: []
        });

        this.createCVEAlert(targetNode);
        this.createVulnWarning(targetNode);
    }

    triggerShell() {
        this.shellObtained = true;
        this.lastShellTime = Date.now();
        this.pwnedCount++;

        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            this.shellParticles.push({
                x: this.centerX,
                y: this.centerY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 2,
                alpha: 1,
                color: '#00d9ff'
            });
        }

        if (this.pwnedCount >= 3) {
            setTimeout(() => {
                this.resetRadar();
                this.pwnedCount = 0;
            }, 3000);
        }
    }

    updateScanInfo() {
        this.uptime++;
        this.scannedPorts = Math.min(this.totalPorts, this.scannedPorts + Math.floor(Math.random() * 300) + 50);
        this.scanProgress = ((this.scannedPorts / this.totalPorts) * 100).toFixed(1);
    }

    drawGrid() {
        this.ctx.strokeStyle = `rgba(0, 217, 255, ${this.STYLE.grid})`;
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawRadar() {
        this.ctx.strokeStyle = `rgba(0, 217, 255, ${this.STYLE.circles})`;
        this.ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const radius = (this.radarRadius / 4) * i;
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY);
            this.ctx.lineTo(
                this.centerX + Math.cos(angle) * this.radarRadius,
                this.centerY + Math.sin(angle) * this.radarRadius
            );
            this.ctx.stroke();
        }
        const g = this.ctx.createLinearGradient(
            this.centerX, this.centerY,
            this.centerX + Math.cos(this.radarAngle) * this.radarRadius,
            this.centerY + Math.sin(this.radarAngle) * this.radarRadius
        );
        g.addColorStop(0.0, 'rgba(0, 217, 255, 0.00)');
        g.addColorStop(0.5, `rgba(0, 217, 255, ${this.STYLE.sweep})`);
        g.addColorStop(1.0, 'rgba(0, 217, 255, 0.00)');
        this.ctx.strokeStyle = g;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(
            this.centerX + Math.cos(this.radarAngle) * this.radarRadius,
            this.centerY + Math.sin(this.radarAngle) * this.radarRadius
        );
        this.ctx.stroke();
        this.ctx.fillStyle = `rgba(0, 217, 255, ${this.STYLE.cone})`;
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.arc(this.centerX, this.centerY, this.radarRadius, this.radarAngle - 0.55, this.radarAngle);
        this.ctx.lineTo(this.centerX, this.centerY);
        this.ctx.fill();
    }

    drawPackets() {
        this.packets = this.packets.filter(packet => {
            packet.progress += packet.speed;
            if (packet.progress >= 1) return false;

            const x = packet.x + (packet.targetX - packet.x) * packet.progress;
            const y = packet.y + (packet.targetY - packet.y) * packet.progress;

            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = packet.color;
            this.ctx.fillStyle = packet.color;
            this.ctx.beginPath();
            this.ctx.arc(x, y, packet.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            const trailLength = 5;
            for (let i = 1; i <= trailLength; i++) {
                const trailProgress = Math.max(0, packet.progress - (i * 0.02));
                const trailX = packet.x + (packet.targetX - packet.x) * trailProgress;
                const trailY = packet.y + (packet.targetY - packet.y) * trailProgress;
                const trailAlpha = (1 - (i / trailLength)) * 0.5;

                this.ctx.fillStyle = packet.color + Math.floor(trailAlpha * 255).toString(16).padStart(2, '0');
                this.ctx.beginPath();
                this.ctx.arc(trailX, trailY, packet.size * 0.7, 0, Math.PI * 2);
                this.ctx.fill();
            }

            return true;
        });
    }

    drawCVEAlerts() {
        this.cveAlerts = this.cveAlerts.filter(alert => {
            alert.lifetime--;
            alert.yOffset -= 0.5;
            alert.alpha = alert.lifetime / 120;

            if (alert.lifetime <= 0) return false;

            this.ctx.font = 'bold 11px "Courier New"';
            this.ctx.fillStyle = `rgba(255, 85, 85, ${alert.alpha})`;
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${alert.alpha * 0.8})`;
            this.ctx.lineWidth = 3;
            this.ctx.textAlign = 'center';
            this.ctx.strokeText(alert.cve, alert.x, alert.y + alert.yOffset);
            this.ctx.fillText(alert.cve, alert.x, alert.y + alert.yOffset);

            return true;
        });
    }

    drawVulnWarnings() {
        this.vulnerabilityWarnings = this.vulnerabilityWarnings.filter(warning => {
            warning.lifetime--;
            warning.pulse += 0.1;
            warning.scale = 1 + Math.sin(warning.pulse) * 0.3;
            warning.alpha = warning.lifetime / 60;

            if (warning.lifetime <= 0) return false;

            const size = 20 * warning.scale;
            this.ctx.strokeStyle = `rgba(255, 85, 85, ${warning.alpha * 0.8})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(warning.x, warning.y - size);
            this.ctx.lineTo(warning.x - size * 0.866, warning.y + size * 0.5);
            this.ctx.lineTo(warning.x + size * 0.866, warning.y + size * 0.5);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.font = 'bold 16px "Courier New"';
            this.ctx.fillStyle = `rgba(255, 85, 85, ${warning.alpha})`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText('!', warning.x, warning.y + 5);

            return true;
        });
    }

    drawExploitAttempts() {
        this.exploitAttempts = this.exploitAttempts.filter(exploit => {
            exploit.progress += exploit.speed;

            if (exploit.progress >= 1) {
                for (let i = 0; i < 6; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.7 + Math.random() * 1.0;
                    exploit.particles.push({
                        x: exploit.targetX,
                        y: exploit.targetY,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        alpha: 1,
                        size: 1.4
                    });
                }
            }

            if (exploit.progress < 1) {
                const x = exploit.x + (exploit.targetX - exploit.x) * exploit.progress;
                const y = exploit.y + (exploit.targetY - exploit.y) * exploit.progress;

                this.ctx.strokeStyle = `rgba(255, 85, 85, ${exploit.alpha * 0.5})`;
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 6;
                this.ctx.shadowColor = '#ff5555';
                this.ctx.beginPath();
                this.ctx.moveTo(exploit.x, exploit.y);
                this.ctx.lineTo(x, y);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;

                this.ctx.fillStyle = 'rgba(255, 85, 85, 0.7)';
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#ff5555';
                this.ctx.beginPath();
                this.ctx.arc(x, y, 2.8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }

            exploit.particles = exploit.particles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.035;

                if (p.alpha <= 0) return false;

                this.ctx.fillStyle = `rgba(255, 85, 85, ${p.alpha * 0.5})`;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();

                return true;
            });

            return exploit.progress < 1 || exploit.particles.length > 0;
        });
    }

    drawShellAnimation() {
        if (Date.now() - this.lastShellTime > 3000) {
            this.shellObtained = false;
            this.shellParticles = [];
            return;
        }

        if (this.shellObtained) {
            const text = 'PWNED';
            const alpha = Math.min(1, (3000 - (Date.now() - this.lastShellTime)) / 500);

            this.ctx.font = 'bold 28px "Courier New"';
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#00d9ff';
            this.ctx.fillStyle = `rgba(0, 217, 255, ${alpha})`;
            this.ctx.textAlign = 'center';
            this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.8})`;
            this.ctx.lineWidth = 4;
            this.ctx.strokeText(text, this.centerX, this.centerY - 50);
            this.ctx.fillText(text, this.centerX, this.centerY - 50);
            this.ctx.shadowBlur = 0;

            this.ctx.save();
            this.ctx.translate(this.centerX, this.centerY + 10);

            this.ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
            this.ctx.lineWidth = 2.5;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = '#00d9ff';

            this.ctx.beginPath();
            this.ctx.moveTo(-15, -20);
            this.ctx.quadraticCurveTo(-18, -15, -18, -8);
            this.ctx.lineTo(-18, 0);
            this.ctx.quadraticCurveTo(-18, 8, -12, 12);
            this.ctx.lineTo(-8, 15);
            this.ctx.lineTo(-6, 18);
            this.ctx.lineTo(-3, 18);
            this.ctx.lineTo(-3, 15);
            this.ctx.lineTo(0, 15);
            this.ctx.lineTo(3, 15);
            this.ctx.lineTo(3, 18);
            this.ctx.lineTo(6, 18);
            this.ctx.lineTo(8, 15);
            this.ctx.lineTo(12, 12);
            this.ctx.quadraticCurveTo(18, 8, 18, 0);
            this.ctx.lineTo(18, -8);
            this.ctx.quadraticCurveTo(18, -15, 15, -20);
            this.ctx.quadraticCurveTo(8, -25, 0, -25);
            this.ctx.quadraticCurveTo(-8, -25, -15, -20);
            this.ctx.closePath();
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.ellipse(-10, -10, 5, 7, 0, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.ellipse(10, -10, 5, 7, 0, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(-2, 0);
            this.ctx.lineTo(-3, 5);
            this.ctx.lineTo(0, 6);
            this.ctx.lineTo(3, 5);
            this.ctx.lineTo(2, 0);
            this.ctx.closePath();
            this.ctx.stroke();

            for (let i = -8; i <= 8; i += 4) {
                this.ctx.beginPath();
                this.ctx.moveTo(i, 15);
                this.ctx.lineTo(i, 12);
                this.ctx.stroke();
            }

            this.ctx.shadowBlur = 0;
            this.ctx.restore();
        }

        this.shellParticles = this.shellParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.alpha -= 0.02;

            if (p.alpha <= 0) return false;

            this.ctx.fillStyle = `rgba(0, 217, 255, ${p.alpha})`;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#00d9ff';
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            return true;
        });
    }

    drawNetworkNodes() {
        this.nodes.forEach((node, i) => {
            if (i === 0) return;
            const nodeAngle = Math.atan2(node.y - this.centerY, node.x - this.centerX);
            const a1 = (nodeAngle + Math.PI * 2) % (Math.PI * 2);
            const a2 = (this.radarAngle + Math.PI * 2) % (Math.PI * 2);
            const diff = Math.abs(a1 - a2);
            if (diff < 0.15 || diff > Math.PI * 2 - 0.15) if (!node.detected) node.detected = true;
            if (node.detected) node.fadeIn = Math.min(1, node.fadeIn + 0.05);
        });

        this.nodes.forEach((node, i) => {
            if (i === 0 || !node.detected || node.fadeIn < 0.3) return;
            const targetNode = this.nodes[node.targetNode];
            const alphaHex = Math.floor(node.fadeIn * 70).toString(16).padStart(2, '0');
            this.ctx.strokeStyle = node.color + alphaHex;
            this.ctx.lineWidth = 1.25;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(targetNode.x, targetNode.y);
            this.ctx.lineTo(node.x, node.y);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        });

        this.nodes.forEach((node, i) => {
            node.pulsePhase += 0.05;
            const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
            if (i === 0) {
                this.ctx.fillStyle = `rgba(0, 255, 255, ${this.STYLE.centerAlpha})`;
                this.ctx.shadowBlur = Math.max(0, this.STYLE.nodeGlow + 4);
                this.ctx.shadowColor = '#0ff';
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size * pulse, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.24)';
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.size + 12, 0, Math.PI * 2);
                this.ctx.stroke();
            } else if (node.detected && node.fadeIn > 0) {
                const size = node.size * pulse;
                const alpha = Math.floor(node.fadeIn * 210).toString(16).padStart(2, '0');
                this.ctx.fillStyle = node.color + alpha;
                this.ctx.shadowBlur = this.STYLE.nodeGlow * node.fadeIn * (node.vulnerable ? 1.5 : 1);
                this.ctx.shadowColor = node.color;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
                const strokeHex = Math.floor(node.fadeIn * 88).toString(16).padStart(2, '0');
                this.ctx.strokeStyle = node.color + strokeHex;
                this.ctx.lineWidth = 1.25;
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, size + 5, 0, Math.PI * 2);
                this.ctx.stroke();
                if (node.fadeIn > 0.75) {
                    this.ctx.font = '11px "Courier New"';
                    const labelHex = Math.floor(node.fadeIn * 160).toString(16).padStart(2, '0');
                    this.ctx.fillStyle = node.color + labelHex;
                    this.ctx.textAlign = 'center';
                    this.ctx.shadowBlur = 4;
                    this.ctx.shadowColor = '#000';
                    this.ctx.fillText(node.label, node.x, node.y - size - 10);
                    this.ctx.shadowBlur = 0;
                }
            }
        });
    }

    drawInfoPanels() {
        const panelWidth = 220;
        const panelHeight = 110;
        const padding = 30;
        const drawPanel = (x, y, title, lines) => {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.94)';
            this.ctx.strokeStyle = 'rgba(0, 217, 255, 0.28)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.rect(x, y, panelWidth, panelHeight);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = 'rgba(0, 217, 255, 0.18)';
            this.ctx.fillRect(x, y, panelWidth, 3);
            this.ctx.font = 'bold 13px "Courier New"';
            this.ctx.fillStyle = 'rgba(0,255,255,0.70)';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(title, x + 12, y + 26);
            this.ctx.font = '11px "Courier New"';
            lines.forEach((line, i) => {
                this.ctx.fillStyle = line.color || '#92a0a8';
                this.ctx.fillText(line.text, x + 12, y + 48 + (i * 16));
            });
        };
        drawPanel(padding, padding, 'PORT SCANNER', [
            { text: `Target: ${this.target}`, color: '#77e7ff' },
            { text: `Scanning: ${this.scannedPorts} / ${this.totalPorts}`, color: '#8fa3ad' },
            { text: `Progress: ${this.scanProgress}%`, color: '#6fe08f' },
            { text: `Open: ${this.openPorts}`, color: '#6fe08f' }
        ]);
        const portsList = this.discoveredPorts.slice(0, 4).map(p => `${p.port}/tcp [${p.state}] ${p.service}`);
        drawPanel(this.canvas.width - panelWidth - padding, padding, 'DISCOVERED PORTS', portsList.map(text => ({ text, color: '#6fe08f' })));
        drawPanel(padding, this.canvas.height - panelHeight - padding, 'SCAN STATUS', [
            { text: `Vulnerabilities: ${this.vulnerabilities}`, color: '#e06666' },
            { text: `Filtered: ${this.filtered}`, color: '#f0a000' },
            { text: `Open Ports: ${this.openPorts}`, color: '#6fe08f' }
        ]);
        const hours = Math.floor(this.uptime / 3600);
        const minutes = Math.floor((this.uptime % 3600) / 60);
        const seconds = this.uptime % 60;
        const uptimeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        drawPanel(this.canvas.width - panelWidth - padding, this.canvas.height - panelHeight - padding, 'SYSTEM INFO', [
            { text: `Uptime: ${uptimeStr}`, color: '#77e7ff' },
            { text: `Active: ${this.nodes.filter(n => n.detected).length - 1} services`, color: '#6fe08f' },
            { text: `Status: Scanning...`, color: '#e6e66f' }
        ]);
    }

    animate() {
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.STYLE.ghosting})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGrid();
        this.drawRadar();
        this.drawPackets();
        this.drawExploitAttempts();
        this.drawNetworkNodes();
        this.drawCVEAlerts();
        this.drawVulnWarnings();
        this.drawShellAnimation();
        this.drawInfoPanels();
        this.radarAngle += this.radarSpeed;
        if (this.radarAngle > Math.PI * 2) this.radarAngle = 0;
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => new PortScanner());