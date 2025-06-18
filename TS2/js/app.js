"use strict";

var UserRole;
(function (UserRole) {
    UserRole["STAFF"] = "Staff";
    UserRole["SUPERVISOR"] = "Supervisor";
})(UserRole || (UserRole = {}));

class BaseUser {
    constructor(fullName, emailAddress, userPassword) {
        this.fullName = fullName;
        this.emailAddress = emailAddress;
        this.userPassword = userPassword;
        if (!HRToolkit.validateEmail(emailAddress)) {
            throw new Error("Email format is invalid");
        }
        this.identifier = HRToolkit.createUserId();
        this.registrationDate = new Date();
    }

    login(email, password) {
        return this.emailAddress === email && this.userPassword === password;
    }
}

class Team {
    constructor(title, members = []) {
        this.title = title;
        this.members = members;
    }

    registerMember(staff) {
        if (this.members.some(s => s.identifier === staff.identifier)) {
            throw new Error("Staff already assigned to this team");
        }
        this.members.push(staff);
    }

    getMemberCount() {
        return this.members.length;
    }
}

class Staff extends BaseUser {
    constructor(fullName, emailAddress, password, _wage, team) {
        super(fullName, emailAddress, password);
        this._wage = _wage;
        this.salary = _wage;
        this.team = team;
        this.team.registerMember(this);
    }

    get salary() {
        return this._wage;
    }

    set salary(value) {
        if (value < 3000)
            throw new Error("Minimum salary is 3000");
        this._wage = value;
    }

    getPostTaxSalary() {
        return this._wage - HRToolkit.getTax(this._wage);
    }

    increaseWage(byPercent) {
        if (byPercent < 0)
            throw new Error("Raise must be non-negative");
        this._wage *= (1 + byPercent / 100);
    }

    getUserRole() {
        return UserRole.STAFF;
    }
}

class Supervisor extends Staff {
    constructor() {
        super(...arguments);
        this.teamList = [];
    }

    includeInTeam(staff) {
        if (this.teamList.some(member => member.identifier === staff.identifier)) {
            throw new Error("Already in supervisor team");
        }
        this.teamList.push(staff);
    }

    excludeFromTeam(id) {
        const idx = this.teamList.findIndex(m => m.identifier === id);
        if (idx === -1)
            throw new Error("Staff not found in team");
        this.teamList.splice(idx, 1);
    }

    viewTeamSummary() {
        return this.teamList.length === 0
            ? ["Supervisor has no team members yet."]
            : this.teamList.map(m => `ID: ${m.identifier}, Name: ${m.fullName}, Email: ${m.emailAddress}, Salary: ${m.salary}, Net: ${m.getPostTaxSalary()}`);
    }

    getUserRole() {
        return UserRole.SUPERVISOR;
    }
}

class HRToolkit {
    static createUserId() {
        return this.counter++;
    }

    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static getTax(salary) {
        return salary * 0.1;
    }

    static compileReport(users) {
        return users.length === 0
            ? ["No user data available."]
            : users.map(u => `ID: ${u.identifier}, Role: ${u.getUserRole()}, Name: ${u.fullName}, Email: ${u.emailAddress}`);
    }
}
HRToolkit.counter = 1;

const techTeam = new Team("Tech");
const adminTeam = new Team("Admin");

const staff1 = new Staff("Laila", "laila@company.com", "pw123", 5500, techTeam);
const staff2 = new Staff("Kareem", "kareem@company.com", "pw456", 4800, techTeam);

const lead = new Supervisor("Sami", "sami@company.com", "admin789", 9000, techTeam);
lead.includeInTeam(staff1);
lead.includeInTeam(staff2);

console.log(HRToolkit.compileReport([staff1, staff2, lead]));
console.log(lead.viewTeamSummary());
