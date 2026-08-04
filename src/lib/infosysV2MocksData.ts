export interface MockTestCaseV2 {
  args: any[];
  expected: any;
}

export interface MockQuestionV2 {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  storyDescription: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  sampleInput: string;
  sampleOutput: string;
  args: string[];
  functionName: string;
  template: string;
  testCases: MockTestCaseV2[];
  hint: string;
  editorial: string;
  pattern: string;
}

export interface MockTestV2 {
  id: string;
  title: string;
  subtitle: string;
  targetRole: 'DSE' | 'SP L1' | 'SP L2' | 'SP L3';
  timeLimitMins: number;
  totalMarks: number;
  patternDistribution: string[];
  questions: MockQuestionV2[];
}

export const INFOSYS_V2_MOCK_TESTS: MockTestV2[] = Array.from({ length: 20 }, (_, idx) => {
  const mockNum = idx + 1;
  const role: 'DSE' | 'SP L1' | 'SP L2' | 'SP L3' = 
    mockNum <= 5 ? 'DSE' : mockNum <= 10 ? 'SP L1' : mockNum <= 15 ? 'SP L2' : 'SP L3';

  return {
    id: `v2-mock-${mockNum}`,
    title: `Infosys ${role} Official Campus Mock Test ${mockNum}`,
    subtitle: `2025-2026 Drive Pattern • 4 Story-Based OA Questions • 3 Hours Exam Simulator`,
    targetRole: role,
    timeLimitMins: 180,
    totalMarks: 100,
    patternDistribution: ['Arrays & Hashmap', 'Sliding Window / Two Pointer', 'Graph BFS/DFS Grid', 'Dynamic Programming / Monotonic Stack'],
    questions: [
      {
        id: `m${mockNum}-q1`,
        title: `Task ${mockNum}.1: Vardhaman Smart Campus WiFi Allocation`,
        difficulty: 'Easy',
        storyDescription: `The Vardhaman Campus IT Department is setting up WiFi access points. You are given an array of router signal strengths and a target required signal T. Find the 0-indexed indices of two routers whose combined signal equals T.`,
        inputFormat: `Array of integers \`signals\` and integer \`target\`.`,
        outputFormat: `Array of two indices [i, j].`,
        constraints: `2 <= signals.length <= 10^4, -10^9 <= signals[i] <= 10^9`,
        sampleInput: `signals = [2, 7, 11, 15], target = 9`,
        sampleOutput: `[0, 1]`,
        args: ['signals', 'target'],
        functionName: 'findRouterPair',
        template: `function findRouterPair(signals, target) {\n  // Write your code here\n  return [0, 1];\n}`,
        testCases: [
          { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { args: [[3, 2, 4], 6], expected: [1, 2] }
        ],
        hint: 'Use a hash map to store previously seen numbers and their indices in O(N).',
        editorial: 'Iterate through signals. Store map[signal] = index. If target - currentSignal exists in map, return indices.',
        pattern: '1. Arrays & HashMap'
      },
      {
        id: `m${mockNum}-q2`,
        title: `Task ${mockNum}.2: InfyTQ Logistics Warehouse Substring Window`,
        difficulty: 'Medium',
        storyDescription: `Infosys Mysore Development Center tracks automated warehouse robot movement codes encoded as a string S. Find the length of the longest contiguous sequence of movement codes without repeating characters.`,
        inputFormat: `String \`S\`.`,
        outputFormat: `Integer length.`,
        constraints: `0 <= S.length <= 5 * 10^4`,
        sampleInput: `S = "abcabcbb"`,
        sampleOutput: `3`,
        args: ['S'],
        functionName: 'longestCodeSequence',
        template: `function longestCodeSequence(S) {\n  // Write your code here\n  return 3;\n}`,
        testCases: [
          { args: ['abcabcbb'], expected: 3 },
          { args: ['bbbbb'], expected: 1 },
          { args: ['pwwkew'], expected: 3 }
        ],
        hint: 'Maintain a sliding window with left and right pointers and a character index map.',
        editorial: 'Expand right pointer. If S[right] seen inside window [left..right], update left = max(left, lastIndex + 1). Return max window length.',
        pattern: '5. Sliding Window'
      },
      {
        id: `m${mockNum}-q3`,
        title: `Task ${mockNum}.3: Smart City Cyber Security Grid Escape`,
        difficulty: 'Hard',
        storyDescription: `In an Infosys Smart City OA simulation, a hacker grid is represented as a 2D binary matrix where 1 represents safe firewalls and 0 represents infected nodes. Determine the number of isolated safe firewall clusters (islands).`,
        inputFormat: `2D array of character strings or 2D array of integers \`grid\`.`,
        outputFormat: `Integer total islands count.`,
        constraints: `1 <= grid.length, grid[0].length <= 300`,
        sampleInput: `grid = [\n  [1, 1, 1, 1, 0],\n  [1, 1, 0, 1, 0],\n  [1, 1, 0, 0, 0],\n  [0, 0, 0, 0, 0]\n]`,
        sampleOutput: `1`,
        args: ['grid'],
        functionName: 'countFirewallClusters',
        template: `function countFirewallClusters(grid) {\n  // Write your code here\n  return 1;\n}`,
        testCases: [
          {
            args: [[
              [1, 1, 1, 1, 0],
              [1, 1, 0, 1, 0],
              [1, 1, 0, 0, 0],
              [0, 0, 0, 0, 0]
            ]],
            expected: 1
          },
          {
            args: [[
              [1, 1, 0, 0, 0],
              [1, 1, 0, 0, 0],
              [0, 0, 1, 0, 0],
              [0, 0, 0, 1, 1]
            ]],
            expected: 3
          }
        ],
        hint: 'Use BFS or DFS grid traversal to visit and sink connected firewall cells.',
        editorial: 'Iterate over every cell. When cell value is 1, increment count and trigger DFS/BFS to turn all connected 1s to 0s.',
        pattern: '18. Graph'
      },
      {
        id: `m${mockNum}-q4`,
        title: `Task ${mockNum}.4: Infosys Cloud Server Energy Minimization`,
        difficulty: 'Very Hard',
        storyDescription: `You are optimizing Infosys Cloud Server cluster energy. You have coin denominations representing energy units. Return the minimum number of energy coins needed to reach exactly total energy amount A. If impossible, return -1.`,
        inputFormat: `Array of integers \`coins\` and integer \`amount\`.`,
        outputFormat: `Integer minimum coins.`,
        constraints: `1 <= coins.length <= 12, 1 <= coins[i] <= 2^31 - 1, 0 <= amount <= 10^4`,
        sampleInput: `coins = [1, 2, 5], amount = 11`,
        sampleOutput: `3`,
        args: ['coins', 'amount'],
        functionName: 'minEnergyCoins',
        template: `function minEnergyCoins(coins, amount) {\n  // Write your code here\n  return 3;\n}`,
        testCases: [
          { args: [[1, 2, 5], 11], expected: 3 },
          { args: [[2], 3], expected: -1 },
          { args: [[1], 0], expected: 0 }
        ],
        hint: 'Use bottom-up 1D dynamic programming initialized to Infinity.',
        editorial: 'dp[i] stores min coins for amount i. dp[i] = min(dp[i], 1 + dp[i - c]) for all c in coins.',
        pattern: '19. Dynamic Programming'
      }
    ]
  };
});
