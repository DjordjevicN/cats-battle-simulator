"use strict";
class Player {
    constructor(id, name, players, health = 100) {
        this._timer = null;
        this._id = id;
        this._name = name;
        this._health = health;
        this._players = players;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    get health() {
        return this._health;
    }
    get rechargeTime() {
        return (1000 * this._health) / 100;
    }
    get damage() {
        return this._health / 100;
    }
    get criticalChance() {
        return 10 - this._health / 10;
    }
    startAttack() {
        this._timer = setTimeout(() => {
            this.attackRandomPlayer();
        }, this.rechargeTime);
    }
    attackRandomPlayer() {
        const enemy = this._players.randomAliveEnemy(this);
        const attackPower = this.damage * this.criticalDamage();
        console.log(`COMBAT LOG = ${this._name} is attacking ${enemy._name} with damage of ${Math.ceil(attackPower)} with current health ${Math.round(enemy.health)}`);
        enemy.takeDamage(attackPower);
        if (this._players.isFightOver()) {
            console.log(`Player ${this._name} is Winner!!`);
            return;
        }
        /* Start new attack */
        this.startAttack();
    }
    takeDamage(attackPower) {
        this._health -= attackPower;
        if (this._health <= 0) {
            console.log(`${this._name} DIED`);
            if (this._timer != null) {
                /* It is hard to attack while not being alive :) */
                clearTimeout(this._timer);
            }
        }
    }
    criticalDamage() {
        if (this.criticalChance >= Math.random() * 100) {
            console.log("CRITICAL STRIKE");
            return 5;
        }
        else {
            return 1;
        }
    }
}
class Players {
    constructor() {
        this._players = new Map();
        this._nextId = 0;
    }
    generatePlayers(n) {
        for (let i = 0; i < n; i++) {
            this.addPlayer(`player-${i}`);
        }
    }
    addPlayer(name) {
        const player = new Player(this._nextId, name, this);
        this._players.set(player.id, player);
        this._nextId += 1;
    }
    mapToArray() {
        return Array.from(this._players).map((playerWithId) => playerWithId[1]);
    }
    startFighting() {
        const randomOrderPlayers = this.mapToArray().sort(() => 0.5 - Math.random());
        for (const player of randomOrderPlayers) {
            player.startAttack();
        }
    }
    alivePlayers() {
        return this.mapToArray().filter((player) => player.health > 0);
    }
    randomAliveEnemy(attacker) {
        const enemies = this.alivePlayers().filter((player) => player.id !== attacker.id);
        return enemies[Math.floor(Math.random() * enemies.length)];
    }
    isFightOver() {
        return this.alivePlayers().length == 1;
    }
}
const players = new Players();
players.generatePlayers(5);
players.startFighting();
