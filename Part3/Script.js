///////01
class Transport {
    constructor(wheelCount, velocity) {
        this.wheelCount = wheelCount;
        this.velocity = velocity;
    }

    displayDetails() {
        console.log(`Number of wheels: ${this.wheelCount}`, `Speed: ${this.velocity}`);
    }
}

///////02
class Motorcycle extends Transport {
    static instances = 0;

    constructor() {
        super(2, 'moderately fast');
        Motorcycle.instances++;
    }

///////03
    static showInstanceCount() {
        console.log(`Motorcycle created ${Motorcycle.instances} times`);
    }
}

const car = new Transport(4, 'fast');
car.displayDetails();

const moto1 = new Motorcycle();
moto1.displayDetails();

const moto2 = new Motorcycle();
moto2.displayDetails();

const moto3 = new Motorcycle();
moto3.displayDetails();

Motorcycle.showInstanceCount();
