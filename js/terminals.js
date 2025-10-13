// Terminal 1 - Extended hacking tools simulation with 20+ commands
(function () {
    const terminal1 = document.getElementById('terminal1');
    if (!terminal1) return;

    const commands = [
        {
            prompt: 'root@ne0x:~#',
            command: 'nmap -sV -sC -A -p- localhost',
            output: [
                'Starting Nmap 7.94 ( https://nmap.org )',
                'Nmap scan report for localhost (127.0.0.1)',
                'Host is up (0.0012s latency)',
                '',
                'PORT      STATE  SERVICE       VERSION',
                '22/tcp    open   ssh           OpenSSH 7.4 (protocol 2.0)',
                '80/tcp    open   http          Apache httpd 2.4.41 (Ubuntu)',
                '443/tcp   open   https         Apache httpd 2.4.41 (SSL/TLS)',
                '3306/tcp  open   mysql         MySQL 8.0.23',
                '5432/tcp  open   postgresql    PostgreSQL 12.9',
                '8080/tcp  open   http-proxy    Burp Suite Community',
                '8443/tcp  open   https-alt     Tomcat 9.0.31',
                '27017/tcp open   mongodb       MongoDB 4.4.6',
                '6379/tcp  open   redis         Redis 6.0.5',
                '',
                'Nmap done at 2024-10-12 14:30:45 UTC; 1 IP address scanned'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'gobuster dir -u http://localhost -w wordlist.txt -t 100 -x php,html,txt',
            output: [
                '===============================================================',
                'Gobuster v3.5    by OJ Reeves (@TheColonial) & Christian Mehlmauer',
                '===============================================================',
                '[+] Url:                     http://localhost',
                '[+] Method:                  GET',
                '[+] Threads:                 100',
                '[+] Wordlist:                wordlist.txt',
                '[+] Extensions:              php,html,txt',
                '===============================================================',
                '/admin                (Status: 301)',
                '/api                  (Status: 200)',
                '/assets               (Status: 301)',
                '/backup               (Status: 403)',
                '/backup.zip           (Status: 200)',
                '/config               (Status: 403)',
                '/config.php           (Status: 200)',
                '/database.sql         (Status: 200)',
                '/login                (Status: 200)',
                '/upload               (Status: 403)',
                '/shell                (Status: 403)',
                '/test                 (Status: 200)',
                '/wordpress            (Status: 301)',
                '/wp-admin             (Status: 403)',
                '/phpmyadmin           (Status: 200)',
                '',
                'Task Completed'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'sqlmap -u "http://localhost/login" --dbs --batch -v 3',
            output: [
                '        ___',
                '       __H__',
                ' ___ ___ ___ ___(_)_____ ___ ___ ___ ___',
                '|   Y   Y   _  _ _|_   _  Y   Y   _  _ _|',
                '[*] Starting sqlmap at 2024-10-12 14:35:22',
                '[*] Testing connection to the target URL',
                '[+] Target URL appears to be vulnerable to SQL injection attacks',
                '[*] Testing connection to the target database',
                '[+] Heuristic (basic) test shows that GET parameter is vulnerable',
                '',
                'available databases:',
                '[*] information_schema',
                '[*] mysql',
                '[*] performance_schema',
                '[*] webapp_db',
                '[*] users_db',
                '[*] logs_db',
                '',
                '[+] Scan completed successfully'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'john --wordlist=rockyou.txt --format=bcrypt hashes.txt',
            output: [
                'Using default input encoding: UTF-8',
                'Loaded 12 password hashes with bcrypt crypt [CRYPT]',
                'admin123        (admin)',
                'Password123!    (user1)',
                'qwerty          (test)',
                'letmein         (root)',
                'p@ssw0rd        (webadmin)',
                'welcome         (guest)',
                'sunshine        (admin2)',
                'password        (user2)',
                '',
                '8 password hashes cracked, 4 left'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'hydra -L users.txt -P pass.txt -f ssh://localhost',
            output: [
                'Hydra v9.4 starting at 2024-10-12 14:40:33',
                '[22][ssh] Host: localhost. Account: root, password: toor',
                '[22][ssh] Host: localhost. Account: admin, password: admin123',
                '[22][ssh] Host: localhost. Account: test, password: test123',
                '[22][ssh] Host: localhost. Account: user, password: password',
                '[22][ssh] Host: localhost. Account: webadmin, password: admin',
                '[22][ssh] 5 of 5 targets successfully completed, 5 valid passwords found',
                ''
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'msfconsole -x "use exploit/windows/smb/ms17_010_eternalblue; run"',
            output: [
                '       =[ metasploit v6.3.2-dev ]',
                '+ -- --=[ 2369 exploits - 1281 auxiliary - 418 post ]',
                'msf6 > use exploit/windows/smb/ms17_010_eternalblue',
                'msf6 exploit(windows/smb/ms17_010_eternalblue) > set RHOSTS 127.0.0.1',
                'RHOSTS => 127.0.0.1',
                'msf6 exploit(windows/smb/ms17_010_eternalblue) > set LHOST 192.168.1.100',
                'LHOST => 192.168.1.100',
                'msf6 exploit(windows/smb/ms17_010_eternalblue) > exploit',
                '[+] Sending exploit packet',
                '[+] Sending final connection request',
                '[*] Session 1 opened (192.168.1.100 -> 127.0.0.1) at 2024-10-12 14:42:15'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'burpsuite --headless --config-file=config.xml --project-file=scan.bap',
            output: [
                'Burp Suite Community Edition v2024.3',
                '[INFO] Burp is loading',
                '[INFO] Initializing listeners on port 8080',
                '[INFO] Starting background scanner',
                '[INFO] Proxy is running',
                '[INFO] Starting passive scan',
                '[FOUND] SQL Injection vulnerability in /login parameter',
                '[FOUND] Cross-Site Scripting (XSS) in /search',
                '[FOUND] Insecure Direct Object Reference in /user/profile',
                '[FOUND] CSRF token not found in login form',
                '[FOUND] Insecure Direct Object Reference in /api/users',
                '[FOUND] Path Traversal in /download?file=',
                '[+] Scan completed with 6 vulnerabilities found'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'wireshark -k -i eth0 -f "tcp port 80 or tcp port 443"',
            output: [
                'Wireshark 4.0.3 starting',
                '[*] Capturing on eth0',
                '10:30:45.123456 192.168.1.100 -> 127.0.0.1 [TCP] SYN',
                '10:30:45.234567 127.0.0.1 -> 192.168.1.100 [TCP] SYN, ACK',
                '10:30:45.345678 192.168.1.100 -> 127.0.0.1 [HTTP] GET /admin',
                '10:30:45.456789 127.0.0.1 -> 192.168.1.100 [HTTP] 200 OK',
                '10:30:46.567890 192.168.1.100 -> 127.0.0.1 [TLS] Client Hello',
                '10:30:46.678901 127.0.0.1 -> 192.168.1.100 [TLS] Server Hello',
                '[*] Packets captured: 5432 | Average size: 547 bytes'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'aircrack-ng dump.cap -w wordlist.txt',
            output: [
                'Opening dump.cap',
                '[+] Read 4628 packets.',
                '',
                '   BSSID              PWR  #Data, #/s  CH MB   ENC CIPHER AUTH ESSID',
                '   AA:BB:CC:DD:EE:FF  -45   4500  10   6  54e. WPA  CCMP  PSK  HOME-WIFI',
                '   11:22:33:44:55:66  -67   2100   5  11 130   WPA2 CCMP  PSK  GUEST-NET',
                '   FF:EE:DD:CC:BB:AA  -72   1200   3   1 130   WPA3 CCMP  PSK  SECURE',
                '',
                '[+] Starting dictionary attack',
                '[+] Password found: MyPassword123 (BSSID: AA:BB:CC:DD:EE:FF)'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'nikto -h http://localhost -C all -o nikto_report.html',
            output: [
                '- Nikto v2.1.6 -',
                '+ Target IP:          127.0.0.1',
                '+ Target Hostname:    localhost',
                '+ Target Port:        80',
                '+ Start Time:         2024-10-12 14:50:32',
                '',
                '+ Server: Apache/2.4.41',
                '+ /: The anti-clickjacking X-Frame-Options header is not present.',
                '+ /admin: Directory indexing found.',
                '+ /config: Server allows HTTP PUT method.',
                '+ /backup.zip: Backup file found.',
                '[+] 1258 requests: 0 error(s) and 6 item(s) reported',
                '[+] End Time: 2024-10-12 14:50:45'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'enum4linux -a localhost',
            output: [
                'Starting enum4linux v0.8.9',
                '',
                'Target Information:',
                'Target ........... 127.0.0.1',
                'RID Range ........ 500-550000',
                'Username ......... blank',
                'Password ......... blank',
                '',
                'Domain Name Information:',
                'Domain Name .... WORKGROUP',
                'Domain SID ..... S-1-5-21-1234567890',
                '',
                'User Information:',
                'User .... Administrator',
                'User .... Guest',
                'User .... admin',
                'User .... test_user',
                '',
                'Share Enumeration:',
                'Sharename ... ADMIN$',
                'Sharename ... C$',
                'Sharename ... IPC$',
                'Sharename ... public (read-write)',
                ''
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'smbclient -L \\\\\\\\localhost -U%',
            output: [
                'Anonymous login successful',
                'Sharelist:',
                '\tshare$ .......... IPC$ - IPC Service',
                '\taccessible:\tyes',
                '\tshare$ .......... admin$ - Remote Admin',
                '\taccessible:\tno',
                '\tshare$ .......... c$ - Default share',
                '\taccessible:\tyes',
                '\tshare$ .......... public - Public Share',
                '\taccessible:\tyes',
                '',
                'Reconnecting with workgroup after server went down'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'dirbuster -H http://localhost -l /usr/share/wordlists/dirb/common.txt',
            output: [
                'DirBuster v1.0-RC1',
                '==============================',
                'Base URL: http://localhost',
                'Port: 80',
                'Report File: /root/DirBuster-Report.html',
                'Wordlist: /usr/share/wordlists/dirb/common.txt',
                '',
                'Dirs found with response codes:',
                '200 =>  /admin',
                '200 =>  /api',
                '200 =>  /assets',
                '403 =>  /backup',
                '200 =>  /login',
                '200 =>  /upload',
                '',
                'DirBuster Finished'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'whois localhost',
            output: [
                'Domain Name: localhost',
                'Registry Domain ID: D123456789-LROR',
                'Registrar WHOIS Server: whois.example.com',
                'Registrar URL: http://www.example.com',
                'Updated Date: 2024-09-15',
                'Creation Date: 2020-01-01',
                'Registry Expiry Date: 2025-01-01',
                'Registrant Country: EC',
                'Registrant Name: Alan Chalco',
                'Registrant Email: ne0x@example.com'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'dig localhost MX',
            output: [
                '; <<>> DiG 9.16.1-Ubuntu <<>> localhost MX',
                '; global options: +cmd',
                '; Got answer:',
                '; ->>HEADER<<- opcode: QUERY, status: NOERROR',
                '; flags: qr aa rd ra; QUERY: 1, ANSWER: 2',
                '',
                '; QUESTION SECTION:',
                ';localhost.                     IN      MX',
                '',
                '; ANSWER SECTION:',
                'localhost.              3600    IN      MX      10 mail.localhost.',
                'localhost.              3600    IN      MX      20 mail2.localhost.',
                '',
                '; Query time: 1 msec'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'theHarvester -d localhost -l 100 -b google',
            output: [
                'theHarvester 4.0.1',
                '======================================',
                'Domain: localhost',
                'Starting harvesting process',
                '',
                'Emails found:',
                'admin@localhost',
                'user@localhost',
                'contact@localhost',
                'info@localhost',
                '',
                'Hosts found:',
                'localhost (127.0.0.1)',
                'mail.localhost (127.0.0.5)',
                'www.localhost (127.0.0.6)',
                'ftp.localhost (127.0.0.7)',
                '',
                'Harvesting finished'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'hashcat -m 1400 hashes.txt rockyou.txt --force',
            output: [
                'hashcat (v6.2.5) starting...',
                'Hash-type: SHA-256 (Unix)',
                'Hash target: hashes.txt',
                'Dictionary: rockyou.txt',
                '',
                'Progress: 145234/14344391 (1.01%)',
                'Admin123        => admin_hash',
                'Welcome123      => user1_hash',
                'Password!@#      => root_hash',
                'Letmein99       => test_hash',
                '',
                'Progress: 8912341/14344391 (62.15%)',
                'Recovered: 4/8 hashes'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'cewl http://localhost -d 3 -m 5 -w wordlist.txt',
            output: [
                'CeWL 5.4.8 starting at 2024-10-12 14:58:15 UTC',
                'Spidering localhost',
                'Crawling 3 levels deep',
                'Minimum word length: 5',
                '',
                'Found words:',
                'administrator',
                'password',
                'security',
                'authentication',
                'network',
                'database',
                'services',
                'welcome',
                '',
                'CeWL finished - 8 unique words'
            ]
        },
        {
            prompt: 'root@ne0x:~#',
            command: 'wafw00f -v http://localhost',
            output: [
                'wafw00f - Web Application Firewall Detection Tool',
                '',
                'Target: http://localhost',
                'Sending requests to target: http://localhost',
                '',
                '[+] ModSecurity: detected',
                '[+] Cloudflare: detected',
                '[+] AWS WAF: not detected',
                '[+] Imperva: detected',
                '[+] F5 BIG-IP: detected',
                '',
                'Results: 3 WAF(s) detected'
            ]
        }
    ];

    function addLine(content, className = 'terminal-output') {
        const div = document.createElement('div');
        div.className = 'terminal-line ' + className;
        div.innerHTML = content;
        terminal1.appendChild(div);
        terminal1.scrollTop = terminal1.scrollHeight;
    }

    function typeCommand(prompt, command, callback) {
        let i = 0;
        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line';

        const promptSpan = document.createElement('span');
        promptSpan.className = 'terminal-prompt';
        promptSpan.textContent = prompt + '# ';
        promptLine.appendChild(promptSpan);

        const commandSpan = document.createElement('span');
        commandSpan.className = 'terminal-command';
        promptLine.appendChild(commandSpan);

        terminal1.appendChild(promptLine);

        const typingInterval = setInterval(() => {
            if (i < command.length) {
                commandSpan.textContent += command[i];
                i++;
                terminal1.scrollTop = terminal1.scrollHeight;
            } else {
                clearInterval(typingInterval);
                setTimeout(callback, 300);
            }
        }, 25);
    }

    function showOutput(output, callback) {
        let lineIndex = 0;

        function showNextLine() {
            if (lineIndex < output.length) {
                const line = output[lineIndex];
                const isError = line.includes('error') || line.includes('failed');
                const isSuccess = line.includes('[+]') || line.includes('cracked') || line.includes('vulnerable') || line.includes('found') || line.includes('FOUND') || line.includes('completed') || line.includes('detected');
                let className = 'terminal-output';

                if (isSuccess) className = 'terminal-output success';
                if (isError) className = 'terminal-output error';

                addLine(line, className);
                lineIndex++;
                setTimeout(showNextLine, 50);
            } else {
                setTimeout(callback, 300);
            }
        }

        showNextLine();
    }

    function executeNextCommand(index) {
        if (index >= commands.length) {
            addLine('');
            addLine('[RECONNAISSANCE COMPLETE] All tools executed successfully', 'terminal-output success');
            setTimeout(() => executeNextCommand(0), 10000);
            return;
        }

        const cmd = commands[index];
        typeCommand(cmd.prompt, cmd.command, () => {
            addLine('');
            showOutput(cmd.output, () => {
                addLine('');
                setTimeout(() => executeNextCommand(index + 1), 400);
            });
        });
    }

    setTimeout(() => executeNextCommand(0), 500);
})();

// Terminal 3 - Extended system monitoring with even more commands
(function () {
    const terminal3 = document.getElementById('terminal3');
    if (!terminal3) return;

    const output = [
        'root@ne0x:~# systemctl status pentesting.service',
        '',
        '● pentesting.service - Ethical Hacking Skills',
        '   Loaded: loaded (/etc/systemd/system/pentesting.service)',
        '   Active: active (running)',
        '',
        '   ├─ Reconnaissance .............. [ACTIVE]',
        '   ├─ Enumeration ................ [ACTIVE]',
        '   ├─ Vulnerability Assessment ... [ACTIVE]',
        '   ├─ Exploitation ............... [ACTIVE]',
        '   └─ Post-Exploitation .......... [ACTIVE]',
        '',
        'root@ne0x:~# ps aux | grep pentesting | head -20',
        'root     1001  2.5  1.2  nmap -sV -sC -A -p- localhost',
        'root     1002  1.8  0.9  gobuster dir -u http://localhost',
        'root     1003  2.1  1.5  sqlmap -u http://localhost/login',
        'root     1004  0.9  0.5  john hashes.txt --wordlist=rockyou.txt',
        'root     1005  1.6  0.8  hydra -L users.txt -P pass.txt ssh',
        'root     1006  3.2  2.1  burpsuite --headless',
        'root     1007  1.4  1.1  wireshark -k -i eth0',
        'root     1008  0.7  0.4  aircrack-ng dump.cap',
        'root     1009  2.3  1.8  nikto -h http://localhost',
        'root     1010  1.5  0.9  hashcat -m 1400 hashes.txt',
        '',
        'root@ne0x:~# df -h',
        'Filesystem      Size  Used Avail Use% Mounted on',
        '/dev/sda1       200G  157G   43G  78% /',
        '/dev/sda2       100G   96G    4G  95% /home',
        '/dev/sda3        50G   49G    1G  98% /var',
        '/dev/sda4        75G   42G   33G  56% /opt',
        '',
        'root@ne0x:~# netstat -tlnp | grep LISTEN',
        'tcp  0  0  0.0.0.0:22     0.0.0.0:*  LISTEN  1234/sshd',
        'tcp  0  0  0.0.0.0:80     0.0.0.0:*  LISTEN  5678/apache2',
        'tcp  0  0  0.0.0.0:443    0.0.0.0:*  LISTEN  5678/apache2',
        'tcp  0  0  0.0.0.0:3306   0.0.0.0:*  LISTEN  9012/mysqld',
        'tcp  0  0  0.0.0.0:5432   0.0.0.0:*  LISTEN  3456/postgres',
        'tcp  0  0  0.0.0.0:27017  0.0.0.0:*  LISTEN  7890/mongod',
        'tcp  0  0  0.0.0.0:6379   0.0.0.0:*  LISTEN  2345/redis-server',
        '',
        'root@ne0x:~# ifconfig',
        'eth0: flags=UP,BROADCAST,RUNNING,MULTICAST  mtu 1500',
        '      inet 192.168.1.100  netmask 255.255.255.0',
        '      inet6 fe80::1  prefixlen 64',
        '      TX packets 125432  bytes 234567890 (223.7 MiB)',
        '      RX packets 098765  bytes 345678901 (329.5 MiB)',
        '',
        'root@ne0x:~# top -b -n 1 | head -15',
        'top - 14:58:23 up 245 days,  5:43,  2 users,  load average: 4.52, 3.21, 2.98',
        'Tasks:  234 total,   8 running, 226 sleeping,   0 stopped,   0 zombie',
        '%Cpu(s): 48.2 us, 12.3 sy,  0.0 ni, 39.1 id,  0.4 wa,  0.0 hi,  0.0 si',
        'KiB Mem : 16377920 total,  8234560 free,  5673120 used,  2470240 buff/cache',
        '',
        'PID   USER   PR  NI    VIRT    RES   SHR S %CPU %MEM    TIME+ COMMAND',
        '9876  root   20   0 2345678 234567  12345 R 85.3 14.3  123:45 burpsuite',
        '8765  root   20   0 1234567 123456   6789 R 72.1 7.5   98:23 nmap',
        '7654  root   20   0  567890  56789   3456 R 45.2 3.5   67:12 hashcat',
        '6543  root   20   0  345678  34567   2345 R 23.1 2.1   45:34 nikto',
        ''
    ];

    function addLine(content) {
        const div = document.createElement('div');
        div.className = 'terminal-line';

        if (content.includes('[ACTIVE]')) {
            div.innerHTML = '<span class="terminal-output success">' + content + '</span>';
        } else if (content.includes('LISTEN') || content.includes('running') || content.includes('active')) {
            div.innerHTML = '<span class="terminal-output success">' + content + '</span>';
        } else if (content.startsWith('root@')) {
            div.innerHTML = '<span class="terminal-prompt">root@ne0x:~#</span> <span class="terminal-command">' + content.replace('root@ne0x:~# ', '') + '</span>';
        } else if (content.includes('●')) {
            div.innerHTML = '<span class="terminal-output">' + content + '</span>';
        } else {
            div.innerHTML = '<span class="terminal-output">' + content + '</span>';
        }

        terminal3.appendChild(div);
        terminal3.scrollTop = terminal3.scrollHeight;
    }

    let lineIndex = 0;
    function showNextLine() {
        if (lineIndex < output.length) {
            addLine(output[lineIndex]);
            lineIndex++;
            setTimeout(showNextLine, 60);
        }
    }

    setTimeout(showNextLine, 500);
})();

// Wave Canvas Animation with axes
(function () {
    const canvas = document.getElementById('waveCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frameCount = 0;

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    function drawWave() {
        const w = canvas.width;
        const h = canvas.height;
        const padding = 40;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, w, h);

        // Ejes
        ctx.strokeStyle = 'rgba(0, 184, 212, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, h - padding);
        ctx.lineTo(w - padding, h - padding);
        ctx.stroke();

        // Grid
        ctx.strokeStyle = 'rgba(0, 184, 212, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 5; i++) {
            const x = padding + (w - 2 * padding) * (i / 4);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, h - padding);
            ctx.stroke();

            const y = h - padding - (h - 2 * padding) * (i / 4);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(w - padding, y);
            ctx.stroke();
        }

        // Etiquetas ejes
        ctx.fillStyle = 'rgba(0, 184, 212, 0.7)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        for (let i = 0; i <= 4; i++) {
            const x = padding + (w - 2 * padding) * (i / 4);
            ctx.fillText(i * 25, x, h - padding + 20);
        }
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const y = h - padding - (h - 2 * padding) * (i / 4);
            ctx.fillText(Math.round((2 - i) * 50), padding - 15, y + 4);
        }

        // <-- SOLO UNA VEZ -->
        const centerY = h - padding - (h - 2 * padding) / 2;
        const plotWidth = w - 2 * padding;

        // Onda senoidal (cyan)
        ctx.strokeStyle = '#00b8d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < plotWidth; x++) {
            const normalizedX = x / 50;
            const y = Math.sin((normalizedX + frameCount / 15)) * 35;
            const plotX = padding + x;
            const plotY = centerY - y;
            if (x === 0) ctx.moveTo(plotX, plotY);
            else ctx.lineTo(plotX, plotY);
        }
        ctx.stroke();

        // Onda cosenoidal (rojo)
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = 0; x < plotWidth; x++) {
            const normalizedX = x / 50;
            const y = Math.cos((normalizedX + frameCount / 15)) * 35;
            const plotX = padding + x;
            const plotY = centerY - y;
            if (x === 0) ctx.moveTo(plotX, plotY);
            else ctx.lineTo(plotX, plotY);
        }
        ctx.stroke();

        frameCount++;
        requestAnimationFrame(drawWave);
    }

    resizeCanvas();
    drawWave();

    window.addEventListener('resize', resizeCanvas);
})();
