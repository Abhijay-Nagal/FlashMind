import type { RawTopic } from '../../api/generate';
import type { Deck } from '../types/deck';
import { toTopic } from '../lib/deckBuild';
import { uid } from '../lib/util';
import { actions, getState } from '../lib/store';

/**
 * A real deck produced by the FlashMind pipeline from a 7-page lecture-notes PDF
 * ("Computer Networks – Unit 1"). Lets new users try the gestures instantly.
 */
/** the text of the original 7-page PDF, used for the "From your PDF" source quotes */
const PAGES: string[] = [
  "Introduction to Computer Networks\nA computer network is a set of interconnected autonomous devices that exchange data using shared protocols. Networks are classified by scale: a Personal Area Network (PAN) spans a few metres, a Local Area Network (LAN) covers a building or campus, a Metropolitan Area Network (MAN) covers a city, and a Wide Area Network (WAN) spans countries. The Internet is a network of networks connected by routers.\nNetwork topologies describe how nodes are arranged. In a bus topology all nodes share one cable, so a break disables the network. A star topology connects every node to a central switch; it is easy to manage but the switch is a single point of failure. A mesh topology provides redundant paths and high reliability at a high cabling cost. A ring topology passes data around a loop in one direction.",
  "The OSI Reference Model\nThe Open Systems Interconnection (OSI) model, published by ISO in 1984, divides communication into seven layers: Physical, Data Link, Network, Transport, Session, Presentation and Application. Each layer provides services to the layer above and uses services of the layer below. This separation lets engineers change one layer without redesigning the others.\nThe Physical layer transmits raw bits over a medium such as copper, fibre or radio. The Data Link layer groups bits into frames, uses MAC addresses and detects errors with a cyclic redundancy check (CRC). The Network layer routes packets between networks using logical addresses such as IP addresses. The Transport layer provides end-to-end delivery, segmentation and flow control.\nEncapsulation is the process in which each layer adds its own header to the data received from the layer above. At the receiver, headers are removed in reverse order, a process called decapsulation. The unit of data is called a frame at layer 2, a packet at layer 3 and a segment at layer 4.",
  "The TCP/IP Model and Transport Protocols\nThe TCP/IP model is the practical model used on the Internet and has four layers: Link, Internet, Transport and Application. The Internet Protocol (IP) is connectionless and best-effort: it does not guarantee delivery or order.\nThe Transmission Control Protocol (TCP) is connection-oriented. It establishes a connection using a three-way handshake: the client sends SYN, the server replies with SYN-ACK and the client answers with ACK. TCP guarantees reliable, ordered delivery using sequence numbers, acknowledgements and retransmission of lost segments. TCP flow control uses a sliding window so a fast sender does not overwhelm a slow receiver, and congestion control reduces the sending rate when the network is congested, for example with slow start.\nThe User Datagram Protocol (UDP) is connectionless and has only an 8-byte header. It offers no reliability or ordering, which makes it faster and suitable for real-time applications such as video calls, online games and DNS queries, where a late packet is useless.",
  "IP Addressing and Subnetting\nAn IPv4 address is 32 bits long, written as four decimal octets, for example 192.168.1.10. IPv4 provides about 4.3 billion addresses, which has led to exhaustion. IPv6 uses 128-bit addresses written in hexadecimal and provides a vastly larger address space.\nSubnetting divides a network into smaller subnetworks. A subnet mask such as 255.255.255.0, written /24 in CIDR notation, indicates that the first 24 bits identify the network and the remaining 8 bits identify hosts. A /24 network has 256 addresses, of which 254 are usable because the network address and the broadcast address are reserved.\nNetwork Address Translation (NAT) lets many devices on a private network share one public IP address. Private address ranges include 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. The Dynamic Host Configuration Protocol (DHCP) automatically assigns IP addresses to hosts when they join a network.",
  "Routing and Switching\nA switch operates at the Data Link layer and forwards frames inside a LAN using a MAC address table that it learns from the source address of incoming frames. A router operates at the Network layer and forwards packets between different networks by looking up the destination IP address in its routing table.\nStatic routing uses routes configured manually by an administrator; it is simple and secure but does not adapt to failures. Dynamic routing protocols let routers exchange information automatically. Distance-vector protocols such as RIP choose the path with the fewest hops and share their whole table with neighbours periodically. Link-state protocols such as OSPF build a complete map of the network and compute shortest paths with Dijkstra's algorithm, converging faster after a change.\nBetween organisations on the Internet, the Border Gateway Protocol (BGP) exchanges reachability information between autonomous systems and selects paths based on policies rather than only on distance.",
  "Application Layer Protocols\nThe Domain Name System (DNS) translates human-readable names such as example.com into IP addresses. A resolver first checks its cache and otherwise queries root servers, then top-level-domain servers, and finally the authoritative server for the domain. DNS normally uses UDP port 53.\nThe Hypertext Transfer Protocol (HTTP) is a request-response protocol used by the web. A client sends a request with a method such as GET or POST, and the server replies with a status code: 200 means OK, 404 means Not Found and 500 means Internal Server Error. HTTP is stateless, so websites use cookies to remember users between requests. HTTPS is HTTP secured with TLS, which encrypts traffic and authenticates the server using certificates.\nEmail uses SMTP to send messages between mail servers, while IMAP and POP3 let clients retrieve mail; IMAP keeps messages on the server and synchronises folders across devices.",
  "Network Security Basics\nSecurity goals are often summarised as the CIA triad: confidentiality, integrity and availability. A firewall filters traffic according to rules; a stateful firewall tracks connections and only allows return traffic for sessions that were started from inside.\nSymmetric encryption uses the same secret key to encrypt and decrypt and is fast, for example AES. Asymmetric encryption uses a public key to encrypt and a private key to decrypt, as in RSA; it solves key distribution but is slower, so TLS uses asymmetric cryptography to agree on a symmetric session key.\nA denial-of-service (DoS) attack overwhelms a service so legitimate users cannot reach it, harming availability. In a distributed denial-of-service (DDoS) attack the traffic comes from many compromised machines called a botnet. A man-in-the-middle attack secretly intercepts communication between two parties; encryption and certificate checking defend against it."
];

const TOPICS: RawTopic[] = [
  {
    "title": "Network Scales & Topologies",
    "emoji": "📡",
    "cards": [
      {
        "title": "Network Scale Categories",
        "body": "Networks are classified by geographic scope: PAN (a few metres), LAN (building or campus), MAN (city), WAN (countries or globe).",
        "kind": "core",
        "page": 1,
        "quiz": {
          "question": "Which network type covers a whole city?",
          "options": [
            "PAN",
            "LAN",
            "MAN",
            "WAN"
          ],
          "answer": 2,
          "explanation": "MAN stands for Metropolitan Area Network, which spans a city."
        }
      },
      {
        "title": "Bus Topology Characteristics",
        "body": "In a bus topology all nodes share a single cable; a break in the cable disables the entire network.",
        "kind": "detail",
        "page": 1,
        "quiz": {
          "question": "What happens if the cable fails in a bus topology?",
          "options": [
            "Only one node loses connection",
            "All nodes lose connection",
            "Network reroutes automatically",
            "Performance improves"
          ],
          "answer": 1,
          "explanation": "A single cable break disables the whole bus network."
        }
      },
      {
        "title": "Star vs Mesh Trade-offs",
        "body": "Star topology centralizes management but has a single point of failure; mesh offers redundant paths and high reliability at higher cabling cost.",
        "kind": "comparison",
        "page": 1,
        "quiz": {
          "question": "Which topology provides redundancy but costs more cabling?",
          "options": [
            "Star",
            "Bus",
            "Ring",
            "Mesh"
          ],
          "answer": 3,
          "explanation": "Mesh topology adds multiple links for redundancy, increasing cabling expense."
        }
      }
    ]
  },
  {
    "title": "OSI Model & Encapsulation",
    "emoji": "🧩",
    "cards": [
      {
        "title": "Seven OSI Layers",
        "body": "The OSI model defines seven layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application, each serving the one above.",
        "kind": "core",
        "page": 2,
        "quiz": {
          "question": "How many layers are in the OSI model?",
          "options": [
            "5",
            "6",
            "7",
            "8"
          ],
          "answer": 2,
          "explanation": "The OSI model consists of seven distinct layers."
        }
      },
      {
        "title": "Encapsulation Process",
        "body": "Encapsulation adds a header at each OSI layer to the data from the layer above, creating frames, packets, and segments.",
        "kind": "detail",
        "page": 2,
        "quiz": {
          "question": "What is added to data at each OSI layer?",
          "options": [
            "Footer",
            "Header",
            "Checksum",
            "Payload"
          ],
          "answer": 1,
          "explanation": "Each layer adds its own header during encapsulation."
        }
      },
      {
        "title": "Decapsulation at Receiver",
        "body": "At the receiving end, headers are removed in reverse order, a process called decapsulation, restoring the original data.",
        "kind": "application",
        "page": 2,
        "quiz": {
          "question": "What term describes removing headers at the receiver?",
          "options": [
            "Encapsulation",
            "Fragmentation",
            "Decapsulation",
            "Multiplexing"
          ],
          "answer": 2,
          "explanation": "Decapsulation removes headers in reverse order."
        }
      }
    ]
  },
  {
    "title": "TCP/IP Model & Transport Protocols",
    "emoji": "🚀",
    "cards": [
      {
        "title": "Four TCP/IP Layers",
        "body": "The TCP/IP model used on the Internet has four layers: Link, Internet, Transport, and Application.",
        "kind": "core",
        "page": 3,
        "quiz": {
          "question": "Which layer is NOT part of the TCP/IP model?",
          "options": [
            "Link",
            "Session",
            "Transport",
            "Application"
          ],
          "answer": 1,
          "explanation": "Session is an OSI layer, not a separate TCP/IP layer."
        }
      },
      {
        "title": "TCP Three-Way Handshake",
        "body": "TCP establishes a connection with a three-way handshake: SYN from client, SYN-ACK from server, then ACK from client.",
        "kind": "detail",
        "page": 3,
        "quiz": {
          "question": "What is the second step in TCP's three-way handshake?",
          "options": [
            "Client sends SYN",
            "Server sends SYN-ACK",
            "Client sends ACK",
            "Server sends FIN"
          ],
          "answer": 1,
          "explanation": "After the client SYN, the server replies with SYN-ACK."
        }
      },
      {
        "title": "UDP Suitability for Real-Time",
        "body": "UDP has an 8-byte header, provides no reliability or ordering, and is ideal for real-time apps where delayed packets are useless.",
        "kind": "application",
        "page": 3,
        "quiz": {
          "question": "Why is UDP preferred for live video streams?",
          "options": [
            "It guarantees delivery",
            "It orders packets",
            "It has minimal overhead",
            "It encrypts data"
          ],
          "answer": 2,
          "explanation": "UDP's small header and lack of reliability make it faster for live media."
        }
      }
    ]
  },
  {
    "title": "IP Addressing, Subnetting & NAT",
    "emoji": "🗺️",
    "cards": [
      {
        "title": "IPv4 vs IPv6 Address Size",
        "body": "IPv4 uses 32-bit addresses (≈4.3 billion), while IPv6 uses 128-bit addresses, providing an enormously larger address space.",
        "kind": "core",
        "page": 4,
        "quiz": {
          "question": "How many bits are in an IPv6 address?",
          "options": [
            "32",
            "64",
            "128",
            "256"
          ],
          "answer": 2,
          "explanation": "IPv6 addresses are 128 bits long."
        }
      },
      {
        "title": "Subnet Mask /24 Meaning",
        "body": "A /24 subnet mask (255.255.255.0) reserves the first 24 bits for the network, leaving 8 bits for host addresses, yielding 254 usable hosts.",
        "kind": "detail",
        "page": 4,
        "quiz": {
          "question": "How many usable host addresses does a /24 subnet provide?",
          "options": [
            "256",
            "255",
            "254",
            "252"
          ],
          "answer": 2,
          "explanation": "Two addresses are reserved (network and broadcast), leaving 254 usable."
        }
      },
      {
        "title": "NAT Purpose and Private Ranges",
        "body": "Network Address Translation lets many private devices share one public IP; private ranges include 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.",
        "kind": "application",
        "page": 4,
        "quiz": {
          "question": "Which address block is NOT a private IPv4 range?",
          "options": [
            "10.0.0.0/8",
            "172.16.0.0/12",
            "192.168.0.0/16",
            "203.0.113.0/24"
          ],
          "answer": 3,
          "explanation": "203.0.113.0/24 is a public test address, not private."
        }
      }
    ]
  },
  {
    "title": "Routing and Switching",
    "emoji": "🔀",
    "cards": [
      {
        "title": "Switch vs Router Function",
        "body": "A switch forwards frames within a LAN using a MAC address table, while a router forwards packets between networks using an IP routing table.",
        "kind": "core",
        "page": 5,
        "quiz": {
          "question": "What does a switch use to forward frames?",
          "options": [
            "IP address table",
            "MAC address table",
            "Routing protocol",
            "Port numbers"
          ],
          "answer": 1,
          "explanation": "Switches rely on MAC address tables to decide where to send frames."
        }
      },
      {
        "title": "Static vs Dynamic Routing",
        "body": "Static routing is manually configured, simple and secure, but cannot adapt to failures; dynamic routing protocols automatically exchange routes to adjust to changes.",
        "kind": "detail",
        "page": 5,
        "quiz": {
          "question": "Which routing type adapts automatically to network changes?",
          "options": [
            "Static routing",
            "Manual routing",
            "Dynamic routing",
            "Fixed routing"
          ],
          "answer": 2,
          "explanation": "Dynamic routing protocols learn and update routes without manual intervention."
        }
      },
      {
        "title": "Distance-Vector vs Link-State",
        "body": "Distance-vector protocols like RIP choose paths with fewest hops and share full tables, while link-state protocols like OSPF map the whole network and run Dijkstra's algorithm for shortest paths.",
        "kind": "example",
        "page": 5,
        "quiz": {
          "question": "Which protocol uses Dijkstra's algorithm?",
          "options": [
            "RIP",
            "OSPF",
            "BGP",
            "EIGRP"
          ],
          "answer": 1,
          "explanation": "OSPF is a link-state protocol that computes shortest paths with Dijkstra's algorithm."
        }
      },
      {
        "title": "BGP Path Selection",
        "body": "The Border Gateway Protocol exchanges reachability between autonomous systems and selects routes based on policies, not just distance metrics.",
        "kind": "application",
        "page": 5,
        "quiz": {
          "question": "BGP selects paths primarily based on what?",
          "options": [
            "Hop count",
            "Link speed",
            "Administrative policies",
            "Latency"
          ],
          "answer": 2,
          "explanation": "BGP uses routing policies defined by operators to choose paths."
        }
      }
    ]
  },
  {
    "title": "Application Layer Protocols",
    "emoji": "🌐",
    "cards": [
      {
        "title": "DNS Name Resolution",
        "body": "The Domain Name System translates human-readable domain names to IP addresses, checking a local cache before querying root, TLD, and authoritative servers.",
        "kind": "core",
        "page": 6,
        "quiz": {
          "question": "What does DNS translate?",
          "options": [
            "IP to MAC",
            "MAC to IP",
            "Domain name to IP",
            "Port to service"
          ],
          "answer": 2,
          "explanation": "DNS maps domain names like example.com to their IP addresses."
        }
      },
      {
        "title": "HTTP Request-Response",
        "body": "HTTP is a stateless request-response protocol; clients send methods such as GET or POST and receive status codes like 200 (OK), 404 (Not Found), or 500 (Server Error).",
        "kind": "detail",
        "page": 6,
        "quiz": {
          "question": "Which HTTP status code means \"Not Found\"?",
          "options": [
            "200",
            "301",
            "404",
            "500"
          ],
          "answer": 2,
          "explanation": "404 is the standard code indicating the requested resource was not found."
        }
      },
      {
        "title": "HTTPS Security Layer",
        "body": "HTTPS adds TLS encryption to HTTP, protecting data in transit and authenticating the server with digital certificates.",
        "kind": "example",
        "page": 6,
        "quiz": {
          "question": "What does TLS provide for HTTPS?",
          "options": [
            "Routing",
            "Caching",
            "Encryption and authentication",
            "Compression"
          ],
          "answer": 2,
          "explanation": "TLS encrypts traffic and verifies the server’s identity via certificates."
        }
      },
      {
        "title": "Email Protocol Roles",
        "body": "SMTP transfers mail between servers, while IMAP and POP3 let clients retrieve messages; IMAP keeps mail on the server and syncs across devices.",
        "kind": "application",
        "page": 6,
        "quiz": {
          "question": "Which protocol stores email on the server for multi-device access?",
          "options": [
            "SMTP",
            "POP3",
            "IMAP",
            "FTP"
          ],
          "answer": 2,
          "explanation": "IMAP maintains messages on the server, enabling synchronization."
        }
      }
    ]
  },
  {
    "title": "Network Security Basics",
    "emoji": "🔒",
    "cards": [
      {
        "title": "CIA Security Triad",
        "body": "The core security goals are Confidentiality, Integrity, and Availability, often abbreviated as the CIA triad.",
        "kind": "core",
        "page": 7,
        "quiz": {
          "question": "What does the 'I' in CIA stand for?",
          "options": [
            "Isolation",
            "Integrity",
            "Interoperability",
            "Invisibility"
          ],
          "answer": 1,
          "explanation": "Integrity ensures data is accurate and unaltered."
        }
      },
      {
        "title": "Firewall Types",
        "body": "A basic firewall filters traffic by rules, while a stateful firewall tracks active connections and only permits return traffic for sessions it initiated.",
        "kind": "detail",
        "page": 7,
        "quiz": {
          "question": "What extra capability does a stateful firewall have?",
          "options": [
            "Encrypts traffic",
            "Tracks connection state",
            "Blocks all inbound traffic",
            "Performs DNS resolution"
          ],
          "answer": 1,
          "explanation": "Stateful firewalls monitor the state of connections to allow legitimate return packets."
        }
      },
      {
        "title": "Symmetric vs Asymmetric Encryption",
        "body": "Symmetric encryption (e.g., AES) uses one secret key and is fast; asymmetric encryption (e.g., RSA) uses a public/private key pair, solving key distribution but is slower.",
        "kind": "example",
        "page": 7,
        "quiz": {
          "question": "Which encryption type typically uses a single secret key?",
          "options": [
            "Asymmetric",
            "Public-key",
            "Symmetric",
            "Hashing"
          ],
          "answer": 2,
          "explanation": "Symmetric encryption relies on one shared secret key for both encryption and decryption."
        }
      },
      {
        "title": "DoS, DDoS, and MITM Defenses",
        "body": "DoS attacks flood a service to impair availability; DDoS uses many compromised machines (botnet). Man-in-the-middle attacks intercept communication, mitigated by encryption and certificate validation.",
        "kind": "application",
        "page": 7,
        "quiz": {
          "question": "What protects against man-in-the-middle attacks?",
          "options": [
            "Firewalls",
            "Encryption and certificate checking",
            "Static routing",
            "Port forwarding"
          ],
          "answer": 1,
          "explanation": "TLS encryption and proper certificate verification prevent unauthorized interception."
        }
      }
    ]
  }
];

export function createSampleDeck(): Deck {
  return {
    id: uid('sample'),
    title: 'Computer Networks Basics',
    subject: 'Networking',
    emoji: '🌐',
    sourceName: 'CN_Unit1_Lecture_Notes.pdf',
    pageCount: 7,
    createdAt: Date.now(),
    isSample: true,
    topics: TOPICS.map((t, i) => toTopic(t, i, { pages: PAGES, range: [1, PAGES.length] })),
  };
}

/** Adds the sample deck once; repeated taps reuse the existing one. */
export function ensureSampleDeck(): string {
  const existing = getState().decks.find((d) => d.isSample);
  if (existing) return existing.id;
  const d = createSampleDeck();
  actions.upsertDeck(d);
  actions.setFlag({ sampleAdded: true });
  return d.id;
}
