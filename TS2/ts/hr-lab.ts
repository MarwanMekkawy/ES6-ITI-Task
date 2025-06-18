// ========================
// 🔧 HR Suite Core Module
// ========================

// Step 1: Define Role enumeration for user types
enum UserRole {
    STAFF = 'Staff',
    SUPERVISOR = 'Supervisor',
}

// Step 2: Interface for login capability
interface AuthCapable {
    login(email: string, password: string): boolean;
}

// Step 3: Abstract User blueprint
abstract class BaseUser implements AuthCapable {
    public readonly identifier: number;
    public registrationDate: Date;

    constructor(
        public fullName: string,
        public emailAddress: string,
        private userPassword: string
    ) {
        if (!HRToolkit.validateEmail(emailAddress)) {
            throw new Error("Email format is invalid");
        }
        this.identifier = HRToolkit.createUserId();
        this.registrationDate = new Date();
    }

    login(email: string, password: string): boolean {
        return this.emailAddress === email && this.userPassword === password;
    }

    abstract getUserRole(): string;
}

// Step 4: Team class
class Team {
    constructor(public title: string, public members: Staff[] = []) {}

    registerMember(staff: Staff): void {
        if (this.members.some(s => s.identifier === staff.identifier)) {
            throw new Error("Staff already assigned to this team");
        }
        this.members.push(staff);
    }

    getMemberCount(): number {
        return this.members.length;
    }
}

// Step 5: Staff member
class Staff extends BaseUser {
    protected team: Team;

    constructor(
        fullName: string,
        emailAddress: string,
        password: string,
        private _wage: number,
        team: Team
    ) {
        super(fullName, emailAddress, password);
        this.salary = _wage;
        this.team = team;
        this.team.registerMember(this);
    }

    get salary(): number {
        return this._wage;
    }

    set salary(value: number) {
        if (value < 3000) throw new Error("Minimum salary is 3000");
        this._wage = value;
    }

    getPostTaxSalary(): number {
        return this._wage - HRToolkit.getTax(this._wage);
    }

    increaseWage(byPercent: number): void {
        if (byPercent < 0) throw new Error("Raise must be non-negative");
        this._wage *= (1 + byPercent / 100);
    }

    getUserRole(): string {
        return UserRole.STAFF;
    }
}

// Step 6: Supervisor class
class Supervisor extends Staff {
    public teamList: Staff[] = [];

    includeInTeam(staff: Staff): void {
        if (this.teamList.some(member => member.identifier === staff.identifier)) {
            throw new Error("Already in supervisor team");
        }
        this.teamList.push(staff);
    }

    excludeFromTeam(id: number): void {
        const idx = this.teamList.findIndex(m => m.identifier === id);
        if (idx === -1) throw new Error("Staff not found in team");
        this.teamList.splice(idx, 1);
    }

    viewTeamSummary(): string[] {
        return this.teamList.length === 0
            ? ["Supervisor has no team members yet."]
            : this.teamList.map(m => \`ID: \${m.identifier}, Name: \${m.fullName}, Email: \${m.emailAddress}, Salary: \${m.salary}, Net: \${m.getPostTaxSalary()}\`);
    }

    getUserRole(): string {
        return UserRole.SUPERVISOR;
    }
}

// Step 7: HR utility helper
class HRToolkit {
    private static counter = 1;

    static createUserId(): number {
        return this.counter++;
    }

    static validateEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static getTax(salary: number): number {
        return salary * 0.1;
    }

    static compileReport(users: BaseUser[]): string[] {
        return users.length === 0
            ? ["No user data available."]
            : users.map(u => \`ID: \${u.identifier}, Role: \${u.getUserRole()}, Name: \${u.fullName}, Email: \${u.emailAddress}\`);
    }
}

// Final tests
const techTeam = new Team("Tech");
const adminTeam = new Team("Admin");

const staff1 = new Staff("Laila", "laila@company.com", "pw123", 5500, techTeam);
const staff2 = new Staff("Kareem", "kareem@company.com", "pw456", 4800, techTeam);

const lead = new Supervisor("Sami", "sami@company.com", "admin789", 9000, techTeam);
lead.includeInTeam(staff1);
lead.includeInTeam(staff2);

console.log(HRToolkit.compileReport([staff1, staff2, lead]));
console.log(lead.viewTeamSummary());
