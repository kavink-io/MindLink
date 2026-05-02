import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Send, Sparkles, BookOpen, HelpCircle, Lightbulb, Code, Eraser } from 'lucide-react';

interface AIMessage {
  id: string; role: 'user' | 'assistant'; content: string; timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: HelpCircle, label: 'Explain a concept', prompt: 'Explain ' },
  { icon: Code, label: 'Quiz me', prompt: 'Give me a quiz on ' },
  { icon: BookOpen, label: 'Summarize topic', prompt: 'Summarize ' },
  { icon: Lightbulb, label: 'Solve a problem', prompt: 'Help me solve: ' },
];

function generateResponse(msg: string): string {
  const q = msg.toLowerCase().trim();

  // Math evaluation
  const mathMatch = msg.match(/[\d\s+\-*/().^%]+/);
  if (mathMatch && /[\d]+\s*[+\-*/^%]\s*[\d]+/.test(msg)) {
    try {
      const expr = msg.replace(/[^0-9+\-*/().% ]/g, '').trim();
      if (expr) {
        const result = Function(`"use strict"; return (${expr.replace(/\^/g, '**')})`)();
        return `## 🧮 Solution\n\n**${expr} = ${result}**\n\nHere's the breakdown:\n- Expression: \`${expr}\`\n- Result: **${result}**\n\nWant me to explain the math behind this or try a harder problem?`;
      }
    } catch { /* fall through */ }
  }

  // Topic-specific knowledge base
  const KB: Record<string, string> = {
    'binary search': '## 🔍 Binary Search\n\nBinary search finds a target in a **sorted array** by repeatedly dividing the search space in half.\n\n**Algorithm:**\n1. Set `left = 0`, `right = n-1`\n2. Find `mid = (left + right) / 2`\n3. If `arr[mid] == target` → found!\n4. If `arr[mid] < target` → `left = mid + 1`\n5. If `arr[mid] > target` → `right = mid - 1`\n6. Repeat until `left > right`\n\n**Time:** O(log n) · **Space:** O(1)\n\n```python\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: left = mid + 1\n        else: right = mid - 1\n    return -1\n```',
    'linked list': '## 🔗 Linked List\n\nA **linked list** is a linear data structure where elements (nodes) are connected via pointers.\n\n**Types:**\n- **Singly Linked** → each node points to the next\n- **Doubly Linked** → nodes point both forward and backward\n- **Circular** → last node points back to first\n\n**Operations & Complexity:**\n| Operation | Time |\n|-----------|------|\n| Access | O(n) |\n| Search | O(n) |\n| Insert (head) | O(1) |\n| Insert (tail) | O(n) / O(1) with tail pointer |\n| Delete | O(n) |\n\n**vs Array:** Arrays have O(1) access but O(n) insertion. Linked lists have O(1) insertion but O(n) access.',
    'stack': '## 📚 Stack (LIFO)\n\nA **stack** follows **Last In, First Out** — like a stack of plates.\n\n**Operations:**\n- `push(x)` → add to top — O(1)\n- `pop()` → remove from top — O(1)\n- `peek()` → view top — O(1)\n- `isEmpty()` → check if empty — O(1)\n\n**Use cases:** function call stack, undo/redo, expression evaluation, backtracking (DFS)\n\n```python\nstack = []\nstack.append(1)  # push\nstack.append(2)\nstack.pop()      # returns 2\n```',
    'queue': '## 📬 Queue (FIFO)\n\nA **queue** follows **First In, First Out** — like a line at a store.\n\n**Operations:**\n- `enqueue(x)` → add to rear — O(1)\n- `dequeue()` → remove from front — O(1)\n- `peek()` → view front — O(1)\n\n**Types:** Simple Queue, Circular Queue, Priority Queue, Deque\n\n**Use cases:** BFS, task scheduling, print queues, message buffers',
    'recursion': '## 🔄 Recursion\n\nA function that **calls itself** to break a problem into smaller subproblems.\n\n**Two essential parts:**\n1. **Base case** → when to stop\n2. **Recursive case** → break problem down\n\n```python\ndef factorial(n):\n    if n <= 1: return 1        # base case\n    return n * factorial(n-1)  # recursive case\n\n# factorial(5) = 5 * 4 * 3 * 2 * 1 = 120\n```\n\n**Common examples:** Fibonacci, tree traversal, merge sort, Tower of Hanoi\n\n⚠️ **Watch out:** Stack overflow from missing base case!',
    'big o': '## ⏱️ Big O Notation\n\nDescribes how an algorithm\'s performance scales with input size.\n\n**Common complexities (best → worst):**\n| Big O | Name | Example |\n|-------|------|---------|\n| O(1) | Constant | Array access |\n| O(log n) | Logarithmic | Binary search |\n| O(n) | Linear | Linear search |\n| O(n log n) | Linearithmic | Merge sort |\n| O(n²) | Quadratic | Bubble sort |\n| O(2ⁿ) | Exponential | Recursive fibonacci |\n| O(n!) | Factorial | Permutations |\n\n**Rules:** Drop constants, drop lower-order terms. O(2n + 5) → O(n)',
    'sorting': '## 🔀 Sorting Algorithms\n\n| Algorithm | Best | Average | Worst | Space | Stable? |\n|-----------|------|---------|-------|-------|---------|\n| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |\n| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |\n| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |\n| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |\n| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |\n| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |\n\n💡 **Tip:** Merge Sort for stability, Quick Sort for average speed, Insertion Sort for small/nearly-sorted arrays.',
    'react': '## ⚛️ React Summary\n\n**Core Concepts:**\n- **Components** → reusable UI building blocks\n- **JSX** → HTML-like syntax in JavaScript\n- **Props** → data passed parent → child (read-only)\n- **State** → component\'s internal data (triggers re-render)\n\n**Key Hooks:**\n- `useState` → local state\n- `useEffect` → side effects (API calls, subscriptions)\n- `useRef` → persist values without re-render\n- `useMemo` → memoize expensive calculations\n- `useCallback` → memoize functions\n- `useContext` → global state without prop drilling\n\n**Rules of Hooks:**\n1. Only call at top level (not in loops/conditions)\n2. Only call from React functions\n3. Custom hooks start with `use`',
    'javascript': '## 📜 JavaScript Key Concepts\n\n**Data Types:** string, number, boolean, null, undefined, symbol, bigint, object\n\n**== vs ===:**\n- `==` → loose equality (type coercion) → `"5" == 5` is true\n- `===` → strict equality (no coercion) → `"5" === 5` is false\n- **Always use `===`!**\n\n**Closures:** A function that remembers variables from its outer scope\n```javascript\nfunction counter() {\n  let count = 0;\n  return () => ++count;\n}\nconst inc = counter();\ninc(); // 1\ninc(); // 2\n```\n\n**Promises & Async/Await:**\n```javascript\nasync function fetchData() {\n  const res = await fetch(url);\n  const data = await res.json();\n  return data;\n}\n```',
    'python': '## 🐍 Python Key Concepts\n\n**Data Structures:**\n- `list` → mutable, ordered: `[1, 2, 3]`\n- `tuple` → immutable, ordered: `(1, 2, 3)`\n- `dict` → key-value pairs: `{"a": 1}`\n- `set` → unique values: `{1, 2, 3}`\n\n**List Comprehension:**\n```python\nsquares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\n```\n\n**Key Features:** Dynamic typing, indentation-based blocks, rich standard library, garbage collected\n\n**Popular Libraries:** NumPy, Pandas, Flask/Django, TensorFlow, Matplotlib',
    'sql': '## 🗄️ SQL Essentials\n\n**CRUD Operations:**\n```sql\nSELECT * FROM users WHERE age > 18 ORDER BY name;\nINSERT INTO users (name, age) VALUES (\'Alice\', 25);\nUPDATE users SET age = 26 WHERE name = \'Alice\';\nDELETE FROM users WHERE id = 1;\n```\n\n**JOINs:**\n- `INNER JOIN` → matching rows in both tables\n- `LEFT JOIN` → all left + matching right\n- `RIGHT JOIN` → all right + matching left\n- `FULL JOIN` → all rows from both\n\n**Aggregations:** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`\n**Grouping:** `GROUP BY` with `HAVING` for filtered groups\n**Subqueries:** `SELECT * FROM users WHERE age > (SELECT AVG(age) FROM users)`',
    'oop': '## 🏗️ Object-Oriented Programming\n\n**4 Pillars:**\n\n1. **Encapsulation** → bundle data + methods, hide internals\n2. **Abstraction** → expose only essential features\n3. **Inheritance** → child class inherits from parent\n4. **Polymorphism** → same interface, different behavior\n\n```python\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        raise NotImplementedError\n\nclass Dog(Animal):           # Inheritance\n    def speak(self):         # Polymorphism\n        return "Woof!"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow!"\n```\n\n**SOLID Principles:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion',
    'tcp udp': '## 🌐 TCP vs UDP\n\n| Feature | TCP | UDP |\n|---------|-----|-----|\n| Connection | Connection-oriented | Connectionless |\n| Reliability | Guaranteed delivery | No guarantee |\n| Ordering | Ordered packets | No ordering |\n| Speed | Slower | Faster |\n| Header | 20 bytes | 8 bytes |\n| Use cases | Web, email, file transfer | Gaming, streaming, DNS |\n\n**TCP** = like registered mail (reliable but slower)\n**UDP** = like shouting across a room (fast but might miss)',
    'hash table': '## #️⃣ Hash Table\n\nA data structure that maps **keys to values** using a **hash function**.\n\n**Operations:**\n| Operation | Average | Worst |\n|-----------|---------|-------|\n| Insert | O(1) | O(n) |\n| Search | O(1) | O(n) |\n| Delete | O(1) | O(n) |\n\n**Collision Handling:**\n- **Chaining** → linked list at each bucket\n- **Open Addressing** → probe for next empty slot\n\n**Hash Function** converts key → index: `index = hash(key) % tableSize`\n\nUsed in: dictionaries, caches, sets, database indexing',
    'tree': '## 🌳 Trees\n\nA hierarchical data structure with **nodes** and **edges**.\n\n**Types:**\n- **Binary Tree** → max 2 children per node\n- **BST** → left < parent < right\n- **AVL/Red-Black** → self-balancing BST\n- **Heap** → complete binary tree, max/min at root\n- **Trie** → prefix tree for strings\n\n**Traversals:**\n- **Inorder** (L, Root, R) → sorted order for BST\n- **Preorder** (Root, L, R) → copy tree\n- **Postorder** (L, R, Root) → delete tree\n- **Level order** → BFS, queue-based\n\n**BST operations:** Search, Insert, Delete — all O(log n) average, O(n) worst',
    'graph': '## 🕸️ Graphs\n\nA collection of **vertices** (nodes) and **edges** (connections).\n\n**Types:** Directed/Undirected, Weighted/Unweighted, Cyclic/Acyclic\n\n**Representations:**\n- **Adjacency Matrix** → O(1) edge lookup, O(V²) space\n- **Adjacency List** → O(V+E) space, efficient for sparse graphs\n\n**Key Algorithms:**\n| Algorithm | Purpose | Complexity |\n|-----------|---------|------------|\n| BFS | Shortest path (unweighted) | O(V+E) |\n| DFS | Traversal, cycle detection | O(V+E) |\n| Dijkstra | Shortest path (weighted) | O(V² or E log V) |\n| Bellman-Ford | Shortest path (negative weights) | O(VE) |\n| Kruskal/Prim | Minimum spanning tree | O(E log E) |',
    'dynamic programming': '## 🧩 Dynamic Programming\n\nSolve complex problems by breaking them into **overlapping subproblems** and storing results.\n\n**Two approaches:**\n- **Top-down (Memoization)** → recursive + cache\n- **Bottom-up (Tabulation)** → iterative, fill table\n\n**Classic example — Fibonacci:**\n```python\n# Memoization\ndef fib(n, memo={}):\n    if n <= 1: return n\n    if n not in memo:\n        memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n\n# Tabulation\ndef fib(n):\n    dp = [0, 1]\n    for i in range(2, n+1):\n        dp.append(dp[i-1] + dp[i-2])\n    return dp[n]\n```\n\n**Common DP problems:** Knapsack, LCS, Edit Distance, Coin Change, Matrix Chain',
    'system design': '## 🏗️ System Design Basics\n\n**Key Concepts:**\n- **Scalability** → horizontal (more machines) vs vertical (bigger machine)\n- **Load Balancing** → distribute traffic (Round Robin, Least Connections)\n- **Caching** → Redis, Memcached — reduce DB load\n- **Database** → SQL (ACID) vs NoSQL (flexible, scalable)\n- **CDN** → cache static content closer to users\n- **Message Queue** → async processing (Kafka, RabbitMQ)\n- **Microservices** → independent, deployable services\n\n**Design Process:**\n1. Clarify requirements\n2. Estimate scale\n3. Define API\n4. Design data model\n5. High-level architecture\n6. Deep dive components\n7. Address bottlenecks',
  };

  // Match against knowledge base
  for (const [key, value] of Object.entries(KB)) {
    if (q.includes(key) || key.split(' ').every(w => q.includes(w))) {
      return value;
    }
  }

  // Keyword-based smart matching
  if (q.includes('explain') || q.includes('what is') || q.includes('what are') || q.includes('define') || q.includes('tell me about')) {
    const topic = msg.replace(/^(explain|what is|what are|define|tell me about|can you explain)\s*/i, '').replace(/[?.!]/g, '').trim();
    for (const [key, value] of Object.entries(KB)) {
      if (topic.toLowerCase().includes(key) || key.includes(topic.toLowerCase())) return value;
    }
    return `## 📖 ${topic}\n\nThat's a great topic to explore! Here's what I'd recommend:\n\n1. **Start with the basics** — understand the core definition and purpose\n2. **Learn the key concepts** — what makes ${topic} unique\n3. **Practice with examples** — apply the concepts hands-on\n4. **Build something** — create a small project using ${topic}\n\n💡 Try asking me about specific CS topics like:\n- Data structures (arrays, trees, graphs, hash tables)\n- Algorithms (sorting, searching, dynamic programming)\n- Languages (Python, JavaScript, Java, SQL)\n- Concepts (OOP, system design, TCP/UDP, Big O)\n\nI have detailed knowledge on all of these! 🧠`;
  }

  if (q.includes('quiz')) {
    const topic = msg.replace(/^(give me a |create a |start a )?quiz( on| about| for)?\s*/i, '').replace(/[?.!]/g, '').trim();
    return `## 🎯 Quick Quiz: ${topic || 'Computer Science'}\n\n**Q1:** What is the time complexity of accessing an array element by index?\n- A) O(n)\n- B) O(log n)\n- C) **O(1) ✅**\n- D) O(n²)\n\n**Q2:** Which data structure uses LIFO (Last In, First Out)?\n- A) Queue\n- B) **Stack ✅**\n- C) Linked List\n- D) Heap\n\n**Q3:** What is the worst-case time complexity of Quick Sort?\n- A) O(n log n)\n- B) O(n)\n- C) **O(n²) ✅**\n- D) O(log n)\n\n**Q4:** Which traversal gives sorted output for a BST?\n- A) Preorder\n- B) **Inorder ✅**\n- C) Postorder\n- D) Level order\n\n**Q5:** What does DNS stand for?\n- A) Data Network System\n- B) **Domain Name System ✅**\n- C) Digital Node Service\n- D) Dynamic Name Server\n\nHow did you do? Want explanations for any question? 📚`;
  }

  if (q.includes('summarize') || q.includes('summary')) {
    return KB['react'] || `I can summarize topics for you! Try: "Summarize React", "Summarize OOP", "Summarize SQL" etc.`;
  }

  if (q.includes('solve') || q.includes('help me') || q.includes('how to') || q.includes('how do')) {
    const problem = msg.replace(/^(help me |how to |how do (i |you )?|solve:?\s*)/i, '').trim();
    return `## 💡 Let me help with: "${problem}"\n\n**Approach:**\n1. **Understand the problem** — what are the inputs and expected outputs?\n2. **Identify patterns** — does this relate to known algorithms?\n3. **Start simple** — write a brute force solution first\n4. **Optimize** — can you improve time/space complexity?\n\n**Common strategies:**\n- 🔍 Two pointers / sliding window\n- 📊 Hash map for O(1) lookups\n- 🔄 Recursion with memoization\n- 📐 Divide and conquer\n- 🧩 Dynamic programming\n\nCan you share more details about the problem? I can give you a more specific solution! 🎯`;
  }

  // Check for greetings
  if (/^(hi|hello|hey|sup|yo|greetings)/i.test(q)) {
    return "Hey there! 👋 I'm your AI study assistant. I can:\n\n- **Explain** concepts (try: \"explain binary search\")\n- **Quiz** you (try: \"quiz me on data structures\")\n- **Solve** problems (try: \"solve 15 * 23 + 7\")\n- **Summarize** topics (try: \"summarize React\")\n\nI have deep knowledge on DSA, Python, JavaScript, React, SQL, OOP, System Design, and more. What would you like to learn? 🧠";
  }

  // Check for thanks
  if (/^(thanks|thank you|thx|ty|cheers)/i.test(q)) {
    return "You're welcome! 😊 Happy to help. Keep learning and don't hesitate to ask more questions! 🚀";
  }

  // Default: try to give a helpful response anyway
  return `## 🤔 About: "${msg}"\n\nI'd love to help with this! Here's what I can do:\n\n- **"Explain [topic]"** — get a detailed explanation\n  _(e.g., explain dynamic programming, explain OOP)_\n- **"Quiz me on [topic]"** — test your knowledge\n- **"Solve [math/problem]"** — calculate or solve\n  _(e.g., solve 2+2, solve 15*23)_\n- **"Summarize [topic]"** — get key points\n\n**Topics I know well:** Binary Search, Linked Lists, Stacks, Queues, Trees, Graphs, Hash Tables, Sorting, Big O, Recursion, Dynamic Programming, OOP, React, JavaScript, Python, SQL, TCP/UDP, System Design\n\nTry one of these! 🎯`;
}

const WELCOME_MSG = "Hey! 👋 I'm your **AI Study Assistant**. I can explain concepts, generate quizzes, solve math problems, and summarize topics.\n\nTry asking me:\n- \"Explain binary search\"\n- \"Quiz me on data structures\"\n- \"Solve 15 * 23 + 7\"\n- \"Summarize React\"\n- \"What is dynamic programming?\"\n\nI have deep knowledge on DSA, programming languages, system design, and more! 🧠";

export default function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    { id: '1', role: 'assistant', content: WELCOME_MSG, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: msg, timestamp: new Date() }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(msg);
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: new Date() }]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-emerald/20 to-neon-cyan/20 flex items-center justify-center">
          <Brain className="w-6 h-6 text-neon-emerald" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Study Assistant</h1>
          <p className="text-sm text-slate-400">Explain, quiz, summarize — powered by AI</p>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {QUICK_PROMPTS.map((qp) => (
          <button key={qp.label} onClick={() => setInput(qp.prompt)} className="glass glass-hover rounded-xl p-3 text-left group">
            <qp.icon className="w-4 h-4 text-neon-cyan mb-1" />
            <p className="text-xs font-medium text-slate-300 group-hover:text-white">{qp.label}</p>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div className="glass rounded-2xl flex flex-col" style={{ height: '500px' }}>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={msg.role === 'user' ? 'chat-bubble chat-bubble-self' : 'max-w-[85%] glass-light rounded-2xl rounded-bl-sm px-5 py-4'}>
                {msg.role === 'assistant' && <div className="flex items-center gap-2 mb-2 text-xs text-neon-emerald"><Brain className="w-3 h-3" /> AI Assistant</div>}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-2 items-center text-sm text-slate-400">
              <Brain className="w-4 h-4 text-neon-emerald animate-pulse" />
              <div className="flex gap-1"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="p-3 border-t border-white/5 flex gap-2">
          <button onClick={() => { setMessages([{ id: '1', role: 'assistant', content: WELCOME_MSG, timestamp: new Date() }]); }} className="btn-ghost px-2"><Eraser className="w-4 h-4" /></button>
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask me anything..." className="input-field text-sm flex-1" />
          <button onClick={() => sendMessage()} className="btn-primary px-4"><Send className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
}
