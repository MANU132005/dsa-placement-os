export interface TechInterviewTopic {
  id: string;
  category: string;
  question: string;
  shortAnswer: string;
  detailedNotes: string[];
  codeExample?: string;
  infosysFrequency: 'Extreme' | 'High' | 'Medium';
}

export interface HRInterviewQuestion {
  id: string;
  question: string;
  intent: string;
  starFrameworkModel: string;
  keyPointsToCover: string[];
  commonMistakesToAvoid: string;
}

export const TECHNICAL_INTERVIEW_DATA: TechInterviewTopic[] = [
  // DBMS
  {
    id: 'dbms-1',
    category: 'DBMS',
    question: 'Explain ACID Properties in DBMS with Real-World Transaction Example.',
    shortAnswer: 'ACID stands for Atomicity, Consistency, Isolation, and Durability. They guarantee database reliability during transactions.',
    detailedNotes: [
      'Atomicity: All-or-nothing principle (e.g. money debit and credit must both succeed or both roll back).',
      'Consistency: State transition preserves database integrity constraints and foreign keys.',
      'Isolation: Concurrent transactions run independently without dirty reads or phantom reads.',
      'Durability: Committed transactions persist permanently even in system crashes (write-ahead log).'
    ],
    codeExample: `BEGIN TRANSACTION;
UPDATE Accounts SET balance = balance - 5000 WHERE id = 'UserA';
UPDATE Accounts SET balance = balance + 5000 WHERE id = 'UserB';
COMMIT;`,
    infosysFrequency: 'Extreme'
  },
  {
    id: 'dbms-2',
    category: 'DBMS',
    question: 'Difference between Clustered Index and Non-Clustered Index.',
    shortAnswer: 'Clustered index determines the physical order of data on disk (only 1 per table), while Non-Clustered index creates a separate index structure pointing to table records (multiple allowed).',
    detailedNotes: [
      'Clustered Index: Automatically created on Primary Key in B-Tree order.',
      'Non-Clustered Index: Separate index table with row locators (pointers) to data rows.',
      'Lookup Cost: Clustered is faster (direct read); Non-Clustered requires double lookup.'
    ],
    infosysFrequency: 'High'
  },

  // OS
  {
    id: 'os-1',
    category: 'OS',
    question: 'What is Deadlock and what are the 4 Necessary Coffman Conditions?',
    shortAnswer: 'A deadlock occurs when a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process.',
    detailedNotes: [
      '1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.',
      '2. Hold and Wait: A process holds a resource while waiting for additional resources.',
      '3. No Preemption: Resources cannot be forcibly confiscated.',
      '4. Circular Wait: A closed chain of processes exists where each process waits for resource held by next.'
    ],
    infosysFrequency: 'Extreme'
  },
  {
    id: 'os-2',
    category: 'OS',
    question: 'Difference between Process and Thread.',
    shortAnswer: 'A process is an executing program with its own memory space, while a thread is a lightweight execution unit sharing memory within a process.',
    detailedNotes: [
      'Process: Heavyweight, isolated virtual memory address space (text, data, heap, stack).',
      'Thread: Shared heap/code/data, individual stack and registers.',
      'Context Switch: Thread context switch is significantly faster than process context switch.'
    ],
    infosysFrequency: 'Extreme'
  },

  // CN
  {
    id: 'cn-1',
    category: 'CN',
    question: 'Explain TCP 3-Way Handshake and 4-Way Teardown.',
    shortAnswer: 'TCP establishes reliable connections using SYN, SYN-ACK, ACK, and terminates using FIN, ACK, FIN, ACK.',
    detailedNotes: [
      'Handshake Step 1: Client sends SYN (Sequence x).',
      'Handshake Step 2: Server responds with SYN-ACK (Sequence y, Ack x+1).',
      'Handshake Step 3: Client responds with ACK (Ack y+1). Connection ESTABLISHED.',
      'Teardown: Active closer sends FIN, passive acknowledges with ACK, passive sends FIN, active sends ACK.'
    ],
    infosysFrequency: 'Extreme'
  },
  {
    id: 'cn-2',
    category: 'CN',
    question: 'Difference between HTTP/1.1, HTTP/2, and HTTP/3.',
    shortAnswer: 'HTTP/1.1 introduced persistent connections; HTTP/2 introduced binary framing and multiplexing over single TCP; HTTP/3 uses QUIC (UDP) to eliminate head-of-line blocking.',
    detailedNotes: [
      'HTTP/1.1: Head-of-line blocking on TCP pipe.',
      'HTTP/2: Multiplexed streams over single TCP connection.',
      'HTTP/3: Runs over QUIC protocol (UDP base), fastest handshake and seamless connection migration.'
    ],
    infosysFrequency: 'High'
  },

  // OOPS
  {
    id: 'oops-1',
    category: 'OOPS',
    question: 'Explain the 4 Pillars of Object-Oriented Programming with Code Examples.',
    shortAnswer: 'Encapsulation, Abstraction, Inheritance, and Polymorphism form the foundation of OOP software architecture.',
    detailedNotes: [
      'Encapsulation: Hiding state variables behind private access modifiers and public getters/setters.',
      'Abstraction: Hiding complex implementation details using abstract classes or interfaces.',
      'Inheritance: Subclass deriving features and methods from superclass.',
      'Polymorphism: Method Overloading (compile-time) and Method Overriding (runtime).'
    ],
    codeExample: `// Abstraction & Polymorphism in Java/C++
abstract class Shape {
  abstract void draw();
}
class Circle extends Shape {
  @Override void draw() { System.out.println("Drawing Circle"); }
}`,
    infosysFrequency: 'Extreme'
  },

  // SQL
  {
    id: 'sql-1',
    category: 'SQL',
    question: 'Difference between WHERE and HAVING Clauses in SQL.',
    shortAnswer: 'WHERE filters individual rows before aggregation; HAVING filters aggregated groups after GROUP BY execution.',
    detailedNotes: [
      'WHERE: Cannot contain aggregate functions like COUNT(), SUM(), AVG(). Runs before GROUP BY.',
      'HAVING: Works directly on aggregated values. Runs after GROUP BY clause.'
    ],
    codeExample: `SELECT department_id, COUNT(*) 
FROM Employees 
WHERE status = 'Active' 
GROUP BY department_id 
HAVING COUNT(*) > 5;`,
    infosysFrequency: 'Extreme'
  },

  // CLOUD
  {
    id: 'cloud-1',
    category: 'Cloud',
    question: 'Difference between IaaS, PaaS, and SaaS cloud models.',
    shortAnswer: 'IaaS provides raw infrastructure (VMs, storage); PaaS provides runtime platforms (managed DB, App Services); SaaS provides ready-to-use software applications.',
    detailedNotes: [
      'IaaS: AWS EC2, Azure VM, GCP Compute Engine (Manage OS + App).',
      'PaaS: AWS Elastic Beanstalk, Heroku, Firebase (Manage App + Data only).',
      'SaaS: Gmail, Microsoft 365, Salesforce (User consumes complete software).'
    ],
    infosysFrequency: 'High'
  }
];

export const HR_INTERVIEW_DATA: HRInterviewQuestion[] = [
  {
    id: 'hr-1',
    question: 'Tell Me About Yourself and Why You Are a Strong Fit for Infosys SP / DSE.',
    intent: 'Evaluates your communication clarity, technical alignment, and confidence for Infosys campus placement.',
    starFrameworkModel: 'Structure: Background -> Key Technical Accomplishments -> Placement Readiness -> Alignment with Infosys Values.',
    keyPointsToCover: [
      'Mention your degree and college (e.g. B.Tech Computer Science student at Vardhaman College of Engineering).',
      'Highlight DSA streak, LeetCode / Coding Ninjas problem solving, and key project stack.',
      'Express genuine enthusiasm for Infosys Specialist Programmer / Digital Specialist Engineer engineering culture.'
    ],
    commonMistakesToAvoid: 'Reading directly from resume or speaking continuously for over 2.5 minutes without structured focus.'
  },
  {
    id: 'hr-2',
    question: 'Why Infosys over Other IT Services or Product Companies?',
    intent: 'Assesses company research, loyalty, and motivation to build a long-term career at Infosys.',
    starFrameworkModel: 'Show knowledge of Infosys Cobalt (Cloud), Infosys Topaz (Generative AI), and global training center in Mysore.',
    keyPointsToCover: [
      'Reference Infosys Mysore Global Education Center world-class training.',
      'Mention Infosys Topaz AI initiatives and SP role opportunity to work on complex enterprise architectures.',
      'Highlight stability, continuous upskilling, and global client exposure.'
    ],
    commonMistakesToAvoid: 'Giving generic answers like "Infosys is a big MNC" without citing specific platforms or training initiatives.'
  },
  {
    id: 'hr-3',
    question: 'Are You Open to Relocation and Working in Shifts if Required?',
    intent: 'Verifies flexibility and commitment for global project deployment across Infosys locations (Bengaluru, Hyderabad, Pune, Mysore).',
    starFrameworkModel: 'State clear 100% willingness to relocate to any Infosys development center across India.',
    keyPointsToCover: [
      'Affirm enthusiasm for living in tech hubs like Bengaluru or Hyderabad.',
      'Emphasize adaptability and eagerness to collaborate across international time zones.'
    ],
    commonMistakesToAvoid: 'Expressing hesitation or placing conditional location restrictions during HR interviews.'
  }
];
