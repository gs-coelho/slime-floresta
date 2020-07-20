import Jogador from "./jogador.js";

export default class CenaJogo extends Phaser.Scene {
  constructor() {
    super({
      key: "CenaJogo",
    });
  }

  preload() {}

  create() {
    // Criação de grupos e variáveis gerais de jogo
    const LARGURA_JOGO = this.sys.canvas.width;
    const ALTURA_JOGO = this.sys.canvas.height;
    const imagemFundo = this.add.image(0, 0, "forest");
    const plataformas = this.physics.add.staticGroup();
    const slimeballs = this.physics.add.group();
    const bombas = this.physics.add.group();
    let pontos = 0;
    let textoPontos;
    let gameOver;
    this.jogador = new Jogador(this);

    // Configuração de objetos de jogo
    imagemFundo.setOrigin(0, 0);

    plataformas.create(0, 184, "chao").setOrigin(0, 0).refreshBody();
    plataformas
      .create(400 - 30, 240 - 56 - 34 - 34, "platform")
      .setOrigin(0, 0)
      .refreshBody();
    plataformas
      .create(400 - 60, 240 - 56 - 34, "platform")
      .setOrigin(0, 0)
      .refreshBody();

    slimeballs.createFromConfig({
      key: "slimeball",
      repeat: 4,
      setXY: { x: 60, y: 0, stepX: 80 },
      setScale: { x: 0.2, y: 0.2 },
    });

    slimeballs.children.iterate((slimeball) => {
      slimeball.setBounceY(Phaser.Math.FloatBetween(0.2, 0.6));
    });

    textoPontos = this.add.text(10, 200, "Pontuação: 0", {
      fontSize: "32px",
      fill: "#000",
      fontFamily: "monospace",
    });

    // Definição de funções
    function coletaSlimeball(jogador, slimeball) {
      slimeball.disableBody(true, true);

      pontos += 10;
      textoPontos.setText(`Pontuação: ${pontos}`);

      if (slimeballs.countActive(true) === 0) {
        slimeballs.children.iterate((slimeball) => {
          slimeball.enableBody(true, slimeball.x, 0, true, true);
        });

        let x =
          this.jogador.sprite.x < 200
            ? Phaser.Math.Between(200, 400)
            : Phaser.Math.Between(0, 200);
        let bomba = bombas.create(x, 16, "bomba");
        bomba.setBounce(1);
        bomba.setCollideWorldBounds(true);
        bomba.setVelocity(Phaser.Math.Between(-200, 200), 20);
      }
    }

    function acertaBomba(jogador, bomba) {
      this.physics.pause();

      jogador.setTint(0xff0000);

      jogador.anims.play("atoa");

      gameOver = true;
    }

    // Configuração de colisores e sobreposições
    this.physics.add.collider(slimeballs, plataformas);
    this.physics.add.collider(this.jogador.sprite, plataformas);
    this.physics.add.overlap(
      this.jogador.sprite,
      slimeballs,
      coletaSlimeball,
      null,
      this
    );
    this.physics.add.collider(bombas, plataformas);
    this.physics.add.collider(
      this.jogador.sprite,
      bombas,
      acertaBomba,
      null,
      this
    );

    // Definindo variável de input
    this.teclas = this.input.keyboard.createCursorKeys();
  }

  update() {
    // cria um atalho pra evitar ficar digitando "this.jogador.sprite"
    const jogador = this.jogador.sprite;

    // setas da esquerda, direita (ou sem movimento)
    if (this.teclas.left.isDown) {
      jogador.setVelocityX(-160);
      jogador.setFlip(true, false);
      jogador.anims.play("esquerda", true);
    } else if (this.teclas.right.isDown) {
      jogador.setVelocityX(160);
      jogador.setFlip(false, false);
      jogador.anims.play("direita", true);
    } else {
      // nem esquerda, nem direita - parado ou pulando
      jogador.setVelocityX(0);
      if (jogador.body.touching.down) {
        jogador.anims.play("atoa");
      }
    }

    // seta para cima fazendo pular, mas só se estiver no chão
    if (this.teclas.up.isDown && jogador.body.touching.down) {
      jogador.setVelocityY(-100);
      jogador.anims.play("pulando");
    }
  }
}
