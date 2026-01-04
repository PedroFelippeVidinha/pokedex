// Sistema com GBA.js - Emulador JavaScript Nativo

class PokemonEmulator {
    constructor() {
        this.gba = null;
        this.init();
    }

    init() {
        this.setupGameButtons();
    }

    setupGameButtons() {
        const gameButtons = document.querySelectorAll('.game-option');
        gameButtons.forEach(button => {
            button.addEventListener('click', () => {
                const game = button.getAttribute('data-game');
                const gameName = button.querySelector('.game-name').textContent;
                this.loadGame(game, gameName);
            });
        });
    }

    loadGame(game, gameName) {
        const emulatorContainer = document.getElementById('emulator-container');
        const gameSelector = document.querySelector('.game-selector');
        const titleElement = document.getElementById('current-game-title');
        const gameContainer = document.getElementById('game');
        const loadingOverlay = document.getElementById('loading-overlay');

        // Atualiza título
        if (titleElement) {
            titleElement.textContent = `🎮 ${gameName}`;
        }

        // Limpa container
        gameContainer.innerHTML = '';

        // Mostra modal
        if (gameSelector) gameSelector.style.display = 'none';
        if (emulatorContainer) {
            emulatorContainer.style.display = 'block';
            setTimeout(() => emulatorContainer.scrollIntoView({ behavior: 'smooth' }), 100);
        }

        if (loadingOverlay) loadingOverlay.style.display = 'flex';

        // Cria interface de upload
        gameContainer.innerHTML = `
            <div style="padding: 2rem; max-width: 700px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); margin-bottom: 2rem;">
                    <h2 style="margin: 0 0 1rem 0; font-size: 2rem;">🎮 ${gameName}</h2>
                    <p style="margin: 0; font-size: 1.1rem; opacity: 0.95;">Emulador JavaScript rodando no seu navegador!</p>
                </div>

                <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                    <h3 style="color: #667eea; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                        📂 <span>Carregar Arquivo ROM</span>
                    </h3>
                    <p style="color: #666; margin: 0 0 1.5rem 0; line-height: 1.6;">
                        Selecione o arquivo ROM do jogo <strong>${gameName}</strong> do seu computador para jogar:
                    </p>
                    
                    <label for="rom-file-${game}" style="display: block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.25rem 2rem; border-radius: 0.75rem; font-weight: bold; cursor: pointer; font-size: 1.1rem; text-align: center; transition: transform 0.2s, box-shadow 0.2s;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102,126,234,0.4)'"
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                    >
                        📁 Selecionar Arquivo .gba / .gbc / .gb
                    </label>
                    <input type="file" id="rom-file-${game}" accept=".gba,.gbc,.gb,.zip" style="display: none;">
                    
                    <div id="file-info-${game}" style="margin-top: 1rem; padding: 1rem; background: #f0f9ff; border-left: 4px solid #667eea; border-radius: 0.5rem; display: none;">
                        <p style="margin: 0; color: #1e40af; font-weight: 600;">✅ Arquivo carregado! Iniciando jogo...</p>
                    </div>
                </div>

                <div style="background: rgba(255, 243, 205, 0.6); padding: 1.5rem; border-radius: 0.75rem; border-left: 4px solid #f59e0b; margin-bottom: 1.5rem;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #92400e; display: flex; align-items: center; gap: 0.5rem;">
                        💡 <span>Onde encontrar ROMs?</span>
                    </h4>
                    <ul style="margin: 0; padding-left: 1.5rem; color: #78350f; line-height: 1.8;">
                        <li><a href="https://www.emulatorgames.net/roms/gameboy-advance/" target="_blank" style="color: #92400e; font-weight: 600;">EmulatorGames.net</a></li>
                        <li><a href="https://romsmode.com/" target="_blank" style="color: #92400e; font-weight: 600;">RomsMode.com</a></li>
                        <li><a href="https://vimm.net/" target="_blank" style="color: #92400e; font-weight: 600;">Vimm's Lair</a></li>
                    </ul>
                </div>

                <div style="background: white; padding: 1.5rem; border-radius: 0.75rem; border: 2px solid #e5e7eb;">
                    <h4 style="margin: 0 0 0.75rem 0; color: #667eea;">🎮 Controles do Teclado:</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; color: #4b5563; font-size: 0.95rem;">
                        <div><strong>Setas:</strong> Movimento</div>
                        <div><strong>Z:</strong> Botão A</div>
                        <div><strong>X:</strong> Botão B</div>
                        <div><strong>A:</strong> Botão L</div>
                        <div><strong>S:</strong> Botão R</div>
                        <div><strong>Enter:</strong> Start</div>
                        <div><strong>Backspace:</strong> Select</div>
                    </div>
                </div>
            </div>
        `;

        // Setup upload
        setTimeout(() => {
            const fileInput = document.getElementById(`rom-file-${game}`);
            const fileInfo = document.getElementById(`file-info-${game}`);
            
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        if (fileInfo) fileInfo.style.display = 'block';
                        this.loadRomFile(file, gameName);
                    }
                });
            }
        }, 100);

        if (loadingOverlay) loadingOverlay.style.display = 'none';

        // Setup botão fechar
        const closeBtn = document.getElementById('close-emulator');
        if (closeBtn) {
            closeBtn.onclick = () => this.closeGame();
        }
    }

    loadRomFile(file, gameName) {
        const gameContainer = document.getElementById('game');
        const loadingOverlay = document.getElementById('loading-overlay');

        if (loadingOverlay) loadingOverlay.style.display = 'flex';

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                // Cria canvas para o emulador
                gameContainer.innerHTML = `
                    <div style="background: #000; padding: 1rem; border-radius: 1rem; text-align: center;">
                        <canvas id="gba-screen" width="240" height="160" style="width: 100%; max-width: 720px; height: auto; image-rendering: pixelated; border-radius: 0.5rem;"></canvas>
                        <div style="margin-top: 1rem; color: white; font-size: 0.9rem;">
                            🎮 Jogo carregado! Use as setas e teclas Z/X para jogar
                        </div>
                    </div>
                `;

                // Inicializa GBA.js
                const canvas = document.getElementById('gba-screen');
                this.gba = new GameBoyAdvance();
                this.gba.setCanvas(canvas);
                
                // Carrega ROM
                const romData = e.target.result;
                this.gba.loadRomFromFile(romData, () => {
                    console.log('✅ ROM carregada:', gameName);
                    this.gba.runStable();
                    if (loadingOverlay) loadingOverlay.style.display = 'none';
                });

            } catch (error) {
                console.error('❌ Erro ao inicializar emulador:', error);
                if (loadingOverlay) loadingOverlay.style.display = 'none';
                gameContainer.innerHTML = `
                    <div style="padding: 2rem; text-align: center;">
                        <div style="background: linear-gradient(135deg, #f56565 0%, #c53030 100%); color: white; padding: 2rem; border-radius: 1rem;">
                            <h3 style="margin: 0 0 1rem 0;">⚠️ Erro ao Carregar</h3>
                            <p style="margin: 0 0 1rem 0;">Não foi possível inicializar o emulador.</p>
                            <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">${error.message}</p>
                            <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: white; color: #c53030; border: none; border-radius: 0.5rem; font-weight: bold; cursor: pointer;">
                                🔄 Tentar Novamente
                            </button>
                        </div>
                    </div>
                `;
            }
        };

        reader.onerror = () => {
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            alert('❌ Erro ao ler o arquivo. Tente novamente.');
        };

        reader.readAsArrayBuffer(file);
    }

    closeGame() {
        const emulatorContainer = document.getElementById('emulator-container');
        const gameSelector = document.querySelector('.game-selector');
        const gameContainer = document.getElementById('game');

        // Para emulador
        if (this.gba) {
            try {
                this.gba.pause();
            } catch (e) {
                console.log('Pause:', e);
            }
            this.gba = null;
        }

        // Limpa
        if (gameContainer) gameContainer.innerHTML = '';
        if (emulatorContainer) emulatorContainer.style.display = 'none';
        if (gameSelector) {
            gameSelector.style.display = 'block';
            setTimeout(() => gameSelector.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }
}

// Inicializa
document.addEventListener('DOMContentLoaded', () => {
    new PokemonEmulator();
    console.log('🎮 Emulador GBA.js pronto!');
});
