import Jogador from "./jogador.js";

export default class CenaJogo extends Phaser.Scene {
  constructor() {
    super({
      key: "CenaJogo",
    });
  }

  preload() {}

  create() {
    // const larguraJogo = this.sys.canvas.width;
    // const alturaJogo = this.sys.canvas.height;
    // this.add.image(larguraJogo/2, alturaJogo/2, 'forest');
    const imagemFundo = this.add.image(0, 0, "forest").setScale(2, 2);
    imagemFundo.setOrigin(0, 0);

    const plataformas = this.physics.add.staticGroup();
    plataformas
      .create(0, 368, "chao")
      .setScale(2, 2)
      .setOrigin(0, 0)
      .refreshBody();
    plataformas
      .create(800 - 60, 480 - 112 - 68 - 68, "platform")
      .setScale(2, 2)
      .setOrigin(0, 0)
      .refreshBody();
    plataformas
      .create(800 - 120, 480 - 112 - 68, "platform")
      .setScale(2, 2)
      .setOrigin(0, 0)
      .refreshBody();

    this.jogador = new Jogador(this);
    this.physics.add.collider(this.jogador.sprite, plataformas);

    this.teclas = this.input.keyboard.createCursorKeys();
  }

  update() {
    // cria um atalho pra evitar ficar digitando "this.jogador.sprite"
    const jogador = this.jogador.sprite;

    // setas da esquerda, direita (ou sem movimento)
    if (this.teclas.left.isDown) {
      jogador.setVelocityX(-320);
      jogador.setFlip(true, false);
      jogador.anims.play("esquerda", true);
    } else if (this.teclas.right.isDown) {
      jogador.setVelocityX(320);
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
      jogador.setVelocityY(-200);
      jogador.anims.play("pulando");
    }
  }
}
