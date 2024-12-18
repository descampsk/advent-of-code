/* eslint-disable default-param-last */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable max-classes-per-file */
export interface DijkstraNode {
  cost: number;
  getKey(): string | number; // Unique identifier for the node state
}

class MinHeap<T extends DijkstraNode> {
  private heap: T[];

  private readonly compare: (a: T, b: T) => number;

  private capacity: number;

  constructor(
    initialCapacity = 1024,
    compareFunction?: (a: T, b: T) => number,
  ) {
    this.heap = new Array(initialCapacity);
    this.capacity = 0;
    this.compare = compareFunction ?? ((a, b) => a.cost - b.cost);
  }

  push(val: T): void {
    this.heap[this.capacity] = val;
    this.bubbleUp(this.capacity++);
  }

  pop(): T | undefined {
    if (this.capacity === 0) return undefined;

    const result = this.heap[0];
    this.capacity--;

    if (this.capacity > 0) {
      this.heap[0] = this.heap[this.capacity];
      this.bubbleDown(0);
    }

    return result;
  }

  peek(): T | undefined {
    return this.capacity > 0 ? this.heap[0] : undefined;
  }

  clear(): void {
    this.capacity = 0;
  }

  private bubbleUp(index: number): void {
    const item = this.heap[index];

    while (index > 0) {
      const parentIndex = (index - 1) >> 1;
      const parent = this.heap[parentIndex];

      if (this.compare(parent, item) <= 0) break;

      this.heap[index] = parent;
      index = parentIndex;
    }

    this.heap[index] = item;
  }

  private bubbleDown(index: number): void {
    const item = this.heap[index];
    const halfLength = this.capacity >> 1;

    while (index < halfLength) {
      let bestIndex = (index << 1) + 1;
      let bestChild = this.heap[bestIndex];

      const rightIndex = bestIndex + 1;
      if (rightIndex < this.capacity) {
        const rightChild = this.heap[rightIndex];
        if (this.compare(rightChild, bestChild) < 0) {
          bestIndex = rightIndex;
          bestChild = rightChild;
        }
      }

      if (this.compare(item, bestChild) <= 0) break;

      this.heap[index] = bestChild;
      index = bestIndex;
    }

    this.heap[index] = item;
  }

  get length(): number {
    return this.capacity;
  }
}

export class Dijkstra<T extends DijkstraNode> {
  private queue: MinHeap<T>;

  private visited: Set<string | number>;

  constructor() {
    this.queue = new MinHeap<T>();
    this.visited = new Set();
  }

  findShortestPath(
    startNodes: T[],
    isDestination: (node: T) => boolean,
    getNextNodes: (node: T) => T[],
  ): T | undefined {
    this.queue = new MinHeap<T>();
    this.visited = new Set();

    // Initialize with start nodes
    startNodes.forEach((node) => this.queue.push(node));

    while (this.queue.length > 0) {
      const current = this.queue.pop()!;

      if (isDestination(current)) {
        return current;
      }

      const stateKey = current.getKey();
      if (this.visited.has(stateKey)) continue;
      this.visited.add(stateKey);

      // Get and process next possible nodes
      const nextNodes = getNextNodes(current);
      for (const node of nextNodes) {
        if (!this.visited.has(node.getKey())) {
          this.queue.push(node);
        }
      }
    }

    return undefined;
  }
}
