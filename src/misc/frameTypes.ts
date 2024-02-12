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
  ihl?: number;
  totalLength: number;
  protocol: IPProtocol;
  ttl: number;
  ipSource: string;
  ipDestination: string;
  options?: string;
  payload: Buffer;
}

enum NetworkProtocol {
  IPPrev4 = 0,
  IPv4 = 4,
  IST = 5,
  IPv6 = 6,
  TPIX = 7,
  IPv9 = 9,
}

enum IPProtocol {
  HOPOPT = 0,
  ICMP = 1,
  IGMP = 2,
  GGP = 3,
  IP_in_IP = 4,
  ST = 5,
  TCP = 6,
  CBT = 7,
  EGP = 8,
  IGP = 9,
  BBN_RCC_MON = 10,
  NVP_II = 11,
  PUP = 12,
  ARGUS = 13,
  EMCON = 14,
  XNET = 15,
  CHAOS = 16,
  UDP = 17,
  MUX = 18,
  DCN_MEAS = 19,
  HMP = 20,
  PRM = 21,
  XNS_IDP = 22,
  TRUNK_1 = 23,
  TRUNK_2 = 24,
  LEAF_1 = 25,
  LEAF_2 = 26,
  RDP = 27,
  IRTP = 28,
  ISO_TP4 = 29,
  NETBLT = 30,
  MFE_NSP = 31,
  MERIT_INP = 32,
  DCCP = 33,
  TPCP = 34,
  IDPR = 35,
  XTP = 36,
  DDP = 37,
  IDPR_CMTP = 38,
  TP_PLUSPLUS = 39,
  IL = 40,
  IPV6 = 41,
  SDRP = 42,
  IPV6_ROUTE = 43,
  IPV6_FRAG = 44,
  IDRP = 45,
  RSVP = 46,
  GRE = 47,
  DSR = 48,
  BNA = 49,
  ESP = 50,
  AH = 51,
  I_NLSP = 52,
  SWIPE = 53,
  NARP = 54,
  MOBILE = 55,
  TLSP = 56,
  SKIP = 57,
  IPV6_ICMP = 58,
  IPV6_NONXT = 59,
  IPV6_OPTS = 60,
  HOSTINTERNAL = 61,
  CFTP = 62,
  LOCALNETWORK = 63,
  SAT_EXPAK = 64,
  KRYPTOLAN = 65,
  RVD = 66,
  IPPC = 67,
  DISTRIBUTEDFS = 68,
  SAT_MON = 69,
  VISA = 70,
  IPCU = 71,
  CPNX = 72,
  CPHB = 73,
  WSN = 74,
  PVP = 75,
  BR_SAT_MON = 76,
  SUN_ND = 77,
  WB_MON = 78,
  WB_EXPAK = 79,
  ISO_IP = 80,
  VMTP = 81,
  SECURE_VMTP = 82,
  VINES = 83,
  IPTM = 84,
  NSFNET_IGP = 85,
  DGP = 86,
  TCF = 87,
  EIGRP = 88,
  OSPF = 89,
  SPRITE_RPC = 90,
  LARP = 91,
  MTP = 92,
  AX_25 = 93,
  OS = 94,
  MICP = 95,
  SCC_SP = 96,
  ETHERIP = 97,
  ENCAP = 98,
  PRIVATE_ENCRYPTION = 99,
  GMTP = 100,
  IFMP = 101,
  PNNI = 102,
  PIM = 103,
  ARIS = 104,
  SCPS = 105,
  QNX = 106,
  ACTIVE_NETWORKS = 107,
  IPCOMP = 108,
  SNP = 109,
  COMPAQ_PEER = 110,
  IPX_IN_IP = 111,
  VRRP = 112,
  PGM = 113,
  ZERO_HOP = 114,
  L2TP = 115,
  DDX = 116,
  IATP = 117,
  STP = 118,
  SRP = 119,
  UTI = 120,
  SMP = 121,
  SM = 122,
  PTP = 123,
  IS_IS_OVER_IPV4 = 124,
  FIRE = 125,
  CRTP = 126,
  CRUDP = 127,
  SSCOPMCE = 128,
  IPLT = 129,
  SPS = 130,
  PIPE = 131,
  SCTP = 132,
  FC = 133,
  RSVP_E2E_IGNORE = 134,
  MOBILITY_HEADER = 135,
  UDPLITE = 136,
  MPLS_IN_IP = 137,
  MANET = 138,
  HIP = 139,
  SHIM6 = 140,
  WESP = 141,
  ROCH = 142,
  ETHERNET = 143,
  AGGFRAG = 144,
  NSH = 145,
  RESERVED = 255,
}

export { EthernetFrame, NetworkProtocol, InternetPackage, IPProtocol };
