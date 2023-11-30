interface EthernetFrame {
  macDestination: string;
  macSource: string;
  vlanTag?: {
    priority: number;
    cfi: number;
    vlanId: number;
  };
  etherType: string;
  payload: Buffer;
}

interface InternetPackage {
  version: string;
  totalLength: string;
  protocol: IPProtocol;
  ttl: string;
  ipSource: string;
  ipDestination: string;
  options: string;
  payload: Buffer;
}

enum NetworkProtocol {
  "IPv4",
  "IPv6",
}

enum IPProtocol {
  TCP = 6,
  UDP = 17,
}

export { EthernetFrame, InternetPackage, IPProtocol };
