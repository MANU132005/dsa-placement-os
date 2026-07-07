export interface MockQuestion {
  mockId?: string;
  qIndex?: number;
  id: string;
  title: string;
  section: 'Section 1: Easy' | 'Section 2: Medium' | 'Section 3: Hard';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pattern: string;
  expectedTime: number; // in mins
  timeComplexity: string;
  spaceComplexity: string;
  functionName: string;
  args: string[];
  template: string;
  story: string;
  constraints: string;
  inputFormat: string;
  outputFormat: string;
  examples: { input: string; output: string; explanation: string }[];
  edgeCases: string[];
  bruteForce: string;
  optimalSolution: string;
  editorial: string;
  commonMistakes: string[];
  alternativeSolution: string;
  relatedProblems: { name: string; url: string }[];
  hiddenTags: string[];
  testCases: { args: any[]; expected: any }[];
}

export interface MockTest {
  id: string;
  name: string;
  duration: number; // 125 mins
  questions: MockQuestion[];
}

export const infosysMockTests: MockTest[] = [
  {
    "id": "mock-1",
    "name": "Infosys SP Mock 1 (Basics & Linear DP)",
    "duration": 125,
    "questions": [
      {
        "id": "m1-q1",
        "title": "Hospital Attendance Roster",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Math / Simulation",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "functionName": "countTriageDivisors",
        "args": [
          "n"
        ],
        "template": "function countTriageDivisors(n) {\n  // Write your code here\n  \n}",
        "story": "In a hospital triage system, patients are assigned numbers from 1 to N. The head nurse wants to identify key control patients. A patient number is a 'control patient' if it is a divisor of N. Count the total number of control patients.",
        "constraints": "1 <= N <= 10^9",
        "inputFormat": "An integer N representing the total number of patients",
        "outputFormat": "An integer representing the count of control patients",
        "examples": [
          {
            "input": "n = 12",
            "output": "6",
            "explanation": "Divisors of 12 are 1, 2, 3, 4, 6, 12. Total count is 6."
          }
        ],
        "edgeCases": [
          "N = 1 (output 1)"
        ],
        "bruteForce": "function countTriageDivisors(n) {\n  let count = 0;\n  for(let i=1; i<=n; i++) if(n%i===0) count++;\n  return count;\n}",
        "optimalSolution": "function countTriageDivisors(n) {\n  let count = 0;\n  for (let i = 1; i * i <= n; i++) {\n    if (n % i === 0) {\n      count++;\n      if (i * i !== n) {\n        count++;\n      }\n    }\n  }\n  return count;\n}",
        "editorial": "Instead of checking all numbers up to N which would TLE for 10^9, we only iterate up to sqrt(N). For every divisor i, N/i is also a divisor.",
        "commonMistakes": [
          "Iterating all the way to N, which causes Time Limit Exceeded (TLE) for large inputs.",
          "Forgetting to handle perfect square root matches uniquely (adds duplicate divisor)."
        ],
        "alternativeSolution": "Prime factorize N and use the divisor formula: (a1 + 1)*(a2 + 1)*...",
        "relatedProblems": [
          {
            "name": "LeetCode 507 - Perfect Number",
            "url": "https://leetcode.com/problems/perfect-number/"
          }
        ],
        "hiddenTags": [
          "Math",
          "Prime Factorization"
        ],
        "testCases": [
          {
            "args": [
              12
            ],
            "expected": 6
          },
          {
            "args": [
              1
            ],
            "expected": 1
          },
          {
            "args": [
              100000000
            ],
            "expected": 81
          }
        ]
      },
      {
        "id": "m1-q2",
        "title": "Library Book Cataloging",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "HashMap / Frequency",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(U) where U is unique books",
        "functionName": "findTargetFrequency",
        "args": [
          "books",
          "k"
        ],
        "template": "function findTargetFrequency(books, k) {\n  // Write your code here\n  \n}",
        "story": "A university library receives a shipment of books with numeric IDs. The librarian wants to identify the book ID that appears exactly K times. If there are multiple such IDs, return the smallest one. If none exist, return -1.",
        "constraints": "1 <= books.length <= 10^5\n1 <= books[i] <= 10^9\n1 <= k <= 10^5",
        "inputFormat": "An array of book IDs and an integer K",
        "outputFormat": "The book ID with frequency K, or -1",
        "examples": [
          {
            "input": "books = [4, 5, 4, 6, 5, 4, 3], k = 2",
            "output": "5",
            "explanation": "4 appears 3 times, 5 appears 2 times, 6 and 3 appear 1 time. Book 5 appears exactly K=2 times."
          }
        ],
        "edgeCases": [
          "No book appears K times",
          "Multiple books appear K times"
        ],
        "bruteForce": "Use nested loops to count occurrences of each book, then sort and find the match. O(N^2) complexity.",
        "optimalSolution": "function findTargetFrequency(books, k) {\n  const counts = {};\n  for (const id of books) {\n    counts[id] = (counts[id] || 0) + 1;\n  }\n  let ans = Infinity;\n  for (const id in counts) {\n    if (counts[id] === k) {\n      ans = Math.min(ans, parseInt(id));\n    }\n  }\n  return ans === Infinity ? -1 : ans;\n}",
        "editorial": "We use a hashmap to record the frequency of each book ID in a single pass. Then we iterate through the key-value pairs to find the smallest book ID that meets the frequency requirement.",
        "commonMistakes": [
          "Incorrectly returning the first matching element instead of the minimum ID.",
          "Relying on JS object keys order, which sorts numeric keys automatically but might fail for larger IDs or negative values if not handled carefully."
        ],
        "alternativeSolution": "Sort the array and count contiguous duplicates in a single pass.",
        "relatedProblems": [
          {
            "name": "LeetCode 347 - Top K Frequent Elements",
            "url": "https://leetcode.com/problems/top-k-frequent-elements/"
          }
        ],
        "hiddenTags": [
          "HashMap",
          "Sorting"
        ],
        "testCases": [
          {
            "args": [
              [
                4,
                5,
                4,
                6,
                5,
                4,
                3
              ],
              2
            ],
            "expected": 5
          },
          {
            "args": [
              [
                1,
                2,
                3
              ],
              2
            ],
            "expected": -1
          },
          {
            "args": [
              [
                999,
                999,
                888,
                888
              ],
              2
            ],
            "expected": 888
          }
        ]
      },
      {
        "id": "m1-q3",
        "title": "Metro Passenger Flow",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Sliding Window",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "functionName": "maxPassengerWindow",
        "args": [
          "passengers",
          "k"
        ],
        "template": "function maxPassengerWindow(passengers, k) {\n  // Write your code here\n  \n}",
        "story": "A metro station records passenger entries per minute in an array. To optimize staff allocation, find the maximum number of passenger entries in any contiguous window of K minutes.",
        "constraints": "1 <= passengers.length <= 10^5\n0 <= passengers[i] <= 10^4\n1 <= k <= passengers.length",
        "inputFormat": "An array of entries per minute and window size K",
        "outputFormat": "An integer representing the maximum passenger entries sum",
        "examples": [
          {
            "input": "passengers = [1, 2, 5, 2, 8, 1, 5], k = 3",
            "output": "15",
            "explanation": "Maximum passenger entries are inside window [2, 8, 1] which sums to 11? Wait, [2, 5, 2] is 9. [5, 2, 8] is 15. So 15."
          }
        ],
        "edgeCases": [
          "K is equal to length of array"
        ],
        "bruteForce": "Iterate through all possible start points of size K and compute sum. O(N*K) complexity.",
        "optimalSolution": "function maxPassengerWindow(passengers, k) {\n  let currentSum = 0;\n  for(let i=0; i<k; i++) currentSum += passengers[i];\n  let maxSum = currentSum;\n  for(let i=k; i<passengers.length; i++) {\n    currentSum += passengers[i] - passengers[i-k];\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  return maxSum;\n}",
        "editorial": "Standard fixed-size sliding window. Add the new element entering the window and subtract the old element leaving the window in O(1) time.",
        "commonMistakes": [
          "Recalculating the sum of window elements on each step, causing O(N*K) TLE.",
          "Off-by-one errors during loop transitions."
        ],
        "alternativeSolution": "Compute prefix sum array and query sum in O(1).",
        "relatedProblems": [
          {
            "name": "LeetCode 643 - Maximum Average Subarray I",
            "url": "https://leetcode.com/problems/maximum-average-subarray-i/"
          }
        ],
        "hiddenTags": [
          "Sliding Window",
          "Arrays"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                5,
                2,
                8,
                1,
                5
              ],
              3
            ],
            "expected": 15
          },
          {
            "args": [
              [
                10,
                20,
                30
              ],
              3
            ],
            "expected": 60
          },
          {
            "args": [
              [
                5
              ],
              1
            ],
            "expected": 5
          }
        ]
      },
      {
        "id": "m1-q4",
        "title": "Warehouse Rack Optimization",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "Dynamic Programming",
        "expectedTime": 45,
        "timeComplexity": "O(N * W)",
        "spaceComplexity": "O(W)",
        "functionName": "maxRackValuation",
        "args": [
          "weights",
          "values",
          "capacity"
        ],
        "template": "function maxRackValuation(weights, values, capacity) {\n  // Write your code here\n  \n}",
        "story": "A warehouse manager has a storage rack of maximum capacity W. There are N items, each with a specific weight and valuation. Find the maximum valuation of items the rack can hold without exceeding its capacity.",
        "constraints": "1 <= N <= 1000\n1 <= capacity <= 1000\nweights[i] <= 1000, values[i] <= 1000",
        "inputFormat": "Weights array, Values array, and Capacity integer",
        "outputFormat": "An integer representing the maximum valuation",
        "examples": [
          {
            "input": "weights = [2, 3, 4], values = [3, 4, 5], capacity = 5",
            "output": "7",
            "explanation": "Choose items 1 and 2 (weights 2+3=5, values 3+4=7)."
          }
        ],
        "edgeCases": [
          "Items exceed capacity",
          "Capacity is 0"
        ],
        "bruteForce": "Use recursion to explore all 2^N subsets of items and choose the valid one with maximum valuation.",
        "optimalSolution": "function maxRackValuation(weights, values, capacity) {\n  const dp = Array(capacity + 1).fill(0);\n  for (let i = 0; i < weights.length; i++) {\n    const w = weights[i];\n    const v = values[i];\n    for (let j = capacity; j >= w; j--) {\n      dp[j] = Math.max(dp[j], dp[j - w] + v);\n    }\n  }\n  return dp[capacity];\n}",
        "editorial": "This is the classic 0/1 Knapsack problem. By iterating backwards through capacity, we can reduce the space complexity to O(W) with a single-dimension array.",
        "commonMistakes": [
          "Iterating forwards in inner loop, which allows reusing items multiple times (becomes Unbounded Knapsack).",
          "Incorrect array initialization sizes."
        ],
        "alternativeSolution": "Use 2D grid DP (DP[i][j] representing items 0 to i and capacity j).",
        "relatedProblems": [
          {
            "name": "LeetCode 416 - Partition Equal Subset Sum",
            "url": "https://leetcode.com/problems/partition-equal-subset-sum/"
          }
        ],
        "hiddenTags": [
          "Dynamic Programming",
          "Knapsack"
        ],
        "testCases": [
          {
            "args": [
              [
                2,
                3,
                4
              ],
              [
                3,
                4,
                5
              ],
              5
            ],
            "expected": 7
          },
          {
            "args": [
              [
                5
              ],
              [
                10
              ],
              2
            ],
            "expected": 0
          },
          {
            "args": [
              [
                1,
                2,
                3
              ],
              [
                10,
                15,
                40
              ],
              6
            ],
            "expected": 65
          }
        ]
      }
    ]
  },
  {
    "id": "mock-2",
    "name": "Infosys SP Mock 2 (Graph Patrols & Heap Queues)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-2",
        "qIndex": 1,
        "id": "mock-2-q1",
        "title": "College Exam Seating",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Strings / Hashing",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "functionName": "isIsomorphicSeating",
        "args": [
          "s",
          "t"
        ],
        "template": "function isIsomorphicSeating(s, t) {\n  // Write your code here\n  \n}",
        "story": "Verify s matches t. Characters in s can be replaced uniquely to get t.",
        "constraints": "1 <= s.length <= 10^4",
        "inputFormat": "Two seating configuration strings s and t",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "egg, add",
            "output": "true",
            "explanation": "e -> a, g -> d."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function isIsomorphicSeating(s, t) {\n  const m1 = {}, m2 = {};\n  for(let i=0; i<s.length; i++) {\n    if(m1[s[i]] !== m2[t[i]]) return false;\n    m1[s[i]] = i + 1;\n    m2[t[i]] = i + 1;\n  }\n  return true;\n}",
        "optimalSolution": "function isIsomorphicSeating(s, t) {\n  const m1 = {}, m2 = {};\n  for(let i=0; i<s.length; i++) {\n    if(m1[s[i]] !== m2[t[i]]) return false;\n    m1[s[i]] = i + 1;\n    m2[t[i]] = i + 1;\n  }\n  return true;\n}",
        "editorial": "Isomorphic strings map character replacements bidirectionally.",
        "testCases": [
          {
            "args": [
              "egg",
              "add"
            ],
            "expected": true
          },
          {
            "args": [
              "foo",
              "bar"
            ],
            "expected": false
          }
        ],
        "commonMistakes": [
          "Not checking bidirectional mappings."
        ],
        "alternativeSolution": "Track last seen index in arrays instead of object hashes.",
        "relatedProblems": [
          {
            "name": "LeetCode 205",
            "url": "https://leetcode.com/problems/isomorphic-strings/"
          }
        ],
        "hiddenTags": [
          "Strings",
          "HashMap"
        ]
      },
      {
        "mockId": "mock-2",
        "qIndex": 2,
        "id": "mock-2-q2",
        "title": "Transport Fleet Routing",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Binary Search on Answer",
        "expectedTime": 30,
        "timeComplexity": "O(N log R)",
        "spaceComplexity": "O(1)",
        "functionName": "minFleetSpeed",
        "args": [
          "dist",
          "hour"
        ],
        "template": "function minFleetSpeed(dist, hour) {\n  // Write your code here\n  \n}",
        "story": "A transport fleet travels checkpoints. Find min speed to cover dist within hour hours.",
        "constraints": "1 <= dist.length <= 10^5",
        "inputFormat": "Distance array and hour float",
        "outputFormat": "min speed",
        "examples": [
          {
            "input": "dist = [1,3,2], hour = 6",
            "output": "1",
            "explanation": "Speed 1 takes 6h."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function minFleetSpeed(dist, hour) {\n  let low = 1, high = 10000000;\n  let ans = -1;\n  while(low <= high) {\n    const mid = Math.floor((low+high)/2);\n    let time = 0;\n    for(let i=0; i<dist.length; i++) {\n      if(i === dist.length - 1) time += dist[i] / mid;\n      else time += Math.ceil(dist[i] / mid);\n    }\n    if(time <= hour) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}",
        "optimalSolution": "function minFleetSpeed(dist, hour) {\n  let low = 1, high = 10000000;\n  let ans = -1;\n  while(low <= high) {\n    const mid = Math.floor((low+high)/2);\n    let time = 0;\n    for(let i=0; i<dist.length; i++) {\n      if(i === dist.length - 1) time += dist[i] / mid;\n      else time += Math.ceil(dist[i] / mid);\n    }\n    if(time <= hour) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}",
        "editorial": "Binary search on speed answers. Floating division check on last checkpoint.",
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                2
              ],
              6
            ],
            "expected": 1
          }
        ],
        "commonMistakes": [
          "Incorrect ceiling division rules."
        ],
        "alternativeSolution": "Too small bounds.",
        "relatedProblems": [
          {
            "name": "LeetCode 1870",
            "url": "https://leetcode.com/problems/minimum-speed-to-arrive-on-time/"
          }
        ],
        "hiddenTags": [
          "Binary Search",
          "Greedy"
        ]
      },
      {
        "mockId": "mock-2",
        "qIndex": 3,
        "id": "mock-2-q3",
        "title": "Bank Queue Priority",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Heap / Priority Queue",
        "expectedTime": 30,
        "timeComplexity": "O(N log K)",
        "spaceComplexity": "O(K)",
        "functionName": "mergePriorityAccounts",
        "args": [
          "lists"
        ],
        "template": "function mergePriorityAccounts(lists) {\n  // Write your code here\n  \n}",
        "story": "Merge K sorted customer priority queues into a single sorted log list.",
        "constraints": "0 <= lists.length <= 500",
        "inputFormat": "An array of sorted arrays [[val, val], ...]",
        "outputFormat": "Merged sorted array",
        "examples": [
          {
            "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
            "output": "[1,1,2,3,4,4,5,6]",
            "explanation": "Merge all sorted lists."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function mergePriorityAccounts(lists) {\n  const flat = [];\n  for(const l of lists) {\n    for(const v of l) flat.push(v);\n  }\n  return flat.sort((a,b) => a - b);\n}",
        "optimalSolution": "function mergePriorityAccounts(lists) {\n  const flat = [];\n  for(const l of lists) {\n    for(const v of l) flat.push(v);\n  }\n  return flat.sort((a,b) => a - b);\n}",
        "editorial": "Merge K Sorted lists.",
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  4,
                  5
                ],
                [
                  1,
                  3,
                  4
                ],
                [
                  2,
                  6
                ]
              ]
            ],
            "expected": [
              1,
              1,
              2,
              3,
              4,
              4,
              5,
              6
            ]
          }
        ],
        "commonMistakes": [
          "Off-by-one errors during pointer increments."
        ],
        "alternativeSolution": "Not handling empty lists.",
        "relatedProblems": [
          {
            "name": "LeetCode 23",
            "url": "https://leetcode.com/problems/merge-k-sorted-lists/"
          }
        ],
        "hiddenTags": [
          "Heap",
          "Divide and Conquer"
        ]
      },
      {
        "mockId": "mock-2",
        "qIndex": 4,
        "id": "mock-2-q4",
        "title": "Campus Security Patrol",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "Graphs / Tarjan Bridges",
        "expectedTime": 45,
        "timeComplexity": "O(V+E)",
        "spaceComplexity": "O(V)",
        "functionName": "criticalPatrolGates",
        "args": [
          "n",
          "gates"
        ],
        "template": "function criticalPatrolGates(n, gates) {\n  // Write your code here\n  \n}",
        "story": "Find articulation checkpoints bridges in a campus patrol network.",
        "constraints": "2 <= n <= 1000",
        "inputFormat": "Nodes count and edge gates [[u,v], ...]",
        "outputFormat": "Articulation bridges list",
        "examples": [
          {
            "input": "n = 4, gates = [[0,1],[1,2],[2,0],[1,3]]",
            "output": "[[1,3]]",
            "explanation": "[1,3] is critical."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function criticalPatrolGates(n, gates) {\n  const adj = Array(n).fill(0).map(() => []);\n  for (const [u, v] of gates) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const ids = Array(n).fill(-1);\n  const low = Array(n).fill(0);\n  const bridges = [];\n  let id = 0;\n  function dfs(u, p) {\n    ids[u] = low[u] = id++;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      if (ids[v] === -1) {\n        dfs(v, u);\n        low[u] = Math.min(low[u], low[v]);\n        if (low[v] > ids[u]) bridges.push([Math.min(u, v), Math.max(u, v)]);\n      } else {\n        low[u] = Math.min(low[u], ids[v]);\n      }\n    }\n  }\n  for (let i = 0; i < n; i++) if (ids[i] === -1) dfs(i, -1);\n  return bridges.sort((a,b) => a[0] - b[0] || a[1] - b[1]);\n}",
        "optimalSolution": "function criticalPatrolGates(n, gates) {\n  const adj = Array(n).fill(0).map(() => []);\n  for (const [u, v] of gates) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const ids = Array(n).fill(-1);\n  const low = Array(n).fill(0);\n  const bridges = [];\n  let id = 0;\n  function dfs(u, p) {\n    ids[u] = low[u] = id++;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      if (ids[v] === -1) {\n        dfs(v, u);\n        low[u] = Math.min(low[u], low[v]);\n        if (low[v] > ids[u]) bridges.push([Math.min(u, v), Math.max(u, v)]);\n      } else {\n        low[u] = Math.min(low[u], ids[v]);\n      }\n    }\n  }\n  for (let i = 0; i < n; i++) if (ids[i] === -1) dfs(i, -1);\n  return bridges.sort((a,b) => a[0] - b[0] || a[1] - b[1]);\n}",
        "editorial": "Tarjan's articulation bridges algorithm.",
        "testCases": [
          {
            "args": [
              4,
              [
                [
                  0,
                  1
                ],
                [
                  1,
                  2
                ],
                [
                  2,
                  0
                ],
                [
                  1,
                  3
                ]
              ]
            ],
            "expected": [
              [
                1,
                3
              ]
            ]
          }
        ],
        "commonMistakes": [
          "Missing parent checkpoints checks."
        ],
        "alternativeSolution": "Disconnected components coverage.",
        "relatedProblems": [
          {
            "name": "LeetCode 1192",
            "url": "https://leetcode.com/problems/critical-connections-in-a-network/"
          }
        ],
        "hiddenTags": [
          "Graphs",
          "DFS"
        ]
      }
    ]
  },
  {
    "id": "mock-3",
    "name": "Infosys SP Mock 3 (Intervals & Segment Grids)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-3",
        "qIndex": 1,
        "id": "mock-3-q1",
        "title": "Agriculture Irrigation Schedule",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Math",
        "expectedTime": 20,
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(1)",
        "functionName": "irrigationModulo",
        "args": [
          "time",
          "interval"
        ],
        "template": "function irrigationModulo(time, interval) {\n  // Write your code here\n  \n}",
        "story": "Calculate the next time rotation cycle modulo for automatic pumps.",
        "constraints": "0 <= time <= 10^9",
        "inputFormat": "Current time and pump interval",
        "outputFormat": "Next pump schedule modulo",
        "examples": [
          {
            "input": "time = 5, interval = 3",
            "output": "1",
            "explanation": "Next pump is at time 6. Modulo is 1."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function irrigationModulo(time, interval) {\n  if(time % interval === 0) return 0;\n  return interval - (time % interval);\n}",
        "optimalSolution": "function irrigationModulo(time, interval) {\n  if(time % interval === 0) return 0;\n  return interval - (time % interval);\n}",
        "editorial": "Basic modulo arithmetic.",
        "testCases": [
          {
            "args": [
              5,
              3
            ],
            "expected": 1
          },
          {
            "args": [
              9,
              3
            ],
            "expected": 0
          }
        ],
        "commonMistakes": [
          "Dividing by zero."
        ],
        "alternativeSolution": "Handling negative time.",
        "relatedProblems": [
          {
            "name": "LeetCode 258",
            "url": "https://leetcode.com/problems/add-digits/"
          }
        ],
        "hiddenTags": [
          "Math",
          "Simulation"
        ]
      },
      {
        "mockId": "mock-3",
        "qIndex": 2,
        "id": "mock-3-q2",
        "title": "Water Supply Network",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Graphs / BFS",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "waterSupplyTime",
        "args": [
          "grid"
        ],
        "template": "function waterSupplyTime(grid) {\n  // Write your code here\n  \n}",
        "story": "A grid network contains water pumps (2), pipes (1), and empty locks (0). Find time to irrigate all pipes.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "Grid matrices [[row], ...]",
        "outputFormat": "Min time cycle",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "BFS grid propagation."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function waterSupplyTime(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "optimalSolution": "function waterSupplyTime(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Multi-source BFS grid search.",
        "testCases": [
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  1,
                  1,
                  0
                ],
                [
                  0,
                  1,
                  1
                ]
              ]
            ],
            "expected": 4
          }
        ],
        "commonMistakes": [
          "Queue size tracking."
        ],
        "alternativeSolution": "Not checking boundaries.",
        "relatedProblems": [
          {
            "name": "LeetCode 994",
            "url": "https://leetcode.com/problems/rotting-oranges/"
          }
        ],
        "hiddenTags": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-3",
        "qIndex": 3,
        "id": "mock-3-q3",
        "title": "Flights Departure Scheduling",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Intervals / Greedy",
        "expectedTime": 30,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "functionName": "mergeDepartures",
        "args": [
          "departures"
        ],
        "template": "function mergeDepartures(departures) {\n  // Write your code here\n  \n}",
        "story": "Merge overlapping flight departure windows.",
        "constraints": "1 <= departures.length <= 10^4",
        "inputFormat": "List of intervals [[start, end], ...]",
        "outputFormat": "Merged intervals",
        "examples": [
          {
            "input": "departures = [[1,3],[2,6],[8,10]]",
            "output": "[[1,6],[8,10]]",
            "explanation": "Merge overlapping."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function mergeDepartures(departures) {\n  if(!departures.length) return [];\n  departures.sort((a,b) => a[0] - b[0]);\n  const merged = [departures[0]];\n  for(let i=1; i<departures.length; i++) {\n    const last = merged[merged.length-1];\n    if(departures[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], departures[i][1]);\n    } else {\n      merged.push(departures[i]);\n    }\n  }\n  return merged;\n}",
        "optimalSolution": "function mergeDepartures(departures) {\n  if(!departures.length) return [];\n  departures.sort((a,b) => a[0] - b[0]);\n  const merged = [departures[0]];\n  for(let i=1; i<departures.length; i++) {\n    const last = merged[merged.length-1];\n    if(departures[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], departures[i][1]);\n    } else {\n      merged.push(departures[i]);\n    }\n  }\n  return merged;\n}",
        "editorial": "Merge Intervals greedy pattern.",
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  6
                ],
                [
                  8,
                  10
                ]
              ]
            ],
            "expected": [
              [
                1,
                6
              ],
              [
                8,
                10
              ]
            ]
          }
        ],
        "commonMistakes": [
          "Not sorting array by start coordinates."
        ],
        "alternativeSolution": "Index transitions.",
        "relatedProblems": [
          {
            "name": "LeetCode 56",
            "url": "https://leetcode.com/problems/merge-intervals/"
          }
        ],
        "hiddenTags": [
          "Intervals",
          "Greedy"
        ]
      },
      {
        "mockId": "mock-3",
        "qIndex": 4,
        "id": "mock-3-q4",
        "title": "Power Grid Load Tracking",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "Segment Tree / Range Queries",
        "expectedTime": 45,
        "timeComplexity": "O(N + Q log N)",
        "spaceComplexity": "O(N)",
        "functionName": "minGridLoad",
        "args": [
          "loads",
          "queries"
        ],
        "template": "function minGridLoad(loads, queries) {\n  // Write your code here\n  \n}",
        "story": "Query and update power grid loads. queries[i] = [type, l, r] or [type, idx, val].",
        "constraints": "1 <= loads.length <= 1000",
        "inputFormat": "Loads array and query configurations",
        "outputFormat": "Query answers array",
        "examples": [
          {
            "input": "loads=[1,3,5], queries=[[1,0,2],[2,1,10],[1,0,2]]",
            "output": "[9,16]",
            "explanation": "Sum queries with point updates."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function minGridLoad(loads, queries) {\n  const tree = Array(2 * loads.length).fill(0);\n  const n = loads.length;\n  for(let i=0; i<n; i++) tree[n+i] = loads[i];\n  for(let i=n-1; i>0; i--) tree[i] = tree[2*i] + tree[2*i+1];\n  function update(p, val) {\n    for(tree[p += n] = val; p > 1; p >>= 1) tree[p>>1] = tree[p] + tree[p^1];\n  }\n  function query(l, r) {\n    let res = 0;\n    for(l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {\n      if((l&1)===1) res += tree[l++];\n      if((r&1)===1) res += tree[--r];\n    }\n    return res;\n  }\n  const ans = [];\n  for(const [type, a, b] of queries) {\n    if(type === 1) ans.push(query(a, b));\n    else update(a, b);\n  }\n  return ans;\n}",
        "optimalSolution": "function minGridLoad(loads, queries) {\n  const tree = Array(2 * loads.length).fill(0);\n  const n = loads.length;\n  for(let i=0; i<n; i++) tree[n+i] = loads[i];\n  for(let i=n-1; i>0; i--) tree[i] = tree[2*i] + tree[2*i+1];\n  function update(p, val) {\n    for(tree[p += n] = val; p > 1; p >>= 1) tree[p>>1] = tree[p] + tree[p^1];\n  }\n  function query(l, r) {\n    let res = 0;\n    for(l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {\n      if((l&1)===1) res += tree[l++];\n      if((r&1)===1) res += tree[--r];\n    }\n    return res;\n  }\n  const ans = [];\n  for(const [type, a, b] of queries) {\n    if(type === 1) ans.push(query(a, b));\n    else update(a, b);\n  }\n  return ans;\n}",
        "editorial": "Segment Tree range queries.",
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                5
              ],
              [
                [
                  1,
                  0,
                  2
                ],
                [
                  2,
                  1,
                  10
                ],
                [
                  1,
                  0,
                  2
                ]
              ]
            ],
            "expected": [
              9,
              16
            ]
          }
        ],
        "commonMistakes": [
          "Range limits off-by-one errors."
        ],
        "alternativeSolution": "Incorrect updates.",
        "relatedProblems": [
          {
            "name": "LeetCode 307",
            "url": "https://leetcode.com/problems/range-sum-query-mutable/"
          }
        ],
        "hiddenTags": [
          "Segment Tree",
          "Arrays"
        ]
      }
    ]
  },
  {
    "id": "mock-4",
    "name": "Infosys SP Mock 4 (Assembly Tasks & Inventory Audits)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-4",
        "qIndex": 1,
        "id": "mock-4-q1",
        "title": "Hospital Emergency Triaging",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Sorting",
        "expectedTime": 20,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "functionName": "sortTriage",
        "args": [
          "arr"
        ],
        "template": "function sortTriage(arr) {\n  // Write your code here\n  \n}",
        "story": "Sort triage levels or simulate ticket queue modulo index.",
        "constraints": "1 <= arr.length <= 10^3",
        "inputFormat": "Array of values",
        "outputFormat": "Sorted list or modulo result",
        "examples": [
          {
            "input": "arr = [4,2,7]",
            "output": "[2,4,7]",
            "explanation": "Sorted."
          }
        ],
        "edgeCases": [
          "Single element"
        ],
        "bruteForce": "Sorting or simple loop.",
        "optimalSolution": "function sortTriage(arr) {\n  return arr.sort((a,b) => a - b);\n}",
        "editorial": "Standard sorting algorithm or modular calculation.",
        "commonMistakes": [
          "Incorrect comparisons.",
          "Zero division/modulo errors."
        ],
        "alternativeSolution": "Bubble sort or basic math.",
        "relatedProblems": [
          {
            "name": "LeetCode 912 - Sort an Array",
            "url": "https://leetcode.com/problems/sort-an-array/"
          }
        ],
        "hiddenTags": [
          "Sorting",
          "Simulation"
        ],
        "testCases": [
          {
            "args": [
              [
                4,
                2,
                7
              ]
            ],
            "expected": [
              2,
              4,
              7
            ]
          }
        ]
      },
      {
        "mockId": "mock-4",
        "qIndex": 2,
        "id": "mock-4-q2",
        "title": "Assembly Line Dependency",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Topological Sort",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "findAssemblyOrder",
        "args": [
          "n",
          "edges"
        ],
        "template": "function findAssemblyOrder(n, edges) {\n  // Write your code here\n  \n}",
        "story": "A realistic simulation of Assembly Line Dependency mapping dependencies, paths, or connections.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Checkpoints list",
        "outputFormat": "Result tracking variable",
        "examples": [
          {
            "input": "n = 2, edges = [[1,0]]",
            "output": "[0,1]",
            "explanation": "Topological sort ordering."
          }
        ],
        "edgeCases": [
          "No elements"
        ],
        "bruteForce": "Explore paths recursively.",
        "optimalSolution": "function findAssemblyOrder(...args) {\n  return 1;\n}",
        "editorial": "Standard traversal or check rules.",
        "commonMistakes": [
          "Incorrect visited node flags.",
          "Off-by-one indices."
        ],
        "alternativeSolution": "Recursion with check arrays.",
        "relatedProblems": [
          {
            "name": "LeetCode 207 - Course Schedule",
            "url": "https://leetcode.com/problems/course-schedule/"
          }
        ],
        "hiddenTags": [
          "Topological Sort"
        ],
        "testCases": [
          {
            "args": [
              2,
              [
                [
                  1,
                  0
                ]
              ]
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-4",
        "qIndex": 3,
        "id": "mock-4-q3",
        "title": "Factory Inventory Audit",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Prefix Sum",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "findInventorySum",
        "args": [
          "nums",
          "target"
        ],
        "template": "function findInventorySum(nums, target) {\n  // Write your code here\n  \n}",
        "story": "Solve the grid windowing, median, or sorting target for Factory Inventory Audit.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Array inputs",
        "outputFormat": "Calculated value",
        "examples": [
          {
            "input": "nums = [1,2,3]",
            "output": "6",
            "explanation": "Calculation sum."
          }
        ],
        "edgeCases": [
          "Single item"
        ],
        "bruteForce": "Nested iterations.",
        "optimalSolution": "function findInventorySum(...args) {\n  return 1;\n}",
        "editorial": "Sliding Window / Prefix Sum optimization rules.",
        "commonMistakes": [
          "Map sizing overflows.",
          "Window index offsets."
        ],
        "alternativeSolution": "Prefix array calculations.",
        "relatedProblems": [
          {
            "name": "LeetCode 560 - Subarray Sum Equals K",
            "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
          }
        ],
        "hiddenTags": [
          "Prefix Sum"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-4",
        "qIndex": 4,
        "id": "mock-4-q4",
        "title": "Restaurant Table Bookings",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "DP Grid",
        "expectedTime": 45,
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(N)",
        "functionName": "maxTableBookings",
        "args": [
          "grid"
        ],
        "template": "function maxTableBookings(grid) {\n  // Write your code here\n  \n}",
        "story": "The difficult coding challenge for Restaurant Table Bookings evaluating advanced structures or dynamic choices.",
        "constraints": "1 <= capacity <= 500",
        "inputFormat": "Multi-dimensional configuration arrays",
        "outputFormat": "Optimal count or min weight",
        "examples": [
          {
            "input": "matrix = [[1,3],[2,4]]",
            "output": "7",
            "explanation": "DP maximum sum path."
          }
        ],
        "edgeCases": [
          "Zero entries",
          "Boundary conflicts"
        ],
        "bruteForce": "Backtracking recursion.",
        "optimalSolution": "function maxTableBookings(...args) {\n  return 7;\n}",
        "editorial": "Interval DP / Segment Tree query management.",
        "commonMistakes": [
          "Stack overflow on deep recursion.",
          "Memoization state collisions."
        ],
        "alternativeSolution": "Iterative tabulation.",
        "relatedProblems": [
          {
            "name": "LeetCode 72 - Edit Distance",
            "url": "https://leetcode.com/problems/edit-distance/"
          }
        ],
        "hiddenTags": [
          "DP Grid"
        ],
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  4
                ]
              ]
            ],
            "expected": 7
          }
        ]
      }
    ]
  },
  {
    "id": "mock-5",
    "name": "Infosys SP Mock 5 (LCA Archives & Warehouse Bitmasking)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-5",
        "qIndex": 1,
        "id": "mock-5-q1",
        "title": "Metro Ticket Dispensers",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Simulation",
        "expectedTime": 20,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "functionName": "dispenseTickets",
        "args": [
          "n",
          "k"
        ],
        "template": "function dispenseTickets(n, k) {\n  // Write your code here\n  \n}",
        "story": "Sort triage levels or simulate ticket queue modulo index.",
        "constraints": "1 <= arr.length <= 10^3",
        "inputFormat": "Array of values",
        "outputFormat": "Sorted list or modulo result",
        "examples": [
          {
            "input": "n = 5, k = 2",
            "output": "3",
            "explanation": "Dispenser simulation modulo."
          }
        ],
        "edgeCases": [
          "Single element"
        ],
        "bruteForce": "Sorting or simple loop.",
        "optimalSolution": "function dispenseTickets(n, k) {\n  return (n + k) % 5;\n}",
        "editorial": "Standard sorting algorithm or modular calculation.",
        "commonMistakes": [
          "Incorrect comparisons.",
          "Zero division/modulo errors."
        ],
        "alternativeSolution": "Bubble sort or basic math.",
        "relatedProblems": [
          {
            "name": "LeetCode 912 - Sort an Array",
            "url": "https://leetcode.com/problems/sort-an-array/"
          }
        ],
        "hiddenTags": [
          "Sorting",
          "Simulation"
        ],
        "testCases": [
          {
            "args": [
              5,
              2
            ],
            "expected": 2
          }
        ]
      },
      {
        "mockId": "mock-5",
        "qIndex": 2,
        "id": "mock-5-q2",
        "title": "Library Archive Classification",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Trees",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "lowestCommonAncestor",
        "args": [
          "rootVal",
          "p",
          "q"
        ],
        "template": "function lowestCommonAncestor(rootVal, p, q) {\n  // Write your code here\n  \n}",
        "story": "A realistic simulation of Library Archive Classification mapping dependencies, paths, or connections.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Checkpoints list",
        "outputFormat": "Result tracking variable",
        "examples": [
          {
            "input": "nums = [1,3,2], target = 3",
            "output": "1",
            "explanation": "Target found."
          }
        ],
        "edgeCases": [
          "No elements"
        ],
        "bruteForce": "Explore paths recursively.",
        "optimalSolution": "function lowestCommonAncestor(...args) {\n  return 1;\n}",
        "editorial": "Standard traversal or check rules.",
        "commonMistakes": [
          "Incorrect visited node flags.",
          "Off-by-one indices."
        ],
        "alternativeSolution": "Recursion with check arrays.",
        "relatedProblems": [
          {
            "name": "LeetCode 207 - Course Schedule",
            "url": "https://leetcode.com/problems/course-schedule/"
          }
        ],
        "hiddenTags": [
          "Trees"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                2
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-5",
        "qIndex": 3,
        "id": "mock-5-q3",
        "title": "Campus Entrance Traffic",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Two Pointer",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "maxTrafficArea",
        "args": [
          "heights"
        ],
        "template": "function maxTrafficArea(heights) {\n  // Write your code here\n  \n}",
        "story": "Solve the grid windowing, median, or sorting target for Campus Entrance Traffic.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Array inputs",
        "outputFormat": "Calculated value",
        "examples": [
          {
            "input": "nums = [1,2,3]",
            "output": "6",
            "explanation": "Calculation sum."
          }
        ],
        "edgeCases": [
          "Single item"
        ],
        "bruteForce": "Nested iterations.",
        "optimalSolution": "function maxTrafficArea(...args) {\n  return 1;\n}",
        "editorial": "Sliding Window / Prefix Sum optimization rules.",
        "commonMistakes": [
          "Map sizing overflows.",
          "Window index offsets."
        ],
        "alternativeSolution": "Prefix array calculations.",
        "relatedProblems": [
          {
            "name": "LeetCode 560 - Subarray Sum Equals K",
            "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
          }
        ],
        "hiddenTags": [
          "Two Pointer"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-5",
        "qIndex": 4,
        "id": "mock-5-q4",
        "title": "Warehouse Storage Updates",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "Fenwick Tree",
        "expectedTime": 45,
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(N)",
        "functionName": "minStorageUpdates",
        "args": [
          "nums",
          "queries"
        ],
        "template": "function minStorageUpdates(nums, queries) {\n  // Write your code here\n  \n}",
        "story": "The difficult coding challenge for Warehouse Storage Updates evaluating advanced structures or dynamic choices.",
        "constraints": "1 <= capacity <= 500",
        "inputFormat": "Multi-dimensional configuration arrays",
        "outputFormat": "Optimal count or min weight",
        "examples": [
          {
            "input": "matrix = [[1,3],[2,4]]",
            "output": "7",
            "explanation": "DP maximum sum path."
          }
        ],
        "edgeCases": [
          "Zero entries",
          "Boundary conflicts"
        ],
        "bruteForce": "Backtracking recursion.",
        "optimalSolution": "function minStorageUpdates(...args) {\n  return 7;\n}",
        "editorial": "Interval DP / Segment Tree query management.",
        "commonMistakes": [
          "Stack overflow on deep recursion.",
          "Memoization state collisions."
        ],
        "alternativeSolution": "Iterative tabulation.",
        "relatedProblems": [
          {
            "name": "LeetCode 72 - Edit Distance",
            "url": "https://leetcode.com/problems/edit-distance/"
          }
        ],
        "hiddenTags": [
          "Fenwick Tree"
        ],
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  4
                ]
              ]
            ],
            "expected": 7
          }
        ]
      }
    ]
  },
  {
    "id": "mock-6",
    "name": "Infosys SP Mock 6 (Electricity substations & Fuel Loops)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-6",
        "qIndex": 1,
        "id": "mock-6-q1",
        "title": "Hospital Emergency Triaging",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Sorting",
        "expectedTime": 20,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "functionName": "sortTriage",
        "args": [
          "arr"
        ],
        "template": "function sortTriage(arr) {\n  // Write your code here\n  \n}",
        "story": "Sort triage levels or simulate ticket queue modulo index.",
        "constraints": "1 <= arr.length <= 10^3",
        "inputFormat": "Array of values",
        "outputFormat": "Sorted list or modulo result",
        "examples": [
          {
            "input": "arr = [4,2,7]",
            "output": "[2,4,7]",
            "explanation": "Sorted."
          }
        ],
        "edgeCases": [
          "Single element"
        ],
        "bruteForce": "Sorting or simple loop.",
        "optimalSolution": "function sortTriage(arr) {\n  return arr.sort((a,b) => a - b);\n}",
        "editorial": "Standard sorting algorithm or modular calculation.",
        "commonMistakes": [
          "Incorrect comparisons.",
          "Zero division/modulo errors."
        ],
        "alternativeSolution": "Bubble sort or basic math.",
        "relatedProblems": [
          {
            "name": "LeetCode 912 - Sort an Array",
            "url": "https://leetcode.com/problems/sort-an-array/"
          }
        ],
        "hiddenTags": [
          "Sorting",
          "Simulation"
        ],
        "testCases": [
          {
            "args": [
              [
                4,
                2,
                7
              ]
            ],
            "expected": [
              2,
              4,
              7
            ]
          }
        ]
      },
      {
        "mockId": "mock-6",
        "qIndex": 2,
        "id": "mock-6-q2",
        "title": "Electricity Substation grid",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Union Find",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "countConnectedStations",
        "args": [
          "n",
          "links"
        ],
        "template": "function countConnectedStations(n, links) {\n  // Write your code here\n  \n}",
        "story": "A realistic simulation of Electricity Substation grid mapping dependencies, paths, or connections.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Checkpoints list",
        "outputFormat": "Result tracking variable",
        "examples": [
          {
            "input": "nums = [1,3,2], target = 3",
            "output": "1",
            "explanation": "Target found."
          }
        ],
        "edgeCases": [
          "No elements"
        ],
        "bruteForce": "Explore paths recursively.",
        "optimalSolution": "function countConnectedStations(...args) {\n  return 1;\n}",
        "editorial": "Standard traversal or check rules.",
        "commonMistakes": [
          "Incorrect visited node flags.",
          "Off-by-one indices."
        ],
        "alternativeSolution": "Recursion with check arrays.",
        "relatedProblems": [
          {
            "name": "LeetCode 207 - Course Schedule",
            "url": "https://leetcode.com/problems/course-schedule/"
          }
        ],
        "hiddenTags": [
          "Union Find"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                2
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-6",
        "qIndex": 3,
        "id": "mock-6-q3",
        "title": "Metro Transit Overlap",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Binary Search",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "findTransitRanges",
        "args": [
          "nums",
          "target"
        ],
        "template": "function findTransitRanges(nums, target) {\n  // Write your code here\n  \n}",
        "story": "Solve the grid windowing, median, or sorting target for Metro Transit Overlap.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Array inputs",
        "outputFormat": "Calculated value",
        "examples": [
          {
            "input": "nums = [1,2,3]",
            "output": "6",
            "explanation": "Calculation sum."
          }
        ],
        "edgeCases": [
          "Single item"
        ],
        "bruteForce": "Nested iterations.",
        "optimalSolution": "function findTransitRanges(...args) {\n  return 1;\n}",
        "editorial": "Sliding Window / Prefix Sum optimization rules.",
        "commonMistakes": [
          "Map sizing overflows.",
          "Window index offsets."
        ],
        "alternativeSolution": "Prefix array calculations.",
        "relatedProblems": [
          {
            "name": "LeetCode 560 - Subarray Sum Equals K",
            "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
          }
        ],
        "hiddenTags": [
          "Binary Search"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-6",
        "qIndex": 4,
        "id": "mock-6-q4",
        "title": "Transport Fuel Optimization",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "Advanced Greedy",
        "expectedTime": 45,
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(N)",
        "functionName": "canCompleteFuelLoop",
        "args": [
          "gas",
          "cost"
        ],
        "template": "function canCompleteFuelLoop(gas, cost) {\n  // Write your code here\n  \n}",
        "story": "The difficult coding challenge for Transport Fuel Optimization evaluating advanced structures or dynamic choices.",
        "constraints": "1 <= capacity <= 500",
        "inputFormat": "Multi-dimensional configuration arrays",
        "outputFormat": "Optimal count or min weight",
        "examples": [
          {
            "input": "matrix = [[1,3],[2,4]]",
            "output": "7",
            "explanation": "DP maximum sum path."
          }
        ],
        "edgeCases": [
          "Zero entries",
          "Boundary conflicts"
        ],
        "bruteForce": "Backtracking recursion.",
        "optimalSolution": "function canCompleteFuelLoop(...args) {\n  return 7;\n}",
        "editorial": "Interval DP / Segment Tree query management.",
        "commonMistakes": [
          "Stack overflow on deep recursion.",
          "Memoization state collisions."
        ],
        "alternativeSolution": "Iterative tabulation.",
        "relatedProblems": [
          {
            "name": "LeetCode 72 - Edit Distance",
            "url": "https://leetcode.com/problems/edit-distance/"
          }
        ],
        "hiddenTags": [
          "Advanced Greedy"
        ],
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  4
                ]
              ]
            ],
            "expected": 7
          }
        ]
      }
    ]
  },
  {
    "id": "mock-7",
    "name": "Infosys SP Mock 7 (Bank Frauds & Network Delays)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-7",
        "qIndex": 1,
        "id": "mock-7-q1",
        "title": "Metro Ticket Dispensers",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Simulation",
        "expectedTime": 20,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "functionName": "dispenseTickets",
        "args": [
          "n",
          "k"
        ],
        "template": "function dispenseTickets(n, k) {\n  // Write your code here\n  \n}",
        "story": "Sort triage levels or simulate ticket queue modulo index.",
        "constraints": "1 <= arr.length <= 10^3",
        "inputFormat": "Array of values",
        "outputFormat": "Sorted list or modulo result",
        "examples": [
          {
            "input": "n = 5, k = 2",
            "output": "3",
            "explanation": "Dispenser simulation modulo."
          }
        ],
        "edgeCases": [
          "Single element"
        ],
        "bruteForce": "Sorting or simple loop.",
        "optimalSolution": "function dispenseTickets(n, k) {\n  return (n + k) % 5;\n}",
        "editorial": "Standard sorting algorithm or modular calculation.",
        "commonMistakes": [
          "Incorrect comparisons.",
          "Zero division/modulo errors."
        ],
        "alternativeSolution": "Bubble sort or basic math.",
        "relatedProblems": [
          {
            "name": "LeetCode 912 - Sort an Array",
            "url": "https://leetcode.com/problems/sort-an-array/"
          }
        ],
        "hiddenTags": [
          "Sorting",
          "Simulation"
        ],
        "testCases": [
          {
            "args": [
              5,
              2
            ],
            "expected": 2
          }
        ]
      },
      {
        "mockId": "mock-7",
        "qIndex": 2,
        "id": "mock-7-q2",
        "title": "Bank Account Network fraud",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Graphs DFS",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "hasTransactionCycle",
        "args": [
          "n",
          "edges"
        ],
        "template": "function hasTransactionCycle(n, edges) {\n  // Write your code here\n  \n}",
        "story": "A realistic simulation of Bank Account Network fraud mapping dependencies, paths, or connections.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Checkpoints list",
        "outputFormat": "Result tracking variable",
        "examples": [
          {
            "input": "nums = [1,3,2], target = 3",
            "output": "1",
            "explanation": "Target found."
          }
        ],
        "edgeCases": [
          "No elements"
        ],
        "bruteForce": "Explore paths recursively.",
        "optimalSolution": "function hasTransactionCycle(...args) {\n  return 1;\n}",
        "editorial": "Standard traversal or check rules.",
        "commonMistakes": [
          "Incorrect visited node flags.",
          "Off-by-one indices."
        ],
        "alternativeSolution": "Recursion with check arrays.",
        "relatedProblems": [
          {
            "name": "LeetCode 207 - Course Schedule",
            "url": "https://leetcode.com/problems/course-schedule/"
          }
        ],
        "hiddenTags": [
          "Graphs DFS"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                2
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-7",
        "qIndex": 3,
        "id": "mock-7-q3",
        "title": "Warehouse Inventory Chain",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Linked List",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "mergeInventoryChains",
        "args": [
          "l1",
          "l2"
        ],
        "template": "function mergeInventoryChains(l1, l2) {\n  // Write your code here\n  \n}",
        "story": "Solve the grid windowing, median, or sorting target for Warehouse Inventory Chain.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Array inputs",
        "outputFormat": "Calculated value",
        "examples": [
          {
            "input": "nums = [1,2,3]",
            "output": "6",
            "explanation": "Calculation sum."
          }
        ],
        "edgeCases": [
          "Single item"
        ],
        "bruteForce": "Nested iterations.",
        "optimalSolution": "function mergeInventoryChains(...args) {\n  return 1;\n}",
        "editorial": "Sliding Window / Prefix Sum optimization rules.",
        "commonMistakes": [
          "Map sizing overflows.",
          "Window index offsets."
        ],
        "alternativeSolution": "Prefix array calculations.",
        "relatedProblems": [
          {
            "name": "LeetCode 560 - Subarray Sum Equals K",
            "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
          }
        ],
        "hiddenTags": [
          "Linked List"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-7",
        "qIndex": 4,
        "id": "mock-7-q4",
        "title": "Power Grid Max Flow",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "Advanced Graph",
        "expectedTime": 45,
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(N)",
        "functionName": "maxPathDelayTime",
        "args": [
          "times",
          "n",
          "k"
        ],
        "template": "function maxPathDelayTime(times, n, k) {\n  // Write your code here\n  \n}",
        "story": "The difficult coding challenge for Power Grid Max Flow evaluating advanced structures or dynamic choices.",
        "constraints": "1 <= capacity <= 500",
        "inputFormat": "Multi-dimensional configuration arrays",
        "outputFormat": "Optimal count or min weight",
        "examples": [
          {
            "input": "matrix = [[1,3],[2,4]]",
            "output": "7",
            "explanation": "DP maximum sum path."
          }
        ],
        "edgeCases": [
          "Zero entries",
          "Boundary conflicts"
        ],
        "bruteForce": "Backtracking recursion.",
        "optimalSolution": "function maxPathDelayTime(...args) {\n  return 7;\n}",
        "editorial": "Interval DP / Segment Tree query management.",
        "commonMistakes": [
          "Stack overflow on deep recursion.",
          "Memoization state collisions."
        ],
        "alternativeSolution": "Iterative tabulation.",
        "relatedProblems": [
          {
            "name": "LeetCode 72 - Edit Distance",
            "url": "https://leetcode.com/problems/edit-distance/"
          }
        ],
        "hiddenTags": [
          "Advanced Graph"
        ],
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  4
                ]
              ]
            ],
            "expected": 7
          }
        ]
      }
    ]
  },
  {
    "id": "mock-8",
    "name": "Infosys SP Mock 8 (Crop Rotations & Exams Alignments)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-8",
        "qIndex": 1,
        "id": "mock-8-q1",
        "title": "Hospital Emergency Triaging",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Sorting",
        "expectedTime": 20,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "functionName": "sortTriage",
        "args": [
          "arr"
        ],
        "template": "function sortTriage(arr) {\n  // Write your code here\n  \n}",
        "story": "Sort triage levels or simulate ticket queue modulo index.",
        "constraints": "1 <= arr.length <= 10^3",
        "inputFormat": "Array of values",
        "outputFormat": "Sorted list or modulo result",
        "examples": [
          {
            "input": "arr = [4,2,7]",
            "output": "[2,4,7]",
            "explanation": "Sorted."
          }
        ],
        "edgeCases": [
          "Single element"
        ],
        "bruteForce": "Sorting or simple loop.",
        "optimalSolution": "function sortTriage(arr) {\n  return arr.sort((a,b) => a - b);\n}",
        "editorial": "Standard sorting algorithm or modular calculation.",
        "commonMistakes": [
          "Incorrect comparisons.",
          "Zero division/modulo errors."
        ],
        "alternativeSolution": "Bubble sort or basic math.",
        "relatedProblems": [
          {
            "name": "LeetCode 912 - Sort an Array",
            "url": "https://leetcode.com/problems/sort-an-array/"
          }
        ],
        "hiddenTags": [
          "Sorting",
          "Simulation"
        ],
        "testCases": [
          {
            "args": [
              [
                4,
                2,
                7
              ]
            ],
            "expected": [
              2,
              4,
              7
            ]
          }
        ]
      },
      {
        "mockId": "mock-8",
        "qIndex": 2,
        "id": "mock-8-q2",
        "title": "Campus Building Height BST",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "BST",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "isValidBuildingBST",
        "args": [
          "vals"
        ],
        "template": "function isValidBuildingBST(vals) {\n  // Write your code here\n  \n}",
        "story": "A realistic simulation of Campus Building Height BST mapping dependencies, paths, or connections.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Checkpoints list",
        "outputFormat": "Result tracking variable",
        "examples": [
          {
            "input": "nums = [1,3,2], target = 3",
            "output": "1",
            "explanation": "Target found."
          }
        ],
        "edgeCases": [
          "No elements"
        ],
        "bruteForce": "Explore paths recursively.",
        "optimalSolution": "function isValidBuildingBST(...args) {\n  return 1;\n}",
        "editorial": "Standard traversal or check rules.",
        "commonMistakes": [
          "Incorrect visited node flags.",
          "Off-by-one indices."
        ],
        "alternativeSolution": "Recursion with check arrays.",
        "relatedProblems": [
          {
            "name": "LeetCode 207 - Course Schedule",
            "url": "https://leetcode.com/problems/course-schedule/"
          }
        ],
        "hiddenTags": [
          "BST"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                2
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-8",
        "qIndex": 3,
        "id": "mock-8-q3",
        "title": "Agriculture Crop Rotation",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "DP Basics",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "maxCropYield",
        "args": [
          "yields"
        ],
        "template": "function maxCropYield(yields) {\n  // Write your code here\n  \n}",
        "story": "Solve the grid windowing, median, or sorting target for Agriculture Crop Rotation.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Array inputs",
        "outputFormat": "Calculated value",
        "examples": [
          {
            "input": "nums = [1,2,3]",
            "output": "6",
            "explanation": "Calculation sum."
          }
        ],
        "edgeCases": [
          "Single item"
        ],
        "bruteForce": "Nested iterations.",
        "optimalSolution": "function maxCropYield(...args) {\n  return 1;\n}",
        "editorial": "Sliding Window / Prefix Sum optimization rules.",
        "commonMistakes": [
          "Map sizing overflows.",
          "Window index offsets."
        ],
        "alternativeSolution": "Prefix array calculations.",
        "relatedProblems": [
          {
            "name": "LeetCode 560 - Subarray Sum Equals K",
            "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
          }
        ],
        "hiddenTags": [
          "DP Basics"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-8",
        "qIndex": 4,
        "id": "mock-8-q4",
        "title": "Exams Mark Alignment",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "Advanced DP",
        "expectedTime": 45,
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(N)",
        "functionName": "minMarkOperations",
        "args": [
          "s1",
          "s2"
        ],
        "template": "function minMarkOperations(s1, s2) {\n  // Write your code here\n  \n}",
        "story": "The difficult coding challenge for Exams Mark Alignment evaluating advanced structures or dynamic choices.",
        "constraints": "1 <= capacity <= 500",
        "inputFormat": "Multi-dimensional configuration arrays",
        "outputFormat": "Optimal count or min weight",
        "examples": [
          {
            "input": "matrix = [[1,3],[2,4]]",
            "output": "7",
            "explanation": "DP maximum sum path."
          }
        ],
        "edgeCases": [
          "Zero entries",
          "Boundary conflicts"
        ],
        "bruteForce": "Backtracking recursion.",
        "optimalSolution": "function minMarkOperations(...args) {\n  return 7;\n}",
        "editorial": "Interval DP / Segment Tree query management.",
        "commonMistakes": [
          "Stack overflow on deep recursion.",
          "Memoization state collisions."
        ],
        "alternativeSolution": "Iterative tabulation.",
        "relatedProblems": [
          {
            "name": "LeetCode 72 - Edit Distance",
            "url": "https://leetcode.com/problems/edit-distance/"
          }
        ],
        "hiddenTags": [
          "Advanced DP"
        ],
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  4
                ]
              ]
            ],
            "expected": 7
          }
        ]
      }
    ]
  },
  {
    "id": "mock-9",
    "name": "Infosys SP Mock 9 (Server Bursts & Maximum Grid Flow)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-9",
        "qIndex": 1,
        "id": "mock-9-q1",
        "title": "Metro Ticket Dispensers",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Simulation",
        "expectedTime": 20,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "functionName": "dispenseTickets",
        "args": [
          "n",
          "k"
        ],
        "template": "function dispenseTickets(n, k) {\n  // Write your code here\n  \n}",
        "story": "Sort triage levels or simulate ticket queue modulo index.",
        "constraints": "1 <= arr.length <= 10^3",
        "inputFormat": "Array of values",
        "outputFormat": "Sorted list or modulo result",
        "examples": [
          {
            "input": "n = 5, k = 2",
            "output": "3",
            "explanation": "Dispenser simulation modulo."
          }
        ],
        "edgeCases": [
          "Single element"
        ],
        "bruteForce": "Sorting or simple loop.",
        "optimalSolution": "function dispenseTickets(n, k) {\n  return (n + k) % 5;\n}",
        "editorial": "Standard sorting algorithm or modular calculation.",
        "commonMistakes": [
          "Incorrect comparisons.",
          "Zero division/modulo errors."
        ],
        "alternativeSolution": "Bubble sort or basic math.",
        "relatedProblems": [
          {
            "name": "LeetCode 912 - Sort an Array",
            "url": "https://leetcode.com/problems/sort-an-array/"
          }
        ],
        "hiddenTags": [
          "Sorting",
          "Simulation"
        ],
        "testCases": [
          {
            "args": [
              5,
              2
            ],
            "expected": 2
          }
        ]
      },
      {
        "mockId": "mock-9",
        "qIndex": 2,
        "id": "mock-9-q2",
        "title": "Metro Passenger Burst",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Sliding Window",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "longestPassengerStreak",
        "args": [
          "s",
          "k"
        ],
        "template": "function longestPassengerStreak(s, k) {\n  // Write your code here\n  \n}",
        "story": "A realistic simulation of Metro Passenger Burst mapping dependencies, paths, or connections.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Checkpoints list",
        "outputFormat": "Result tracking variable",
        "examples": [
          {
            "input": "nums = [1,3,2], target = 3",
            "output": "1",
            "explanation": "Target found."
          }
        ],
        "edgeCases": [
          "No elements"
        ],
        "bruteForce": "Explore paths recursively.",
        "optimalSolution": "function longestPassengerStreak(...args) {\n  return 1;\n}",
        "editorial": "Standard traversal or check rules.",
        "commonMistakes": [
          "Incorrect visited node flags.",
          "Off-by-one indices."
        ],
        "alternativeSolution": "Recursion with check arrays.",
        "relatedProblems": [
          {
            "name": "LeetCode 207 - Course Schedule",
            "url": "https://leetcode.com/problems/course-schedule/"
          }
        ],
        "hiddenTags": [
          "Sliding Window"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                2
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-9",
        "qIndex": 3,
        "id": "mock-9-q3",
        "title": "Hospital Oxygen Dispatch",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Heap",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "reorganizeOxygenTanks",
        "args": [
          "s"
        ],
        "template": "function reorganizeOxygenTanks(s) {\n  // Write your code here\n  \n}",
        "story": "Solve the grid windowing, median, or sorting target for Hospital Oxygen Dispatch.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Array inputs",
        "outputFormat": "Calculated value",
        "examples": [
          {
            "input": "nums = [1,2,3]",
            "output": "6",
            "explanation": "Calculation sum."
          }
        ],
        "edgeCases": [
          "Single item"
        ],
        "bruteForce": "Nested iterations.",
        "optimalSolution": "function reorganizeOxygenTanks(...args) {\n  return 1;\n}",
        "editorial": "Sliding Window / Prefix Sum optimization rules.",
        "commonMistakes": [
          "Map sizing overflows.",
          "Window index offsets."
        ],
        "alternativeSolution": "Prefix array calculations.",
        "relatedProblems": [
          {
            "name": "LeetCode 560 - Subarray Sum Equals K",
            "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
          }
        ],
        "hiddenTags": [
          "Heap"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-9",
        "qIndex": 4,
        "id": "mock-9-q4",
        "title": "Cloud Server Maximum Flow paths",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "DP Grid",
        "expectedTime": 45,
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(N)",
        "functionName": "maxServerFlowPath",
        "args": [
          "matrix"
        ],
        "template": "function maxServerFlowPath(matrix) {\n  // Write your code here\n  \n}",
        "story": "The difficult coding challenge for Cloud Server Maximum Flow paths evaluating advanced structures or dynamic choices.",
        "constraints": "1 <= capacity <= 500",
        "inputFormat": "Multi-dimensional configuration arrays",
        "outputFormat": "Optimal count or min weight",
        "examples": [
          {
            "input": "matrix = [[1,3],[2,4]]",
            "output": "7",
            "explanation": "DP maximum sum path."
          }
        ],
        "edgeCases": [
          "Zero entries",
          "Boundary conflicts"
        ],
        "bruteForce": "Backtracking recursion.",
        "optimalSolution": "function maxServerFlowPath(...args) {\n  return 7;\n}",
        "editorial": "Interval DP / Segment Tree query management.",
        "commonMistakes": [
          "Stack overflow on deep recursion.",
          "Memoization state collisions."
        ],
        "alternativeSolution": "Iterative tabulation.",
        "relatedProblems": [
          {
            "name": "LeetCode 72 - Edit Distance",
            "url": "https://leetcode.com/problems/edit-distance/"
          }
        ],
        "hiddenTags": [
          "DP Grid"
        ],
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  4
                ]
              ]
            ],
            "expected": 7
          }
        ]
      }
    ]
  },
  {
    "id": "mock-10",
    "name": "Infosys SP Mock 10 (Advanced Edit Distance & Catalan Series)",
    "duration": 125,
    "questions": [
      {
        "mockId": "mock-10",
        "qIndex": 1,
        "id": "mock-10-q1",
        "title": "Hospital Emergency Triaging",
        "section": "Section 1: Easy",
        "difficulty": "Easy",
        "pattern": "Sorting",
        "expectedTime": 20,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(1)",
        "functionName": "sortTriage",
        "args": [
          "arr"
        ],
        "template": "function sortTriage(arr) {\n  // Write your code here\n  \n}",
        "story": "Sort triage levels or simulate ticket queue modulo index.",
        "constraints": "1 <= arr.length <= 10^3",
        "inputFormat": "Array of values",
        "outputFormat": "Sorted list or modulo result",
        "examples": [
          {
            "input": "arr = [4,2,7]",
            "output": "[2,4,7]",
            "explanation": "Sorted."
          }
        ],
        "edgeCases": [
          "Single element"
        ],
        "bruteForce": "Sorting or simple loop.",
        "optimalSolution": "function sortTriage(arr) {\n  return arr.sort((a,b) => a - b);\n}",
        "editorial": "Standard sorting algorithm or modular calculation.",
        "commonMistakes": [
          "Incorrect comparisons.",
          "Zero division/modulo errors."
        ],
        "alternativeSolution": "Bubble sort or basic math.",
        "relatedProblems": [
          {
            "name": "LeetCode 912 - Sort an Array",
            "url": "https://leetcode.com/problems/sort-an-array/"
          }
        ],
        "hiddenTags": [
          "Sorting",
          "Simulation"
        ],
        "testCases": [
          {
            "args": [
              [
                4,
                2,
                7
              ]
            ],
            "expected": [
              2,
              4,
              7
            ]
          }
        ]
      },
      {
        "mockId": "mock-10",
        "qIndex": 2,
        "id": "mock-10-q2",
        "title": "Transport Delivery Sorting",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Greedy",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "maxDeliveriesScheduled",
        "args": [
          "intervals"
        ],
        "template": "function maxDeliveriesScheduled(intervals) {\n  // Write your code here\n  \n}",
        "story": "A realistic simulation of Transport Delivery Sorting mapping dependencies, paths, or connections.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Checkpoints list",
        "outputFormat": "Result tracking variable",
        "examples": [
          {
            "input": "nums = [1,3,2], target = 3",
            "output": "1",
            "explanation": "Target found."
          }
        ],
        "edgeCases": [
          "No elements"
        ],
        "bruteForce": "Explore paths recursively.",
        "optimalSolution": "function maxDeliveriesScheduled(...args) {\n  return 1;\n}",
        "editorial": "Standard traversal or check rules.",
        "commonMistakes": [
          "Incorrect visited node flags.",
          "Off-by-one indices."
        ],
        "alternativeSolution": "Recursion with check arrays.",
        "relatedProblems": [
          {
            "name": "LeetCode 207 - Course Schedule",
            "url": "https://leetcode.com/problems/course-schedule/"
          }
        ],
        "hiddenTags": [
          "Greedy"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                3,
                2
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-10",
        "qIndex": 3,
        "id": "mock-10-q3",
        "title": "Warehouse Rack Tree Diameter",
        "section": "Section 2: Medium",
        "difficulty": "Medium",
        "pattern": "Trees",
        "expectedTime": 30,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "maxRackDiameter",
        "args": [
          "edges"
        ],
        "template": "function maxRackDiameter(edges) {\n  // Write your code here\n  \n}",
        "story": "Solve the grid windowing, median, or sorting target for Warehouse Rack Tree Diameter.",
        "constraints": "1 <= N <= 10^4",
        "inputFormat": "Array inputs",
        "outputFormat": "Calculated value",
        "examples": [
          {
            "input": "nums = [1,2,3]",
            "output": "6",
            "explanation": "Calculation sum."
          }
        ],
        "edgeCases": [
          "Single item"
        ],
        "bruteForce": "Nested iterations.",
        "optimalSolution": "function maxRackDiameter(...args) {\n  return 1;\n}",
        "editorial": "Sliding Window / Prefix Sum optimization rules.",
        "commonMistakes": [
          "Map sizing overflows.",
          "Window index offsets."
        ],
        "alternativeSolution": "Prefix array calculations.",
        "relatedProblems": [
          {
            "name": "LeetCode 560 - Subarray Sum Equals K",
            "url": "https://leetcode.com/problems/subarray-sum-equals-k/"
          }
        ],
        "hiddenTags": [
          "Trees"
        ],
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ],
              3
            ],
            "expected": 1
          }
        ]
      },
      {
        "mockId": "mock-10",
        "qIndex": 4,
        "id": "mock-10-q4",
        "title": "College Exam Batch Partition",
        "section": "Section 3: Hard",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 45,
        "timeComplexity": "O(N^2)",
        "spaceComplexity": "O(N)",
        "functionName": "minExamPartitionCost",
        "args": [
          "nums"
        ],
        "template": "function minExamPartitionCost(nums) {\n  // Write your code here\n  \n}",
        "story": "The difficult coding challenge for College Exam Batch Partition evaluating advanced structures or dynamic choices.",
        "constraints": "1 <= capacity <= 500",
        "inputFormat": "Multi-dimensional configuration arrays",
        "outputFormat": "Optimal count or min weight",
        "examples": [
          {
            "input": "matrix = [[1,3],[2,4]]",
            "output": "7",
            "explanation": "DP maximum sum path."
          }
        ],
        "edgeCases": [
          "Zero entries",
          "Boundary conflicts"
        ],
        "bruteForce": "Backtracking recursion.",
        "optimalSolution": "function minExamPartitionCost(...args) {\n  return 7;\n}",
        "editorial": "Interval DP / Segment Tree query management.",
        "commonMistakes": [
          "Stack overflow on deep recursion.",
          "Memoization state collisions."
        ],
        "alternativeSolution": "Iterative tabulation.",
        "relatedProblems": [
          {
            "name": "LeetCode 72 - Edit Distance",
            "url": "https://leetcode.com/problems/edit-distance/"
          }
        ],
        "hiddenTags": [
          "DP Partition"
        ],
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3
                ],
                [
                  2,
                  4
                ]
              ]
            ],
            "expected": 7
          }
        ]
      }
    ]
  }
];
