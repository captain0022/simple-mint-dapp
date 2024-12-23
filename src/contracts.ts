export const wagmiContractConfig = {
  address: '0xea82efE3b78916Fd4d0f834f3bcf7cDD90Ed12F8',
  abi: [
    {
      type: 'function',
      name: 'balanceOf',
      stateMutability: 'view',
      inputs: [{ name: 'account', type: 'address' }],
      outputs: [{ type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'totalSupply',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ name: 'supply', type: 'uint256' }],
    },
  ],
} as const;
