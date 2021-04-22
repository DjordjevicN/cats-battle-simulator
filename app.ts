class Player {
  private _players: Players;
  private _timer: null | ReturnType<typeof setTimeout> = null;
  public _name: string;
  private _id: number;
  private _health: number;

  constructor(
    id: number,
    name: string,
    players: Players,
    health: number = 100
  ) {
    this._id = id;
    this._name = name;
    this._health = health;
    this._players = players;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get health() {
    return this._health;
  }

  public get rechargeTime(): number {
    return (1000 * this._health) / 100;
  }

  public get damage(): number {
    return this._health / 100;
  }

  public get criticalChance(): number {
    return 10 - this._health / 10;
  }

  public startAttack() {
    this._timer = setTimeout(() => {
      this.attackRandomPlayer();
    }, this.rechargeTime);
  }

  private attackRandomPlayer() {
    const enemy = this._players.randomAliveEnemy(this);
    const attackPower = this.damage * this.criticalDamage();

    console.log(
      `COMBAT LOG = ${this._name} is attacking ${
        enemy._name
      } with damage of ${Math.ceil(
        attackPower
      )} with current health ${Math.round(enemy.health)}`
    );

    enemy.takeDamage(attackPower);

    if (this._players.isFightOver()) {
      console.log(`Player ${this._name} is Winner!!`);
      return;
    }

    /* Start new attack */
    this.startAttack();
  }

  public takeDamage(attackPower) {
    this._health -= attackPower;

    if (this._health <= 0) {
      console.log(`${this._name} DIED`);

      if (this._timer != null) {
        /* It is hard to attack while not being alive :) */
        clearTimeout(this._timer);
      }
    }
  }

  private criticalDamage() {
    if (this.criticalChance >= Math.random() * 100) {
      console.log("CRITICAL STRIKE");
      return 5;
    } else {
      return 1;
    }
  }
}

class Players {
  private _players = new Map<number, Player>();
  private _nextId = 0;

  public generatePlayers(n: number) {
    for (let i = 0; i < n; i++) {
      this.addPlayer(`player-${i}`);
    }
  }

  public addPlayer(name: string): void {
    const player = new Player(this._nextId, name, this);
    this._players.set(player.id, player);
    this._nextId += 1;
  }

  private mapToArray() {
    return Array.from(this._players).map((playerWithId) => playerWithId[1]);
  }

  public startFighting() {
    const randomOrderPlayers = this.mapToArray().sort(
      () => 0.5 - Math.random()
    );
    for (const player of randomOrderPlayers) {
      player.startAttack();
    }
  }

  private alivePlayers(): Player[] {
    return this.mapToArray().filter((player) => player.health > 0);
  }

  public randomAliveEnemy(attacker: Player): Player {
    const enemies = this.alivePlayers().filter(
      (player) => player.id !== attacker.id
    );
    return enemies[Math.floor(Math.random() * enemies.length)];
  }

  public isFightOver(): boolean {
    return this.alivePlayers().length == 1;
  }
}

const players = new Players();

players.generatePlayers(5);
players.startFighting();
