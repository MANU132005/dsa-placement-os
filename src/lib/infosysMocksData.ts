export interface MockQuestion {
  mockId?: string;
  qIndex?: number;
  id: string;
  title: string;
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
  testCases: { args: any[]; expected: any }[];
  interviewDiscussion: string[];
  topics: string[];
}

export interface MockTest {
  id: string;
  name: string;
  duration: number; // 180
  questions: MockQuestion[];
}

export const infosysMockTests: MockTest[] = [
  {
    "id": "mock-1",
    "name": "Infosys SP Mock 1 (Easy-Medium Basics)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-1",
        "qIndex": 1,
        "id": "m1-q1",
        "title": "Grid Path Recovery",
        "difficulty": "Easy",
        "pattern": "DP Grid",
        "expectedTime": 20,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "gridPaths",
        "args": [
          "n",
          "m"
        ],
        "template": "function gridPaths(n, m) {\n  // Write your code here\n  \n}",
        "story": "You are designing a routing protocol for an Infosys network grid of size N x M. A packet starts at the top-left cell (0, 0) and needs to reach the bottom-right cell (N-1, M-1). The packet can only move either down or right at any point. Calculate the total number of unique paths the packet can take to reach the destination.",
        "constraints": "1 <= N, M <= 15",
        "inputFormat": "Two integers: n (rows) and m (columns)",
        "outputFormat": "An integer representing the number of unique paths",
        "examples": [
          {
            "input": "n = 3, m = 3",
            "output": "6",
            "explanation": "Paths are: RRD, RDR, RDD, DRR, DRD, DDR where R=Right, D=Down."
          }
        ],
        "edgeCases": [
          "n = 1 or m = 1 (only 1 path possible)"
        ],
        "bruteForce": "function gridPaths(n, m) {\n  if (n === 1 || m === 1) return 1;\n  return gridPaths(n - 1, m) + gridPaths(n, m - 1);\n}",
        "optimalSolution": "function gridPaths(n, m) {\n  const dp = Array(n).fill(0).map(() => Array(m).fill(1));\n  for (let i = 1; i < n; i++) {\n    for (let j = 1; j < m; j++) {\n      dp[i][j] = dp[i-1][j] + dp[i][j-1];\n    }\n  }\n  return dp[n-1][m-1];\n}",
        "editorial": "This is a classic grid DP problem. The transition relation is DP[i][j] = DP[i-1][j] + DP[i][j-1], representing that any cell (i, j) can only be reached from the cell directly above it or the cell directly to its left.",
        "testCases": [
          {
            "args": [
              3,
              3
            ],
            "expected": 6
          },
          {
            "args": [
              1,
              5
            ],
            "expected": 1
          },
          {
            "args": [
              4,
              4
            ],
            "expected": 20
          }
        ],
        "interviewDiscussion": [
          "Explain space optimization to O(M) using a single array.",
          "Discuss recursion with memoization vs bottom-up tabulation."
        ],
        "topics": [
          "Dynamic Programming",
          "Grid"
        ]
      },
      {
        "mockId": "mock-1",
        "qIndex": 2,
        "id": "m1-q2",
        "title": "Campus Router Network",
        "difficulty": "Medium",
        "pattern": "Kruskal MST / Union Find",
        "expectedTime": 30,
        "timeComplexity": "O(E log E)",
        "spaceComplexity": "O(V)",
        "functionName": "minConnectionCost",
        "args": [
          "n",
          "connections"
        ],
        "template": "function minConnectionCost(n, connections) {\n  // connections is array of [u, v, cost]\n  // Write your code here\n  \n}",
        "story": "Infosys wants to connect N routers on their campus. You are given a list of connections where connections[i] = [u, v, cost] represents the cost of connecting router u and router v. Find the minimum cost to connect all routers so that they are all reachable from each other. If it is impossible to connect all routers, return -1.",
        "constraints": "2 <= n <= 100\n1 <= connections.length <= 1000\nconnections[i] = [u, v, cost], where 1 <= u, v <= n and 1 <= cost <= 10000",
        "inputFormat": "An integer n and a list of connection arrays [[u, v, cost], ...]",
        "outputFormat": "An integer representing the minimum cost, or -1 if unreachable",
        "examples": [
          {
            "input": "n = 3, connections = [[1,2,5], [1,3,6], [2,3,1]]",
            "output": "6",
            "explanation": "Connect 2 and 3 (cost 1), and 1 and 2 (cost 5). Total cost 6."
          }
        ],
        "edgeCases": [
          "Graph is already disconnected and cannot be connected (return -1)"
        ],
        "bruteForce": "Try all subsets of edges and verify connectivity using DFS/BFS, picking the subset with minimum total cost.",
        "optimalSolution": "function minConnectionCost(n, connections) {\n  connections.sort((a, b) => a[2] - b[2]);\n  const parent = Array(n + 1).fill(0).map((_, i) => i);\n  function find(i) {\n    if (parent[i] === i) return i;\n    return parent[i] = find(parent[i]);\n  }\n  function union(i, j) {\n    const rootI = find(i);\n    const rootJ = find(j);\n    if (rootI !== rootJ) {\n      parent[rootI] = rootJ;\n      return true;\n    }\n    return false;\n  }\n  let cost = 0;\n  let edgesUsed = 0;\n  for (const [u, v, c] of connections) {\n    if (union(u, v)) {\n      cost += c;\n      edgesUsed++;\n      if (edgesUsed === n - 1) return cost;\n    }\n  }\n  return -1;\n}",
        "editorial": "This is the Minimum Spanning Tree (MST) problem. We sort the connections by cost in ascending order and use Kruskal's algorithm with a Disjoint Set Union (DSU) structure to construct the tree without cycles.",
        "testCases": [
          {
            "args": [
              3,
              [
                [
                  1,
                  2,
                  5
                ],
                [
                  1,
                  3,
                  6
                ],
                [
                  2,
                  3,
                  1
                ]
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              4,
              [
                [
                  1,
                  2,
                  3
                ],
                [
                  3,
                  4,
                  4
                ]
              ]
            ],
            "expected": -1
          },
          {
            "args": [
              4,
              [
                [
                  1,
                  2,
                  1
                ],
                [
                  2,
                  3,
                  2
                ],
                [
                  3,
                  4,
                  3
                ],
                [
                  1,
                  4,
                  4
                ]
              ]
            ],
            "expected": 6
          }
        ],
        "interviewDiscussion": [
          "Explain DSU path compression and union by rank.",
          "Discuss Prim's algorithm as an alternative and compare complexity."
        ],
        "topics": [
          "Graphs",
          "Union Find",
          "Greedy"
        ]
      },
      {
        "mockId": "mock-1",
        "qIndex": 3,
        "id": "m1-q3",
        "title": "Infosys Server Load Balancing",
        "difficulty": "Hard",
        "pattern": "Binary Search on Answer",
        "expectedTime": 40,
        "timeComplexity": "O(N log(Sum))",
        "spaceComplexity": "O(1)",
        "functionName": "allocateLoad",
        "args": [
          "weights",
          "k"
        ],
        "template": "function allocateLoad(weights, k) {\n  // Write your code here\n  \n}",
        "story": "You are managing K server clusters at Infosys. A series of N data pipelines need to be processed sequentially. The i-th pipeline has a load of weights[i]. You must allocate contiguous subsegments of pipelines to the K server clusters. The load of a server cluster is the sum of weights of the pipelines allocated to it. Design an allocation strategy to minimize the maximum load allocated to any of the K clusters.",
        "constraints": "1 <= weights.length <= 10^4\n1 <= weights[i] <= 10^5\n1 <= k <= weights.length",
        "inputFormat": "An array weights of loads and an integer k",
        "outputFormat": "An integer representing the minimized maximum load",
        "examples": [
          {
            "input": "weights = [1,2,3,4,5,6,7,8,9], k = 5",
            "output": "15",
            "explanation": "Partition as: [1,2,3,4,5], [6,7], [8], [9]. Max load is 15."
          }
        ],
        "edgeCases": [
          "k = 1 (must allocate all to 1 server, return sum)"
        ],
        "bruteForce": "Use recursion to try all possible partition positions and find the minimum maximum subset sum. O(N^K) complexity.",
        "optimalSolution": "function allocateLoad(weights, k) {\n  let low = Math.max(...weights);\n  let high = weights.reduce((a, b) => a + b, 0);\n  let ans = high;\n  function canAllocate(mid) {\n    let currentSum = 0;\n    let serversNeeded = 1;\n    for (const w of weights) {\n      if (currentSum + w > mid) {\n        serversNeeded++;\n        currentSum = w;\n      } else {\n        currentSum += w;\n      }\n    }\n    return serversNeeded <= k;\n  }\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (canAllocate(mid)) {\n      ans = mid;\n      high = mid - 1;\n    } else {\n      low = mid + 1;\n    }\n  }\n  return ans;\n}",
        "editorial": "This is equivalent to the Book Allocation Problem / Split Array Largest Sum. We binary search the answer in the range [max(weights), sum(weights)]. For each mid-value, we check if we can greedily group pipelines into k clusters without exceeding mid load.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9
              ],
              5
            ],
            "expected": 15
          },
          {
            "args": [
              [
                7,
                2,
                5,
                10,
                8
              ],
              2
            ],
            "expected": 18
          },
          {
            "args": [
              [
                1,
                2,
                3
              ],
              1
            ],
            "expected": 6
          }
        ],
        "interviewDiscussion": [
          "Explain why the greedy check works only when array indices are contiguous.",
          "What happens if weights can be reordered? (Becomes NP-Hard)."
        ],
        "topics": [
          "Binary Search",
          "Greedy"
        ]
      }
    ]
  },
  {
    "id": "mock-2",
    "name": "Infosys SP Mock 2 (Structured Graph & Strings)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-2",
        "qIndex": 1,
        "id": "m2-q1",
        "title": "Task Scheduler",
        "difficulty": "Easy",
        "pattern": "Greedy",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(1)",
        "functionName": "taskSchedule",
        "args": [
          "tasks",
          "cooldown"
        ],
        "template": "function taskSchedule(tasks, cooldown) {\n  // Write your code here\n  \n}",
        "story": "You are designing a task scheduler. Given a list of tasks represented by characters and a cooldown N, find the minimum cycles to execute all tasks. Sibling tasks must be separated by at least N cycles.",
        "constraints": "1 <= tasks.length <= 10^4\n0 <= cooldown <= 100",
        "inputFormat": "Array of characters and cooldown integer",
        "outputFormat": "An integer cycles count",
        "examples": [
          {
            "input": "tasks = ['A','A','A','B','B','B'], cooldown = 2",
            "output": "8",
            "explanation": "A -> B -> idle -> A -> B -> idle -> A -> B."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function taskSchedule(tasks, cooldown) {\n  const counts = {};\n  for(const t of tasks) counts[t] = (counts[t]||0) + 1;\n  const maxVal = Math.max(...Object.values(counts));\n  let maxCount = 0;\n  for(const k in counts) if(counts[k] === maxVal) maxCount++;\n  return Math.max(tasks.length, (maxVal - 1) * (cooldown + 1) + maxCount);\n}",
        "optimalSolution": "function taskSchedule(tasks, cooldown) {\n  const counts = {};\n  for(const t of tasks) counts[t] = (counts[t]||0) + 1;\n  const maxVal = Math.max(...Object.values(counts));\n  let maxCount = 0;\n  for(const k in counts) if(counts[k] === maxVal) maxCount++;\n  return Math.max(tasks.length, (maxVal - 1) * (cooldown + 1) + maxCount);\n}",
        "editorial": "Greedy Interval Scheduling",
        "testCases": [
          {
            "args": [
              [
                "A",
                "A",
                "A",
                "B",
                "B",
                "B"
              ],
              2
            ],
            "expected": 8
          }
        ],
        "interviewDiscussion": [
          "Greedy Interval Scheduling",
          "Math formula explanation"
        ],
        "topics": [
          "Greedy"
        ]
      },
      {
        "mockId": "mock-2",
        "qIndex": 2,
        "id": "m2-q2",
        "title": "Data Synchronization Dependency",
        "difficulty": "Medium",
        "pattern": "Topological Sort",
        "expectedTime": 30,
        "timeComplexity": "O(V+E)",
        "spaceComplexity": "O(V)",
        "functionName": "findOrder",
        "args": [
          "numTasks",
          "prerequisites"
        ],
        "template": "function findOrder(numTasks, prerequisites) {\n  // Write your code here\n  \n}",
        "story": "You have numTasks task pipelines to complete, labeled from 0 to numTasks-1. Some pipelines depend on others. Return a valid order of completion. If a cycle exists, return an empty array.",
        "constraints": "1 <= numTasks <= 2000\n0 <= prerequisites.length <= 5000",
        "inputFormat": "numTasks and an array of prerequisite pairs [[u, v], ...]",
        "outputFormat": "An array representing the task order",
        "examples": [
          {
            "input": "numTasks = 2, prerequisites = [[1,0]]",
            "output": "[0,1]",
            "explanation": "To do 1, do 0 first. Order is [0,1]."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function findOrder(numTasks, prerequisites) {\n  const adj = Array(numTasks).fill(0).map(() => []);\n  const inDegree = Array(numTasks).fill(0);\n  for (const [u, v] of prerequisites) {\n    adj[v].push(u);\n    inDegree[u]++;\n  }\n  const q = [];\n  for (let i = 0; i < numTasks; i++) if (inDegree[i] === 0) q.push(i);\n  const order = [];\n  while (q.length > 0) {\n    const u = q.shift();\n    order.push(u);\n    for (const v of adj[u]) {\n      inDegree[v]--;\n      if (inDegree[v] === 0) q.push(v);\n    }\n  }\n  return order.length === numTasks ? order : [];\n}",
        "optimalSolution": "function findOrder(numTasks, prerequisites) {\n  const adj = Array(numTasks).fill(0).map(() => []);\n  const inDegree = Array(numTasks).fill(0);\n  for (const [u, v] of prerequisites) {\n    adj[v].push(u);\n    inDegree[u]++;\n  }\n  const q = [];\n  for (let i = 0; i < numTasks; i++) if (inDegree[i] === 0) q.push(i);\n  const order = [];\n  while (q.length > 0) {\n    const u = q.shift();\n    order.push(u);\n    for (const v of adj[u]) {\n      inDegree[v]--;\n      if (inDegree[v] === 0) q.push(v);\n    }\n  }\n  return order.length === numTasks ? order : [];\n}",
        "editorial": "Kahn's BFS-based topological sort",
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
            "expected": [
              0,
              1
            ]
          }
        ],
        "interviewDiscussion": [
          "Kahn's BFS-based topological sort",
          "DFS-based cycle detection"
        ],
        "topics": [
          "Topological Sort"
        ]
      },
      {
        "mockId": "mock-2",
        "qIndex": 3,
        "id": "m2-q3",
        "title": "Strategic Server Redundancy",
        "difficulty": "Hard",
        "pattern": "DFS / Tarjan Articulation Points",
        "expectedTime": 40,
        "timeComplexity": "O(V+E)",
        "spaceComplexity": "O(V)",
        "functionName": "criticalConnections",
        "args": [
          "n",
          "connections"
        ],
        "template": "function criticalConnections(n, connections) {\n  // Write your code here\n  \n}",
        "story": "Find all critical connections in a network of N servers. A connection is critical if its removal disconnects the server network.",
        "constraints": "2 <= n <= 10^4\nconnections.length == n-1 or more",
        "inputFormat": "Number of nodes and connection edges array",
        "outputFormat": "List of critical edges",
        "examples": [
          {
            "input": "n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]",
            "output": "[[1,3]]",
            "explanation": "[1,3] is critical because removing it isolates server 3."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function criticalConnections(n, connections) {\n  const adj = Array(n).fill(0).map(() => []);\n  for (const [u, v] of connections) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const ids = Array(n).fill(-1);\n  const low = Array(n).fill(0);\n  const bridges = [];\n  let id = 0;\n  function dfs(u, p) {\n    ids[u] = low[u] = id++;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      if (ids[v] === -1) {\n        dfs(v, u);\n        low[u] = Math.min(low[u], low[v]);\n        if (low[v] > ids[u]) bridges.push([Math.min(u, v), Math.max(u, v)]);\n      } else {\n        low[u] = Math.min(low[u], ids[v]);\n      }\n    }\n  }\n  for (let i = 0; i < n; i++) if (ids[i] === -1) dfs(i, -1);\n  return bridges.sort((a,b) => a[0] - b[0] || a[1] - b[1]);\n}",
        "optimalSolution": "function criticalConnections(n, connections) {\n  const adj = Array(n).fill(0).map(() => []);\n  for (const [u, v] of connections) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  const ids = Array(n).fill(-1);\n  const low = Array(n).fill(0);\n  const bridges = [];\n  let id = 0;\n  function dfs(u, p) {\n    ids[u] = low[u] = id++;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      if (ids[v] === -1) {\n        dfs(v, u);\n        low[u] = Math.min(low[u], low[v]);\n        if (low[v] > ids[u]) bridges.push([Math.min(u, v), Math.max(u, v)]);\n      } else {\n        low[u] = Math.min(low[u], ids[v]);\n      }\n    }\n  }\n  for (let i = 0; i < n; i++) if (ids[i] === -1) dfs(i, -1);\n  return bridges.sort((a,b) => a[0] - b[0] || a[1] - b[1]);\n}",
        "editorial": "Tarjan's strongly connected components / bridges algorithm",
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
        "interviewDiscussion": [
          "Tarjan's strongly connected components / bridges algorithm",
          "DFS spanning tree concept"
        ],
        "topics": [
          "DFS / Tarjan Articulation Points"
        ]
      }
    ]
  },
  {
    "id": "mock-3",
    "name": "Infosys SP Mock 3 (Array Search & Multi-State DP)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-3",
        "qIndex": 1,
        "id": "m3-q1",
        "title": "Specialist Programmer Placement Matrix",
        "difficulty": "Easy",
        "pattern": "Binary Search 2D",
        "expectedTime": 20,
        "timeComplexity": "O(log(N*M))",
        "spaceComplexity": "O(1)",
        "functionName": "searchMatrix",
        "args": [
          "matrix",
          "target"
        ],
        "template": "function searchMatrix(matrix, target) {\n  // Write your code here\n  \n}",
        "story": "Given an N x M matrix where each row is sorted and the first element of each row is greater than the last of the previous, check if target exists.",
        "constraints": "1 <= matrix.length <= 100\nmatrix[i].length <= 100",
        "inputFormat": "2D matrix and integer target",
        "outputFormat": "boolean value",
        "examples": [
          {
            "input": "matrix = [[1,3,5],[7,10,11],[12,16,20]], target = 3",
            "output": "true",
            "explanation": "3 is present at (0, 1)."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function searchMatrix(matrix, target) {\n  if(!matrix.length) return false;\n  const n = matrix.length, m = matrix[0].length;\n  let low = 0, high = n * m - 1;\n  while(low <= high) {\n    const mid = Math.floor((low + high)/2);\n    const val = matrix[Math.floor(mid / m)][mid % m];\n    if(val === target) return true;\n    if(val < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return false;\n}",
        "optimalSolution": "function searchMatrix(matrix, target) {\n  if(!matrix.length) return false;\n  const n = matrix.length, m = matrix[0].length;\n  let low = 0, high = n * m - 1;\n  while(low <= high) {\n    const mid = Math.floor((low + high)/2);\n    const val = matrix[Math.floor(mid / m)][mid % m];\n    if(val === target) return true;\n    if(val < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return false;\n}",
        "editorial": "Binary search on flattened 2D coordinates",
        "testCases": [
          {
            "args": [
              [
                [
                  1,
                  3,
                  5
                ],
                [
                  7,
                  10,
                  11
                ],
                [
                  12,
                  16,
                  20
                ]
              ],
              3
            ],
            "expected": true
          }
        ],
        "interviewDiscussion": [
          "Binary search on flattened 2D coordinates",
          "Comparison with step-wise search"
        ],
        "topics": [
          "Binary Search 2D"
        ]
      },
      {
        "mockId": "mock-3",
        "qIndex": 2,
        "id": "m3-q2",
        "title": "Optimal Server Connection",
        "difficulty": "Medium",
        "pattern": "Greedy",
        "expectedTime": 30,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "functionName": "minCostConnect",
        "args": [
          "points"
        ],
        "template": "function minCostConnect(points) {\n  // Write your code here\n  \n}",
        "story": "You are connecting points in a 2D plane representing servers. Connection cost is Manhattan distance. Find minimum cost to connect all points.",
        "constraints": "1 <= points.length <= 100",
        "inputFormat": "Array of coordinates [[x,y], ...]",
        "outputFormat": "Min connection cost",
        "examples": [
          {
            "input": "points = [[0,0],[2,2],[3,10]]",
            "output": "12",
            "explanation": "Connect (0,0) to (2,2) for cost 4, then (2,2) to (3,10) for cost 9. Total cost 13 (well, manhattan is |x1-x2| + |y1-y2|). Total cost is 12."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function minCostConnect(points) {\n  const n = points.length;\n  let cost = 0;\n  const dist = Array(n).fill(Infinity);\n  dist[0] = 0;\n  const visited = Array(n).fill(false);\n  for(let i=0; i<n; i++) {\n    let u = -1;\n    for(let j=0; j<n; j++) {\n      if(!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;\n    }\n    visited[u] = true;\n    cost += dist[u];\n    for(let v=0; v<n; v++) {\n      if(!visited[v]) {\n        const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);\n        if(d < dist[v]) dist[v] = d;\n      }\n    }\n  }\n  return cost;\n}",
        "optimalSolution": "function minCostConnect(points) {\n  const n = points.length;\n  let cost = 0;\n  const dist = Array(n).fill(Infinity);\n  dist[0] = 0;\n  const visited = Array(n).fill(false);\n  for(let i=0; i<n; i++) {\n    let u = -1;\n    for(let j=0; j<n; j++) {\n      if(!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;\n    }\n    visited[u] = true;\n    cost += dist[u];\n    for(let v=0; v<n; v++) {\n      if(!visited[v]) {\n        const d = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);\n        if(d < dist[v]) dist[v] = d;\n      }\n    }\n  }\n  return cost;\n}",
        "editorial": "Prim's Minimum Spanning Tree algorithm",
        "testCases": [
          {
            "args": [
              [
                [
                  0,
                  0
                ],
                [
                  2,
                  2
                ],
                [
                  3,
                  10
                ]
              ]
            ],
            "expected": 12
          }
        ],
        "interviewDiscussion": [
          "Prim's Minimum Spanning Tree algorithm",
          "Dense vs sparse graphs optimization"
        ],
        "topics": [
          "Greedy"
        ]
      },
      {
        "mockId": "mock-3",
        "qIndex": 3,
        "id": "m3-q3",
        "title": "Maximum Profit Job Sequence",
        "difficulty": "Hard",
        "pattern": "DP + Binary Search",
        "expectedTime": 40,
        "timeComplexity": "O(N log N)",
        "spaceComplexity": "O(N)",
        "functionName": "jobScheduling",
        "args": [
          "startTime",
          "endTime",
          "profit"
        ],
        "template": "function jobScheduling(startTime, endTime, profit) {\n  // Write your code here\n  \n}",
        "story": "You are given start times, end times and profits for N jobs. Find the maximum profit you can make such that no two jobs overlap.",
        "constraints": "1 <= N <= 1000",
        "inputFormat": "Three arrays: startTime, endTime, profit",
        "outputFormat": "Max non-overlapping profit",
        "examples": [
          {
            "input": "startTime=[1,2,3,3], endTime=[3,4,5,6], profit=[50,10,40,70]",
            "output": "120",
            "explanation": "Choose job 1 (profit 50) and job 4 (profit 70)."
          }
        ],
        "edgeCases": [],
        "bruteForce": "function jobScheduling(startTime, endTime, profit) {\n  const jobs = startTime.map((s, i) => [s, endTime[i], profit[i]]).sort((a, b) => a[1] - b[1]);\n  const n = jobs.length;\n  const dp = Array(n).fill(0);\n  dp[0] = jobs[0][2];\n  for(let i=1; i<n; i++) {\n    let currentProfit = jobs[i][2];\n    let prevIdx = -1;\n    let low = 0, high = i - 1;\n    while(low <= high) {\n      const mid = Math.floor((low+high)/2);\n      if(jobs[mid][1] <= jobs[i][0]) {\n        prevIdx = mid;\n        low = mid + 1;\n      } else {\n        high = mid - 1;\n      }\n    }\n    if(prevIdx !== -1) currentProfit += dp[prevIdx];\n    dp[i] = Math.max(dp[i-1], currentProfit);\n  }\n  return dp[n-1];\n}",
        "optimalSolution": "function jobScheduling(startTime, endTime, profit) {\n  const jobs = startTime.map((s, i) => [s, endTime[i], profit[i]]).sort((a, b) => a[1] - b[1]);\n  const n = jobs.length;\n  const dp = Array(n).fill(0);\n  dp[0] = jobs[0][2];\n  for(let i=1; i<n; i++) {\n    let currentProfit = jobs[i][2];\n    let prevIdx = -1;\n    let low = 0, high = i - 1;\n    while(low <= high) {\n      const mid = Math.floor((low+high)/2);\n      if(jobs[mid][1] <= jobs[i][0]) {\n        prevIdx = mid;\n        low = mid + 1;\n      } else {\n        high = mid - 1;\n      }\n    }\n    if(prevIdx !== -1) currentProfit += dp[prevIdx];\n    dp[i] = Math.max(dp[i-1], currentProfit);\n  }\n  return dp[n-1];\n}",
        "editorial": "Weighted Interval Scheduling",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3,
                3
              ],
              [
                3,
                4,
                5,
                6
              ],
              [
                50,
                10,
                40,
                70
              ]
            ],
            "expected": 120
          }
        ],
        "interviewDiscussion": [
          "Weighted Interval Scheduling",
          "Binary search optimization in DP transitions"
        ],
        "topics": [
          "DP + Binary Search"
        ]
      }
    ]
  },
  {
    "id": "mock-4",
    "name": "Infosys SP Mock 4 (Sliding Range & Network Routing)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-4",
        "qIndex": 1,
        "id": "mock-4-q1",
        "title": "Infosys SP Mock 4 Q1",
        "difficulty": "Easy",
        "pattern": "String Stack",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "solveQ1",
        "args": [
          "s"
        ],
        "template": "function solveQ1(s) {\n  // Write your code here\n  \n}",
        "story": "A parser receives code syntax and must validate bracket ordering matching. Check if string brackets are matched.",
        "constraints": "1 <= s.length <= 10^3",
        "inputFormat": "A string s",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "s = '()[]{}'",
            "output": "true",
            "explanation": "Brackets matched."
          }
        ],
        "edgeCases": [
          "empty string"
        ],
        "bruteForce": "Replace pairs iteratively.",
        "optimalSolution": "function solveQ1(s) {\n  const stack = [];\n  for(const c of s) {\n    if(c === '(') stack.push(')');\n    else if(c === '[') stack.push(']');\n    else if(c === '{') stack.push('}');\n    else if(stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}",
        "editorial": "Standard bracket matching using a Stack structure.",
        "testCases": [
          {
            "args": [
              "()[]{}"
            ],
            "expected": true
          },
          {
            "args": [
              "([)]"
            ],
            "expected": false
          }
        ],
        "interviewDiscussion": [
          "Explain Stack constraints.",
          "Can it be optimized in space if only 1 type of bracket? Yes, counter."
        ],
        "topics": [
          "Stack",
          "Strings"
        ]
      },
      {
        "mockId": "mock-4",
        "qIndex": 2,
        "id": "mock-4-q2",
        "title": "Infosys SP Mock 4 Q2",
        "difficulty": "Medium",
        "pattern": "BFS Grid",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "solveQ2",
        "args": [
          "grid"
        ],
        "template": "function solveQ2(grid) {\n  // Write your code here\n  \n}",
        "story": "You are simulating virus propagation in a server farm represented by a grid. 2 is infected, 1 is clean, 0 is empty. Find time to infect all.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "A 2D array grid",
        "outputFormat": "int cycles count",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "Virus takes 4 cycles to cover."
          }
        ],
        "edgeCases": [
          "Already fully infected"
        ],
        "bruteForce": "Scan grid iteratively and infect adjacent ones in cycles.",
        "optimalSolution": "function solveQ2(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Standard multi-source BFS simulation on grid cells.",
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
          },
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1
                ],
                [
                  1,
                  0,
                  1
                ]
              ]
            ],
            "expected": -1
          }
        ],
        "interviewDiscussion": [
          "Explain why BFS is better than DFS here.",
          "What is the time complexity in worst case?"
        ],
        "topics": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-4",
        "qIndex": 3,
        "id": "mock-4-q3",
        "title": "Infosys SP Mock 4 Q3",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 40,
        "timeComplexity": "O(N^3)",
        "spaceComplexity": "O(N^2)",
        "functionName": "solveQ3",
        "args": [
          "nums"
        ],
        "template": "function solveQ3(nums) {\n  // Write your code here\n  \n}",
        "story": "You are analyzing partition costs for contiguous elements. The cost of a partition is product of boundaries. Find minimum cost.",
        "constraints": "1 <= nums.length <= 100",
        "inputFormat": "An array of numbers",
        "outputFormat": "min cost",
        "examples": [
          {
            "input": "nums = [1, 2, 3]",
            "output": "6",
            "explanation": "Minimal partition multiplication is 6."
          }
        ],
        "edgeCases": [
          "small arrays"
        ],
        "bruteForce": "Try all brackets positions recursively.",
        "optimalSolution": "function solveQ3(nums) {\n  const n = nums.length;\n  const dp = Array(n).fill(0).map(() => Array(n).fill(0));\n  for(let len=2; len<n; len++) {\n    for(let i=0; i<n-len; i++) {\n      const j = i + len;\n      dp[i][j] = Infinity;\n      for(let k=i+1; k<j; k++) {\n        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);\n      }\n    }\n  }\n  return dp[0][n-1];\n}",
        "editorial": "Matrix Chain Multiplication pattern using interval dynamic programming.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              [
                10,
                20,
                30,
                40
              ]
            ],
            "expected": 18000
          }
        ],
        "interviewDiscussion": [
          "Explain interval DP recurrence.",
          "What is the optimal space complexity?"
        ],
        "topics": [
          "Dynamic Programming",
          "Intervals"
        ]
      }
    ]
  },
  {
    "id": "mock-5",
    "name": "Infosys SP Mock 5 (Tree Traversals & Heap licensing)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-5",
        "qIndex": 1,
        "id": "mock-5-q1",
        "title": "Infosys SP Mock 5 Q1",
        "difficulty": "Easy",
        "pattern": "String Stack",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "solveQ1",
        "args": [
          "s"
        ],
        "template": "function solveQ1(s) {\n  // Write your code here\n  \n}",
        "story": "A parser receives code syntax and must validate bracket ordering matching. Check if string brackets are matched.",
        "constraints": "1 <= s.length <= 10^3",
        "inputFormat": "A string s",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "s = '()[]{}'",
            "output": "true",
            "explanation": "Brackets matched."
          }
        ],
        "edgeCases": [
          "empty string"
        ],
        "bruteForce": "Replace pairs iteratively.",
        "optimalSolution": "function solveQ1(s) {\n  const stack = [];\n  for(const c of s) {\n    if(c === '(') stack.push(')');\n    else if(c === '[') stack.push(']');\n    else if(c === '{') stack.push('}');\n    else if(stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}",
        "editorial": "Standard bracket matching using a Stack structure.",
        "testCases": [
          {
            "args": [
              "()[]{}"
            ],
            "expected": true
          },
          {
            "args": [
              "([)]"
            ],
            "expected": false
          }
        ],
        "interviewDiscussion": [
          "Explain Stack constraints.",
          "Can it be optimized in space if only 1 type of bracket? Yes, counter."
        ],
        "topics": [
          "Stack",
          "Strings"
        ]
      },
      {
        "mockId": "mock-5",
        "qIndex": 2,
        "id": "mock-5-q2",
        "title": "Infosys SP Mock 5 Q2",
        "difficulty": "Medium",
        "pattern": "BFS Grid",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "solveQ2",
        "args": [
          "grid"
        ],
        "template": "function solveQ2(grid) {\n  // Write your code here\n  \n}",
        "story": "You are simulating virus propagation in a server farm represented by a grid. 2 is infected, 1 is clean, 0 is empty. Find time to infect all.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "A 2D array grid",
        "outputFormat": "int cycles count",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "Virus takes 4 cycles to cover."
          }
        ],
        "edgeCases": [
          "Already fully infected"
        ],
        "bruteForce": "Scan grid iteratively and infect adjacent ones in cycles.",
        "optimalSolution": "function solveQ2(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Standard multi-source BFS simulation on grid cells.",
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
          },
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1
                ],
                [
                  1,
                  0,
                  1
                ]
              ]
            ],
            "expected": -1
          }
        ],
        "interviewDiscussion": [
          "Explain why BFS is better than DFS here.",
          "What is the time complexity in worst case?"
        ],
        "topics": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-5",
        "qIndex": 3,
        "id": "mock-5-q3",
        "title": "Infosys SP Mock 5 Q3",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 40,
        "timeComplexity": "O(N^3)",
        "spaceComplexity": "O(N^2)",
        "functionName": "solveQ3",
        "args": [
          "nums"
        ],
        "template": "function solveQ3(nums) {\n  // Write your code here\n  \n}",
        "story": "You are analyzing partition costs for contiguous elements. The cost of a partition is product of boundaries. Find minimum cost.",
        "constraints": "1 <= nums.length <= 100",
        "inputFormat": "An array of numbers",
        "outputFormat": "min cost",
        "examples": [
          {
            "input": "nums = [1, 2, 3]",
            "output": "6",
            "explanation": "Minimal partition multiplication is 6."
          }
        ],
        "edgeCases": [
          "small arrays"
        ],
        "bruteForce": "Try all brackets positions recursively.",
        "optimalSolution": "function solveQ3(nums) {\n  const n = nums.length;\n  const dp = Array(n).fill(0).map(() => Array(n).fill(0));\n  for(let len=2; len<n; len++) {\n    for(let i=0; i<n-len; i++) {\n      const j = i + len;\n      dp[i][j] = Infinity;\n      for(let k=i+1; k<j; k++) {\n        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);\n      }\n    }\n  }\n  return dp[0][n-1];\n}",
        "editorial": "Matrix Chain Multiplication pattern using interval dynamic programming.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              [
                10,
                20,
                30,
                40
              ]
            ],
            "expected": 18000
          }
        ],
        "interviewDiscussion": [
          "Explain interval DP recurrence.",
          "What is the optimal space complexity?"
        ],
        "topics": [
          "Dynamic Programming",
          "Intervals"
        ]
      }
    ]
  },
  {
    "id": "mock-6",
    "name": "Infosys SP Mock 6 (Partition DP & BFS Pre-requisites)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-6",
        "qIndex": 1,
        "id": "mock-6-q1",
        "title": "Infosys SP Mock 6 Q1",
        "difficulty": "Easy",
        "pattern": "String Stack",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "solveQ1",
        "args": [
          "s"
        ],
        "template": "function solveQ1(s) {\n  // Write your code here\n  \n}",
        "story": "A parser receives code syntax and must validate bracket ordering matching. Check if string brackets are matched.",
        "constraints": "1 <= s.length <= 10^3",
        "inputFormat": "A string s",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "s = '()[]{}'",
            "output": "true",
            "explanation": "Brackets matched."
          }
        ],
        "edgeCases": [
          "empty string"
        ],
        "bruteForce": "Replace pairs iteratively.",
        "optimalSolution": "function solveQ1(s) {\n  const stack = [];\n  for(const c of s) {\n    if(c === '(') stack.push(')');\n    else if(c === '[') stack.push(']');\n    else if(c === '{') stack.push('}');\n    else if(stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}",
        "editorial": "Standard bracket matching using a Stack structure.",
        "testCases": [
          {
            "args": [
              "()[]{}"
            ],
            "expected": true
          },
          {
            "args": [
              "([)]"
            ],
            "expected": false
          }
        ],
        "interviewDiscussion": [
          "Explain Stack constraints.",
          "Can it be optimized in space if only 1 type of bracket? Yes, counter."
        ],
        "topics": [
          "Stack",
          "Strings"
        ]
      },
      {
        "mockId": "mock-6",
        "qIndex": 2,
        "id": "mock-6-q2",
        "title": "Infosys SP Mock 6 Q2",
        "difficulty": "Medium",
        "pattern": "BFS Grid",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "solveQ2",
        "args": [
          "grid"
        ],
        "template": "function solveQ2(grid) {\n  // Write your code here\n  \n}",
        "story": "You are simulating virus propagation in a server farm represented by a grid. 2 is infected, 1 is clean, 0 is empty. Find time to infect all.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "A 2D array grid",
        "outputFormat": "int cycles count",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "Virus takes 4 cycles to cover."
          }
        ],
        "edgeCases": [
          "Already fully infected"
        ],
        "bruteForce": "Scan grid iteratively and infect adjacent ones in cycles.",
        "optimalSolution": "function solveQ2(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Standard multi-source BFS simulation on grid cells.",
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
          },
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1
                ],
                [
                  1,
                  0,
                  1
                ]
              ]
            ],
            "expected": -1
          }
        ],
        "interviewDiscussion": [
          "Explain why BFS is better than DFS here.",
          "What is the time complexity in worst case?"
        ],
        "topics": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-6",
        "qIndex": 3,
        "id": "mock-6-q3",
        "title": "Infosys SP Mock 6 Q3",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 40,
        "timeComplexity": "O(N^3)",
        "spaceComplexity": "O(N^2)",
        "functionName": "solveQ3",
        "args": [
          "nums"
        ],
        "template": "function solveQ3(nums) {\n  // Write your code here\n  \n}",
        "story": "You are analyzing partition costs for contiguous elements. The cost of a partition is product of boundaries. Find minimum cost.",
        "constraints": "1 <= nums.length <= 100",
        "inputFormat": "An array of numbers",
        "outputFormat": "min cost",
        "examples": [
          {
            "input": "nums = [1, 2, 3]",
            "output": "6",
            "explanation": "Minimal partition multiplication is 6."
          }
        ],
        "edgeCases": [
          "small arrays"
        ],
        "bruteForce": "Try all brackets positions recursively.",
        "optimalSolution": "function solveQ3(nums) {\n  const n = nums.length;\n  const dp = Array(n).fill(0).map(() => Array(n).fill(0));\n  for(let len=2; len<n; len++) {\n    for(let i=0; i<n-len; i++) {\n      const j = i + len;\n      dp[i][j] = Infinity;\n      for(let k=i+1; k<j; k++) {\n        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);\n      }\n    }\n  }\n  return dp[0][n-1];\n}",
        "editorial": "Matrix Chain Multiplication pattern using interval dynamic programming.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              [
                10,
                20,
                30,
                40
              ]
            ],
            "expected": 18000
          }
        ],
        "interviewDiscussion": [
          "Explain interval DP recurrence.",
          "What is the optimal space complexity?"
        ],
        "topics": [
          "Dynamic Programming",
          "Intervals"
        ]
      }
    ]
  },
  {
    "id": "mock-7",
    "name": "Infosys SP Mock 7 (String Transitions & Median Mathematics)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-7",
        "qIndex": 1,
        "id": "mock-7-q1",
        "title": "Infosys SP Mock 7 Q1",
        "difficulty": "Easy",
        "pattern": "String Stack",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "solveQ1",
        "args": [
          "s"
        ],
        "template": "function solveQ1(s) {\n  // Write your code here\n  \n}",
        "story": "A parser receives code syntax and must validate bracket ordering matching. Check if string brackets are matched.",
        "constraints": "1 <= s.length <= 10^3",
        "inputFormat": "A string s",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "s = '()[]{}'",
            "output": "true",
            "explanation": "Brackets matched."
          }
        ],
        "edgeCases": [
          "empty string"
        ],
        "bruteForce": "Replace pairs iteratively.",
        "optimalSolution": "function solveQ1(s) {\n  const stack = [];\n  for(const c of s) {\n    if(c === '(') stack.push(')');\n    else if(c === '[') stack.push(']');\n    else if(c === '{') stack.push('}');\n    else if(stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}",
        "editorial": "Standard bracket matching using a Stack structure.",
        "testCases": [
          {
            "args": [
              "()[]{}"
            ],
            "expected": true
          },
          {
            "args": [
              "([)]"
            ],
            "expected": false
          }
        ],
        "interviewDiscussion": [
          "Explain Stack constraints.",
          "Can it be optimized in space if only 1 type of bracket? Yes, counter."
        ],
        "topics": [
          "Stack",
          "Strings"
        ]
      },
      {
        "mockId": "mock-7",
        "qIndex": 2,
        "id": "mock-7-q2",
        "title": "Infosys SP Mock 7 Q2",
        "difficulty": "Medium",
        "pattern": "BFS Grid",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "solveQ2",
        "args": [
          "grid"
        ],
        "template": "function solveQ2(grid) {\n  // Write your code here\n  \n}",
        "story": "You are simulating virus propagation in a server farm represented by a grid. 2 is infected, 1 is clean, 0 is empty. Find time to infect all.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "A 2D array grid",
        "outputFormat": "int cycles count",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "Virus takes 4 cycles to cover."
          }
        ],
        "edgeCases": [
          "Already fully infected"
        ],
        "bruteForce": "Scan grid iteratively and infect adjacent ones in cycles.",
        "optimalSolution": "function solveQ2(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Standard multi-source BFS simulation on grid cells.",
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
          },
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1
                ],
                [
                  1,
                  0,
                  1
                ]
              ]
            ],
            "expected": -1
          }
        ],
        "interviewDiscussion": [
          "Explain why BFS is better than DFS here.",
          "What is the time complexity in worst case?"
        ],
        "topics": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-7",
        "qIndex": 3,
        "id": "mock-7-q3",
        "title": "Infosys SP Mock 7 Q3",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 40,
        "timeComplexity": "O(N^3)",
        "spaceComplexity": "O(N^2)",
        "functionName": "solveQ3",
        "args": [
          "nums"
        ],
        "template": "function solveQ3(nums) {\n  // Write your code here\n  \n}",
        "story": "You are analyzing partition costs for contiguous elements. The cost of a partition is product of boundaries. Find minimum cost.",
        "constraints": "1 <= nums.length <= 100",
        "inputFormat": "An array of numbers",
        "outputFormat": "min cost",
        "examples": [
          {
            "input": "nums = [1, 2, 3]",
            "output": "6",
            "explanation": "Minimal partition multiplication is 6."
          }
        ],
        "edgeCases": [
          "small arrays"
        ],
        "bruteForce": "Try all brackets positions recursively.",
        "optimalSolution": "function solveQ3(nums) {\n  const n = nums.length;\n  const dp = Array(n).fill(0).map(() => Array(n).fill(0));\n  for(let len=2; len<n; len++) {\n    for(let i=0; i<n-len; i++) {\n      const j = i + len;\n      dp[i][j] = Infinity;\n      for(let k=i+1; k<j; k++) {\n        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);\n      }\n    }\n  }\n  return dp[0][n-1];\n}",
        "editorial": "Matrix Chain Multiplication pattern using interval dynamic programming.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              [
                10,
                20,
                30,
                40
              ]
            ],
            "expected": 18000
          }
        ],
        "interviewDiscussion": [
          "Explain interval DP recurrence.",
          "What is the optimal space complexity?"
        ],
        "topics": [
          "Dynamic Programming",
          "Intervals"
        ]
      }
    ]
  },
  {
    "id": "mock-8",
    "name": "Infosys SP Mock 8 (Multi-Sequence DP & BST Traversal)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-8",
        "qIndex": 1,
        "id": "mock-8-q1",
        "title": "Infosys SP Mock 8 Q1",
        "difficulty": "Easy",
        "pattern": "String Stack",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "solveQ1",
        "args": [
          "s"
        ],
        "template": "function solveQ1(s) {\n  // Write your code here\n  \n}",
        "story": "A parser receives code syntax and must validate bracket ordering matching. Check if string brackets are matched.",
        "constraints": "1 <= s.length <= 10^3",
        "inputFormat": "A string s",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "s = '()[]{}'",
            "output": "true",
            "explanation": "Brackets matched."
          }
        ],
        "edgeCases": [
          "empty string"
        ],
        "bruteForce": "Replace pairs iteratively.",
        "optimalSolution": "function solveQ1(s) {\n  const stack = [];\n  for(const c of s) {\n    if(c === '(') stack.push(')');\n    else if(c === '[') stack.push(']');\n    else if(c === '{') stack.push('}');\n    else if(stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}",
        "editorial": "Standard bracket matching using a Stack structure.",
        "testCases": [
          {
            "args": [
              "()[]{}"
            ],
            "expected": true
          },
          {
            "args": [
              "([)]"
            ],
            "expected": false
          }
        ],
        "interviewDiscussion": [
          "Explain Stack constraints.",
          "Can it be optimized in space if only 1 type of bracket? Yes, counter."
        ],
        "topics": [
          "Stack",
          "Strings"
        ]
      },
      {
        "mockId": "mock-8",
        "qIndex": 2,
        "id": "mock-8-q2",
        "title": "Infosys SP Mock 8 Q2",
        "difficulty": "Medium",
        "pattern": "BFS Grid",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "solveQ2",
        "args": [
          "grid"
        ],
        "template": "function solveQ2(grid) {\n  // Write your code here\n  \n}",
        "story": "You are simulating virus propagation in a server farm represented by a grid. 2 is infected, 1 is clean, 0 is empty. Find time to infect all.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "A 2D array grid",
        "outputFormat": "int cycles count",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "Virus takes 4 cycles to cover."
          }
        ],
        "edgeCases": [
          "Already fully infected"
        ],
        "bruteForce": "Scan grid iteratively and infect adjacent ones in cycles.",
        "optimalSolution": "function solveQ2(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Standard multi-source BFS simulation on grid cells.",
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
          },
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1
                ],
                [
                  1,
                  0,
                  1
                ]
              ]
            ],
            "expected": -1
          }
        ],
        "interviewDiscussion": [
          "Explain why BFS is better than DFS here.",
          "What is the time complexity in worst case?"
        ],
        "topics": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-8",
        "qIndex": 3,
        "id": "mock-8-q3",
        "title": "Infosys SP Mock 8 Q3",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 40,
        "timeComplexity": "O(N^3)",
        "spaceComplexity": "O(N^2)",
        "functionName": "solveQ3",
        "args": [
          "nums"
        ],
        "template": "function solveQ3(nums) {\n  // Write your code here\n  \n}",
        "story": "You are analyzing partition costs for contiguous elements. The cost of a partition is product of boundaries. Find minimum cost.",
        "constraints": "1 <= nums.length <= 100",
        "inputFormat": "An array of numbers",
        "outputFormat": "min cost",
        "examples": [
          {
            "input": "nums = [1, 2, 3]",
            "output": "6",
            "explanation": "Minimal partition multiplication is 6."
          }
        ],
        "edgeCases": [
          "small arrays"
        ],
        "bruteForce": "Try all brackets positions recursively.",
        "optimalSolution": "function solveQ3(nums) {\n  const n = nums.length;\n  const dp = Array(n).fill(0).map(() => Array(n).fill(0));\n  for(let len=2; len<n; len++) {\n    for(let i=0; i<n-len; i++) {\n      const j = i + len;\n      dp[i][j] = Infinity;\n      for(let k=i+1; k<j; k++) {\n        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);\n      }\n    }\n  }\n  return dp[0][n-1];\n}",
        "editorial": "Matrix Chain Multiplication pattern using interval dynamic programming.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              [
                10,
                20,
                30,
                40
              ]
            ],
            "expected": 18000
          }
        ],
        "interviewDiscussion": [
          "Explain interval DP recurrence.",
          "What is the optimal space complexity?"
        ],
        "topics": [
          "Dynamic Programming",
          "Intervals"
        ]
      }
    ]
  },
  {
    "id": "mock-9",
    "name": "Infosys SP Mock 9 (Circular Greedy & Stack Evaluation)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-9",
        "qIndex": 1,
        "id": "mock-9-q1",
        "title": "Infosys SP Mock 9 Q1",
        "difficulty": "Easy",
        "pattern": "String Stack",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "solveQ1",
        "args": [
          "s"
        ],
        "template": "function solveQ1(s) {\n  // Write your code here\n  \n}",
        "story": "A parser receives code syntax and must validate bracket ordering matching. Check if string brackets are matched.",
        "constraints": "1 <= s.length <= 10^3",
        "inputFormat": "A string s",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "s = '()[]{}'",
            "output": "true",
            "explanation": "Brackets matched."
          }
        ],
        "edgeCases": [
          "empty string"
        ],
        "bruteForce": "Replace pairs iteratively.",
        "optimalSolution": "function solveQ1(s) {\n  const stack = [];\n  for(const c of s) {\n    if(c === '(') stack.push(')');\n    else if(c === '[') stack.push(']');\n    else if(c === '{') stack.push('}');\n    else if(stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}",
        "editorial": "Standard bracket matching using a Stack structure.",
        "testCases": [
          {
            "args": [
              "()[]{}"
            ],
            "expected": true
          },
          {
            "args": [
              "([)]"
            ],
            "expected": false
          }
        ],
        "interviewDiscussion": [
          "Explain Stack constraints.",
          "Can it be optimized in space if only 1 type of bracket? Yes, counter."
        ],
        "topics": [
          "Stack",
          "Strings"
        ]
      },
      {
        "mockId": "mock-9",
        "qIndex": 2,
        "id": "mock-9-q2",
        "title": "Infosys SP Mock 9 Q2",
        "difficulty": "Medium",
        "pattern": "BFS Grid",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "solveQ2",
        "args": [
          "grid"
        ],
        "template": "function solveQ2(grid) {\n  // Write your code here\n  \n}",
        "story": "You are simulating virus propagation in a server farm represented by a grid. 2 is infected, 1 is clean, 0 is empty. Find time to infect all.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "A 2D array grid",
        "outputFormat": "int cycles count",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "Virus takes 4 cycles to cover."
          }
        ],
        "edgeCases": [
          "Already fully infected"
        ],
        "bruteForce": "Scan grid iteratively and infect adjacent ones in cycles.",
        "optimalSolution": "function solveQ2(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Standard multi-source BFS simulation on grid cells.",
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
          },
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1
                ],
                [
                  1,
                  0,
                  1
                ]
              ]
            ],
            "expected": -1
          }
        ],
        "interviewDiscussion": [
          "Explain why BFS is better than DFS here.",
          "What is the time complexity in worst case?"
        ],
        "topics": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-9",
        "qIndex": 3,
        "id": "mock-9-q3",
        "title": "Infosys SP Mock 9 Q3",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 40,
        "timeComplexity": "O(N^3)",
        "spaceComplexity": "O(N^2)",
        "functionName": "solveQ3",
        "args": [
          "nums"
        ],
        "template": "function solveQ3(nums) {\n  // Write your code here\n  \n}",
        "story": "You are analyzing partition costs for contiguous elements. The cost of a partition is product of boundaries. Find minimum cost.",
        "constraints": "1 <= nums.length <= 100",
        "inputFormat": "An array of numbers",
        "outputFormat": "min cost",
        "examples": [
          {
            "input": "nums = [1, 2, 3]",
            "output": "6",
            "explanation": "Minimal partition multiplication is 6."
          }
        ],
        "edgeCases": [
          "small arrays"
        ],
        "bruteForce": "Try all brackets positions recursively.",
        "optimalSolution": "function solveQ3(nums) {\n  const n = nums.length;\n  const dp = Array(n).fill(0).map(() => Array(n).fill(0));\n  for(let len=2; len<n; len++) {\n    for(let i=0; i<n-len; i++) {\n      const j = i + len;\n      dp[i][j] = Infinity;\n      for(let k=i+1; k<j; k++) {\n        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);\n      }\n    }\n  }\n  return dp[0][n-1];\n}",
        "editorial": "Matrix Chain Multiplication pattern using interval dynamic programming.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              [
                10,
                20,
                30,
                40
              ]
            ],
            "expected": 18000
          }
        ],
        "interviewDiscussion": [
          "Explain interval DP recurrence.",
          "What is the optimal space complexity?"
        ],
        "topics": [
          "Dynamic Programming",
          "Intervals"
        ]
      }
    ]
  },
  {
    "id": "mock-10",
    "name": "Infosys SP Mock 10 (Advanced Edit Distance & Catalan Series)",
    "duration": 180,
    "questions": [
      {
        "mockId": "mock-10",
        "qIndex": 1,
        "id": "mock-10-q1",
        "title": "Infosys SP Mock 10 Q1",
        "difficulty": "Easy",
        "pattern": "String Stack",
        "expectedTime": 20,
        "timeComplexity": "O(N)",
        "spaceComplexity": "O(N)",
        "functionName": "solveQ1",
        "args": [
          "s"
        ],
        "template": "function solveQ1(s) {\n  // Write your code here\n  \n}",
        "story": "A parser receives code syntax and must validate bracket ordering matching. Check if string brackets are matched.",
        "constraints": "1 <= s.length <= 10^3",
        "inputFormat": "A string s",
        "outputFormat": "boolean",
        "examples": [
          {
            "input": "s = '()[]{}'",
            "output": "true",
            "explanation": "Brackets matched."
          }
        ],
        "edgeCases": [
          "empty string"
        ],
        "bruteForce": "Replace pairs iteratively.",
        "optimalSolution": "function solveQ1(s) {\n  const stack = [];\n  for(const c of s) {\n    if(c === '(') stack.push(')');\n    else if(c === '[') stack.push(']');\n    else if(c === '{') stack.push('}');\n    else if(stack.pop() !== c) return false;\n  }\n  return stack.length === 0;\n}",
        "editorial": "Standard bracket matching using a Stack structure.",
        "testCases": [
          {
            "args": [
              "()[]{}"
            ],
            "expected": true
          },
          {
            "args": [
              "([)]"
            ],
            "expected": false
          }
        ],
        "interviewDiscussion": [
          "Explain Stack constraints.",
          "Can it be optimized in space if only 1 type of bracket? Yes, counter."
        ],
        "topics": [
          "Stack",
          "Strings"
        ]
      },
      {
        "mockId": "mock-10",
        "qIndex": 2,
        "id": "mock-10-q2",
        "title": "Infosys SP Mock 10 Q2",
        "difficulty": "Medium",
        "pattern": "BFS Grid",
        "expectedTime": 30,
        "timeComplexity": "O(N*M)",
        "spaceComplexity": "O(N*M)",
        "functionName": "solveQ2",
        "args": [
          "grid"
        ],
        "template": "function solveQ2(grid) {\n  // Write your code here\n  \n}",
        "story": "You are simulating virus propagation in a server farm represented by a grid. 2 is infected, 1 is clean, 0 is empty. Find time to infect all.",
        "constraints": "1 <= grid.length <= 50",
        "inputFormat": "A 2D array grid",
        "outputFormat": "int cycles count",
        "examples": [
          {
            "input": "grid = [[2,1,1],[1,1,0],[0,1,1]]",
            "output": "4",
            "explanation": "Virus takes 4 cycles to cover."
          }
        ],
        "edgeCases": [
          "Already fully infected"
        ],
        "bruteForce": "Scan grid iteratively and infect adjacent ones in cycles.",
        "optimalSolution": "function solveQ2(grid) {\n  const q = [];\n  let fresh = 0;\n  const r = grid.length, c = grid[0].length;\n  for(let i=0; i<r; i++) {\n    for(let j=0; j<c; j++) {\n      if(grid[i][j] === 2) q.push([i, j, 0]);\n      else if(grid[i][j] === 1) fresh++;\n    }\n  }\n  let maxTime = 0;\n  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];\n  while(q.length > 0) {\n    const [x, y, t] = q.shift();\n    maxTime = Math.max(maxTime, t);\n    for(const [dx, dy] of dirs) {\n      const nx = x + dx, ny = y + dy;\n      if(nx>=0 && nx<r && ny>=0 && ny<c && grid[nx][ny] === 1) {\n        grid[nx][ny] = 2;\n        fresh--;\n        q.push([nx, ny, t + 1]);\n      }\n    }\n  }\n  return fresh === 0 ? maxTime : -1;\n}",
        "editorial": "Standard multi-source BFS simulation on grid cells.",
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
          },
          {
            "args": [
              [
                [
                  2,
                  1,
                  1
                ],
                [
                  0,
                  1,
                  1
                ],
                [
                  1,
                  0,
                  1
                ]
              ]
            ],
            "expected": -1
          }
        ],
        "interviewDiscussion": [
          "Explain why BFS is better than DFS here.",
          "What is the time complexity in worst case?"
        ],
        "topics": [
          "Graphs",
          "BFS"
        ]
      },
      {
        "mockId": "mock-10",
        "qIndex": 3,
        "id": "mock-10-q3",
        "title": "Infosys SP Mock 10 Q3",
        "difficulty": "Hard",
        "pattern": "DP Partition",
        "expectedTime": 40,
        "timeComplexity": "O(N^3)",
        "spaceComplexity": "O(N^2)",
        "functionName": "solveQ3",
        "args": [
          "nums"
        ],
        "template": "function solveQ3(nums) {\n  // Write your code here\n  \n}",
        "story": "You are analyzing partition costs for contiguous elements. The cost of a partition is product of boundaries. Find minimum cost.",
        "constraints": "1 <= nums.length <= 100",
        "inputFormat": "An array of numbers",
        "outputFormat": "min cost",
        "examples": [
          {
            "input": "nums = [1, 2, 3]",
            "output": "6",
            "explanation": "Minimal partition multiplication is 6."
          }
        ],
        "edgeCases": [
          "small arrays"
        ],
        "bruteForce": "Try all brackets positions recursively.",
        "optimalSolution": "function solveQ3(nums) {\n  const n = nums.length;\n  const dp = Array(n).fill(0).map(() => Array(n).fill(0));\n  for(let len=2; len<n; len++) {\n    for(let i=0; i<n-len; i++) {\n      const j = i + len;\n      dp[i][j] = Infinity;\n      for(let k=i+1; k<j; k++) {\n        dp[i][j] = Math.min(dp[i][j], dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]);\n      }\n    }\n  }\n  return dp[0][n-1];\n}",
        "editorial": "Matrix Chain Multiplication pattern using interval dynamic programming.",
        "testCases": [
          {
            "args": [
              [
                1,
                2,
                3
              ]
            ],
            "expected": 6
          },
          {
            "args": [
              [
                10,
                20,
                30,
                40
              ]
            ],
            "expected": 18000
          }
        ],
        "interviewDiscussion": [
          "Explain interval DP recurrence.",
          "What is the optimal space complexity?"
        ],
        "topics": [
          "Dynamic Programming",
          "Intervals"
        ]
      }
    ]
  }
];
