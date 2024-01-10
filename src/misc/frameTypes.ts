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
  version: NetworkProtocol;
  totalLength: number;
  protocol: IPProtocol;
  ttl: number;
  ipSource: string;
  ipDestination: string;
  options: string;
  payload: Buffer;
}

enum NetworkProtocol {
  IPv4 = 4,
  IPv6 = 6,
}

enum IPProtocol {
  TCP = 6,
  UDP = 17,
}

export { EthernetFrame, NetworkProtocol, InternetPackage, IPProtocol };
