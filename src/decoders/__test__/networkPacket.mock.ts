type NetworkGeneratorOptions = {
  version?: string;
  totalLength?: number;
  ttl?: number;
  protocol?: string;
  ipSource?: string;
  ipDestination?: string;
  payload?: string;
};

function generateFakeNetworkPacket(options: NetworkGeneratorOptions): Buffer {
  // Deconstruct options
  const {
    version,
    totalLength,
    ttl,
    protocol,
    ipSource,
    ipDestination,
    payload,
  } = options;

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const generateRandomIP = () => {
    const randomIpParts: number[] = [];
    for (let i = 0; i < 4; i++) {
      randomIpParts.push(getRandomNumber(0, 255));
    }

    return randomIpParts.join(".");
  };

  const sourceIP = ipSource ?? generateRandomIP();
  const destIP = ipDestination ?? generateRandomIP();
}

export { generateFakeNetworkPacket };
