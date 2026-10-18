import { UserProfile, Category, Article, Comment, ArticleLike, Follow, VerificationRequest, ModerationLog } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-admin-1',
    email: 'dr.deshmukh@dypatil.edu',
    fullName: 'Dr. Anjali Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Associate Professor & Chief Editorial Head, Computer Engineering & AI at DYP. Researching distributed systems and trustworthy AI.',
    role: 'admin',
    verificationStatus: 'verified',
    studentId: 'DYP-FAC-0192',
    department: 'Computer Engineering & AI',
    technicalInterests: ['Distributed Systems', 'Formal Verification', 'AI Governance'],
    isInstitutionalEmail: true,
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'usr-student-1',
    email: 'rohit.sharma@dypatil.edu',
    fullName: 'Rohit Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Final-year B.Tech Computer Engineering. Open-source contributor to Raft implementations, building distributed databases.',
    role: 'student',
    verificationStatus: 'verified',
    studentId: 'DYP2022CS084',
    department: 'Computer Engineering',
    batchYear: 2026,
    technicalInterests: ['Distributed Systems', 'Go Programming', 'Database Internals'],
    isInstitutionalEmail: true,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'usr-student-2',
    email: 'priya.kulkarni@dypatil.edu',
    fullName: 'Priya Kulkarni',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    bio: 'Third-year Information Technology undergraduate. Cybersecurity researcher, CTF enthusiast, and zero-trust advocate.',
    role: 'student',
    verificationStatus: 'verified',
    studentId: 'DYP2023IT041',
    department: 'Information Technology',
    batchYear: 2027,
    technicalInterests: ['Cybersecurity', 'Zero Trust', 'Network Defense', 'Cryptography'],
    isInstitutionalEmail: true,
    createdAt: '2026-02-15T11:00:00Z',
    updatedAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'usr-student-3',
    email: 'tanmay.joshi@dypatil.edu',
    fullName: 'Tanmay Joshi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Second-year Electronics & Telecommunication engineer. Firmware architect at DYP Robotics Club, specializing in RISC-V edge silicon.',
    role: 'student',
    verificationStatus: 'verified',
    studentId: 'DYP2024ETC102',
    department: 'Electronics & Telecommunication',
    batchYear: 2028,
    technicalInterests: ['Electronics and IoT', 'RISC-V Architecture', 'Embedded C++', 'TinyML'],
    isInstitutionalEmail: true,
    createdAt: '2026-03-01T12:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'usr-student-4',
    email: 'sneha.patil.personal@gmail.com',
    fullName: 'Sneha Patil',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: 'B.Tech AI & Data Science student. Registered with personal email, submitted college ID card for institutional verification.',
    role: 'student',
    verificationStatus: 'pending',
    studentId: 'DYP2024AI018',
    department: 'Artificial Intelligence & Data Science',
    batchYear: 2028,
    technicalInterests: ['Machine Learning', 'Computer Vision', 'PyTorch'],
    isInstitutionalEmail: false,
    createdAt: '2026-10-10T14:30:00Z',
    updatedAt: '2026-10-10T14:30:00Z',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Machine learning algorithms, transformer architectures, LLM inference, and computer vision research.',
    isActive: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Data Science',
    slug: 'data-science',
    description: 'Statistical modeling, big data analytics, distributed data pipelines, and predictive algorithms.',
    isActive: true,
    displayOrder: 2,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-3',
    name: 'Software Engineering',
    slug: 'software-engineering',
    description: 'Distributed systems, system architecture, clean code principles, CI/CD, and testing methodologies.',
    isActive: true,
    displayOrder: 3,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-4',
    name: 'Web Development',
    slug: 'web-development',
    description: 'Modern full-stack frameworks, browser engines, WebAssembly, reactive state, and accessible web standards.',
    isActive: true,
    displayOrder: 4,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    name: 'Programming and Python',
    slug: 'programming-and-python',
    description: 'Algorithmic problem-solving, Python internals, systems programming, and high-performance concurrency.',
    isActive: true,
    displayOrder: 5,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-6',
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    description: 'Applied cryptography, penetration testing, network defense, threat modeling, and zero-trust engineering.',
    isActive: true,
    displayOrder: 6,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-7',
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'Kubernetes orchestration, serverless microservices, site reliability engineering (SRE), and cloud infrastructure.',
    isActive: true,
    displayOrder: 7,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-8',
    name: 'Electronics and IoT',
    slug: 'electronics-and-iot',
    description: 'Microcontroller architecture, embedded firmware, sensor telemetry, and hardware communication protocols.',
    isActive: true,
    displayOrder: 8,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'cat-9',
    name: 'Research and Innovation',
    slug: 'research-and-innovation',
    description: 'Peer-reviewed academic research, patent filings, undergraduate capstones, and scientific literature.',
    isActive: true,
    displayOrder: 9,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    authorId: 'usr-student-1',
    title: 'Demystifying Speculative Decoding for Edge LLMs: Latency Benchmarks on Consumer Silicon',
    slug: 'demystifying-speculative-decoding-for-edge-llms',
    summary: 'An empirical investigation into dual-model speculative decoding on Apple Silicon and Intel discrete GPUs, analyzing token throughput gains versus draft model rejection penalties.',
    content: `## Abstract & Motivation

Autoregressive transformer inference is fundamentally memory-bandwidth bound. Each token generation step requires transferring billions of model parameters across the memory bus to perform a matrix-vector product with a single batch element. While batching helps in cloud deployments, local edge deployment for campus research instruments cannot amortize this cost across concurrent requests.

Speculative decoding offers a compelling algorithmic alternative: use a lightweight "draft" model (e.g., a 1.5B parameter variant) to rapidly propose candidate token sequences, and use the target model (e.g., 8B or 14B) in a single parallelized forward pass to verify the predictions.

\`\`\`
[ User Prompt ]
       │
       ▼
┌──────────────────┐      Propose K tokens
│ Draft Model (1B) │ ──────────────────────────► [ t1, t2, t3, t4 ]
└──────────────────┘                                     │
                                                         ▼
                                               ┌────────────────────┐
                                               │ Target Model (8B)  │
                                               │ Parallel Verify    │
                                               └────────────────────┘
                                                         │
                                             Accept: [ t1, t2, t3 ]
                                             Reject: t4 -> Correct
\`\`\`

## Experimental Methodology

We constructed a localized benchmark harness using PyTorch 2.5 and Metal Performance Shaders (MPS) running on an Apple M3 Max unified memory architecture (36 GB unified RAM, 300 GB/s bandwidth), contrasted against an Intel Xeon workstation equipped with an RTX 4070 Ti (12 GB VRAM).

We paired the following model combinations:
1. **Target**: Llama-3.1-8B-Instruct (4-bit AWQ quantized)
2. **Draft**: Llama-3.2-1B-Instruct (FP16)

### Acceptance Rate Formulation

Let $q(x)$ denote the probability distribution of the draft model and $p(x)$ denote that of the target model. A candidate token $x$ proposed by the draft model is accepted with probability:

$$\\alpha = \\min\\left(1, \\frac{p(x)}{q(x)}\\right)$$

If accepted, the token is permanently appended to the sequence. When a proposed token is rejected, the target model's corrected distribution is sampled, and subsequent candidate tokens in the speculative window are discarded.

\`\`\`python
import torch

def verify_speculative_tokens(target_logits, draft_logits, proposed_tokens):
    """
    Validates proposed draft tokens against target model logits
    using the standard speculative decoding acceptance criterion.
    """
    accepted_tokens = []
    target_probs = torch.softmax(target_logits, dim=-1)
    draft_probs = torch.softmax(draft_logits, dim=-1)
    
    for i, token in enumerate(proposed_tokens):
        p = target_probs[0, i, token].item()
        q = draft_probs[0, i, token].item()
        
        ratio = p / max(q, 1e-8)
        acceptance_prob = min(1.0, ratio)
        
        if torch.rand(1).item() < acceptance_prob:
            accepted_tokens.append(token)
        else:
            # Resample from adjusted distribution
            residual_dist = torch.clamp(target_probs[0, i] - draft_probs[0, i], min=0)
            residual_dist = residual_dist / residual_dist.sum()
            corrected_token = torch.multinomial(residual_dist, 1).item()
            accepted_tokens.append(corrected_token)
            break # Discard remaining speculative branch
            
    return accepted_tokens
\`\`\`

## Results & Findings

Across standard academic benchmarks (GSM8k, HumanEval, and college lecture transcript summarization), the speculative pipeline achieved:
- **Mean Speculative Acceptance Rate**: 71.4%
- **End-to-End Latency Reduction**: 2.38x speedup on coding tasks
- **Peak Memory Consumption**: 6.8 GB combined VRAM, well within undergraduate lab hardware limits.

### Conclusion

Speculative decoding bridges the gap between desktop compute constraints and production-quality research inference. We recommend college labs adopt dual-draft setups for technical document analysis and automated grading tooling.`,
    categoryId: 'cat-1',
    tags: ['Machine Learning', 'Inference Optimization', 'LLMs', 'PyTorch'],
    coverImageUrl: '/src/assets/images/hero_techverse_magazine_1791975433144.jpg',
    status: 'published',
    readTimeMinutes: 10,
    publishedAt: '2026-10-02T08:00:00Z',
    viewsCount: 412,
    createdAt: '2026-09-28T14:00:00Z',
    updatedAt: '2026-10-02T08:00:00Z',
  },
  {
    id: 'art-2',
    authorId: 'usr-student-1',
    title: 'Architecting High-Throughput Raft Consensus in Go: Lessons from Campus Cluster Experiments',
    slug: 'architecting-high-throughput-raft-consensus-in-go',
    summary: 'A deep architectural dive into leader election stability, pipelined log replication, and batch snapshotting across a 5-node Raspberry Pi and x86 hybrid university cluster.',
    content: `## 1. Introduction to Consensus in Distributed State Machines

The Raft consensus protocol is renowned for its understandability relative to Multi-Paxos, yet implementing a resilient, high-throughput Raft engine reveals subtle edge cases in network partition handling and write serialization. In this project conducted at the DY Patil High-Performance Computing Laboratory, we developed a production-ready Raft library in Go and deployed it across a heterogeneous 5-node cluster.

\`\`\`
          ┌─────────────┐
          │   Leader    │ (Elected node 1)
          └──────┬──────┘
         AppendEntries RPC
          ┌──────┴──────┐
          ▼             ▼
   ┌─────────────┐ ┌─────────────┐
   │  Follower   │ │  Follower   │
   │   Node 2    │ │   Node 3    │
   └─────────────┘ └─────────────┘
\`\`\`

## 2. Pipelined AppendEntries and Concurrency

In a naive Raft implementation, the leader sends an \`AppendEntries\` RPC to each peer and waits synchronously for a majority of acks before submitting the next batch. On 1Gbps local switches with sub-millisecond ping, this round-trip overhead drastically throttles disk I/O utilization.

To achieve maximum saturation, we implemented **pipelined optimistic log replication**:

\`\`\`go
type RaftNode struct {
    mu        sync.RWMutex
    peers     map[int]*PeerClient
    currentTerm uint64
    votedFor    int
    log         []LogEntry
    commitIndex uint64
    lastApplied uint64
    
    // Pipelining state
    nextIndex  map[int]uint64
    matchIndex map[int]uint64
    pipelineCh map[int]chan *ReplicationBatch
}

func (r *RaftNode) replicateWorker(peerID int) {
    for batch := range r.pipelineCh[peerID] {
        reply, err := r.peers[peerID].AppendEntries(batch.Args)
        if err != nil {
            r.handleReplicationError(peerID, err)
            continue
        }
        r.processReplicationReply(peerID, reply)
    }
}
\`\`\`

## 3. Handling Asymmetric Network Partitions

A known limitation of vanilla Raft is the disruption caused by a partitioned node that cannot receive heartbeats from the leader. Such a node repeatedly times out, increments its term, and broadcasts \`RequestVote\` with an artificially inflated term. When the partition heals, the current legitimate leader is forced to step down immediately.

We solved this by implementing the **Pre-Vote phase** (as described by Ongaro):
- A candidate must first contact peers with a speculative Pre-Vote.
- Peers only grant the Pre-Vote if they have not received heartbeats from a valid leader within their election timeout window.

## 4. Empirical Evaluation

Using the Jepsen test suite customized for Go network emulations, our cluster maintained consistency under:
- Complete leader isolation (failover under 420ms)
- 30% packet drop rates with jitter
- Crash-recovery under simulated disk write stalls.

Published as open-source for fellow DYP engineering students.`,
    categoryId: 'cat-3',
    tags: ['Distributed Systems', 'Go', 'Raft Consensus', 'Networking'],
    coverImageUrl: '/src/assets/images/article_distributed_systems_1791975433559.jpg',
    status: 'published',
    readTimeMinutes: 7,
    publishedAt: '2026-10-06T11:30:00Z',
    viewsCount: 328,
    createdAt: '2026-10-04T09:00:00Z',
    updatedAt: '2026-10-06T11:30:00Z',
  },
  {
    id: 'art-3',
    authorId: 'usr-student-2',
    title: 'Zero-Trust Architecture for University Campus Networks: Microsegmentation and mTLS',
    slug: 'zero-trust-architecture-for-university-campus-networks',
    summary: 'Evaluating perimeter-less network defense for collegiate computational labs, implementing identity-based mutual TLS and ephemeral SPIFFE/SPIRE certificates to isolate student workloads.',
    content: `## The Fallacy of the Trusted Campus Intranet

Traditional university networks rely on perimeter firewall defense: once a device connects via campus Wi-Fi or laboratory Ethernet with valid credentials, it enjoys broad lateral access across subnetworks. In modern educational environments where students frequently experiment with penetration testing tools, custom firmware, and unpatched IoT nodes, this perimeter-based trust model is inherently fragile.

\`\`\`
[ Traditional Model ]
Internet ──► [ Perimeter Firewall ] ──► (Wide Open Trust Zone: Labs + Admin + Servers)

[ Zero-Trust Microsegmented Model ]
Untrusted Client ──► [ Identity Envoy Proxy ] ──► (Explicit mTLS per service)
                       ▲
                       │ SPIFFE/SPIRE
                 Attestation Authority
\`\`\`

## Core Zero-Trust Tenets

Our architecture enforces three foundational rules derived from NIST SP 800-207:
1. **Never Trust, Always Verify**: Network location (IP subnet) grants zero implicit trust.
2. **Least Privilege Enforcement**: Access is granted on a per-session, per-service basis via short-lived cryptographic tokens.
3. **Assume Breach**: Traffic between internal nodes is encrypted and audited in real time.

## Cryptographic Microsegmentation with SPIFFE/SPIRE

We deployed SPIRE (the SPIFFE Runtime Environment) on our department Kubernetes cluster. Every container workload receives an ephemeral SVID (SPIFFE Verifiable Identity Document) x509 certificate with a maximum lifetime of 1 hour.

\`\`\`yaml
apiVersion: spiffeid.org/v1beta1
kind: ClusterSPIFFEID
metadata:
  name: student-research-workload
spec:
  spiffeIDTemplate: "spiffe://dypatil.edu/dept/cs/student/{{ .PodMeta.Labels.studentId }}"
  podSelector:
    matchLabels:
      tier: research-lab
\`\`\`

When a student service in the robotics lab communicates with the shared GPU cluster, Envoy sidecars negotiate mutual TLS, validating that both endpoints have unrevoked, cryptographic identities issued by the campus CA.

## Threat Analysis & Findings

Simulating common campus network attack vectors:
- **Lateral ARP Spoofing**: Rendered ineffective because attackers cannot forge valid x509 SVIDs.
- **Port Scanning**: Unauthorized ports reject handshakes at the TLS layer without disclosing application banner data.
- **Credential Leakage**: Short-lived 1-hour certificates minimize window of vulnerability.

This blueprint is currently undergoing pilot review for university-wide infrastructure adoption.`,
    categoryId: 'cat-6',
    tags: ['Cybersecurity', 'Zero Trust', 'mTLS', 'Network Security', 'Cryptography'],
    coverImageUrl: '/src/assets/images/article_cybersecurity_zero_trust_1791975433507.jpg',
    status: 'published',
    readTimeMinutes: 8,
    publishedAt: '2026-10-09T14:15:00Z',
    viewsCount: 289,
    createdAt: '2026-10-07T16:00:00Z',
    updatedAt: '2026-10-09T14:15:00Z',
  },
  {
    id: 'art-4',
    authorId: 'usr-student-3',
    title: 'Real-Time Edge Inference on Low-Power RISC-V Microcontrollers Using TinyEngine',
    slug: 'real-time-edge-inference-on-low-power-risc-v-microcontrollers',
    summary: 'Porting custom 8-bit quantized convolutional models to open-source RISC-V RV32IMAF silicon, leveraging memory footprint trimming techniques to fit under 256KB SRAM constraints.',
    content: `## 1. The Microcontroller Memory Bottleneck

Running neural networks on standard microcontrollers like ARM Cortex-M or modern open-source RISC-V chips is severely constrained by on-chip SRAM, often restricted to 128KB–512KB. While Flash storage (ROM) might hold weights, the intermediate activation tensors during inference must reside in ultra-fast volatile SRAM.

In this project, we designed a gesture and audio acoustic classification pipeline for agricultural IoT sensors, deployed on a SiFive RISC-V board operating at 150 MHz.

\`\`\`
Raw Sensor ADC ──► DMA Ring Buffer ──► INT8 Conv Layer ──► MaxPool ──► Classification Output
                                         │
                             In-Place Memory Reuse
                             (Memory Buffer Ping-Pong)
\`\`\`

## 2. In-Place Tensor Memory Reuse (Ping-Pong Buffering)

Instead of allocating distinct memory buffers for every layer's activation output, we implemented an alternating two-buffer (ping-pong) memory pool:

\`\`\`c
// Memory footprint capped at maximum adjacent layer activation size
#define PEAK_LAYER_ACTIVATION_BYTES (48 * 1024)

static uint8_t g_tensor_arena_ping[PEAK_LAYER_ACTIVATION_BYTES] __attribute__((aligned(4)));
static uint8_t g_tensor_arena_pong[PEAK_LAYER_ACTIVATION_BYTES] __attribute__((aligned(4)));

void run_quantized_conv2d_fast(
    const int8_t* restrict input,
    const int8_t* restrict weights,
    const int32_t* restrict bias,
    int8_t* restrict output,
    const LayerDimensions* dims
) {
    // RISC-V vector acceleration using SIMD packing where available
    for (int out_y = 0; out_y < dims->out_height; out_y++) {
        for (int out_x = 0; out_x < dims->out_width; out_x++) {
            int32_t acc = bias[dims->channel];
            // Inner MAC loop optimized with loop unrolling
            #pragma GCC unroll 4
            for (int ky = 0; ky < dims->kernel_size; ky++) {
                for (int kx = 0; kx < dims->kernel_size; kx++) {
                    acc += (int32_t)input[...] * (int32_t)weights[...];
                }
            }
            output[...] = requantize_and_clamp(acc);
        }
    }
}
\`\`\`

## 3. Battery Life & Power Measurement

By pairing our 8-bit quantization with aggressive sleep states (waking the RISC-V core via external threshold interrupts from an ultra-low-power accelerometer), the overall sensor package draws:
- **Active Inference State**: 18.2 mA at 3.3V (~60 mW)
- **Deep Sleep State**: 4.1 microamperes
- **Estimated Operating Lifespan**: 3.2 years on a standard 2400 mAh Li-SOCl2 primary cell.

Complete firmware source code and board Gerber files are available for peer review in the university repo.`,
    categoryId: 'cat-8',
    tags: ['Electronics and IoT', 'RISC-V', 'Embedded C', 'TinyML', 'Edge Computing'],
    coverImageUrl: '/src/assets/images/article_iot_embedded_edge_1791975433737.jpg',
    status: 'published',
    readTimeMinutes: 6,
    publishedAt: '2026-10-12T16:45:00Z',
    viewsCount: 195,
    createdAt: '2026-10-11T10:00:00Z',
    updatedAt: '2026-10-12T16:45:00Z',
  },
  {
    id: 'art-5',
    authorId: 'usr-student-1',
    title: 'Optimizing Cache Invalidation in Next.js Server Components with Stale-While-Revalidate',
    slug: 'optimizing-cache-invalidation-in-nextjs-server-components',
    summary: 'A quantitative study on edge CDN cache hierarchies and tag-based revalidation strategies for high-frequency college portals.',
    content: `## Abstract

Full-stack web applications operating in academic environments experience sharp traffic spikes during registration, result publication, and conference submissions. This article examines server-side caching primitives...`,
    categoryId: 'cat-4',
    tags: ['Web Development', 'Next.js', 'Caching', 'Performance'],
    coverImageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    status: 'pending_review',
    readTimeMinutes: 5,
    viewsCount: 14,
    createdAt: '2026-10-13T10:00:00Z',
    updatedAt: '2026-10-13T10:00:00Z',
  },
  {
    id: 'art-6',
    authorId: 'usr-student-3',
    title: 'LoRaWAN Long-Range Mesh Topologies in Smart Agricultural Testbeds',
    slug: 'lorawan-long-range-mesh-topologies-in-smart-agricultural-testbeds',
    summary: 'Field deployment analysis of 868MHz LoRa radios across college farmland, evaluating packet delivery ratio under dense foliage.',
    content: `## Field Overview

Long range radio telemetry provides an economical medium for precision agriculture. In this study we deployed twelve sensor nodes across the DY Patil Agro-Tech campus...`,
    categoryId: 'cat-8',
    tags: ['Electronics and IoT', 'LoRaWAN', 'Telemetry', 'Mesh Networks'],
    status: 'changes_requested',
    changesFeedback: 'Please include empirical signal-to-noise ratio (SNR) measurements across varying foliage densities and cite the ITU propagation models in Section 3 before publication approval.',
    readTimeMinutes: 5,
    viewsCount: 8,
    createdAt: '2026-10-11T09:00:00Z',
    updatedAt: '2026-10-13T12:00:00Z',
  },
  {
    id: 'art-7',
    authorId: 'usr-student-1',
    title: 'Comparative Analysis of eBPF vs Kernel Modules for High-Speed Packet Filtering',
    slug: 'comparative-analysis-of-ebpf-vs-kernel-modules',
    summary: 'Draft research testing XDP program execution times against classic netfilter iptables rules.',
    content: `## Working Draft: eBPF Performance Benchmarks

This is a draft article exploring extended Berkeley Packet Filters for high speed packet capture in university network labs...`,
    categoryId: 'cat-6',
    tags: ['Cybersecurity', 'eBPF', 'Linux Kernel', 'Networking'],
    status: 'draft',
    readTimeMinutes: 4,
    viewsCount: 0,
    createdAt: '2026-10-14T01:00:00Z',
    updatedAt: '2026-10-14T01:00:00Z',
  }
];

export const INITIAL_LIKES: ArticleLike[] = [
  { id: 'like-1', articleId: 'art-1', userId: 'usr-student-2', createdAt: '2026-10-03T10:00:00Z' },
  { id: 'like-2', articleId: 'art-1', userId: 'usr-student-3', createdAt: '2026-10-04T12:00:00Z' },
  { id: 'like-3', articleId: 'art-1', userId: 'usr-admin-1', createdAt: '2026-10-05T09:00:00Z' },
  { id: 'like-4', articleId: 'art-2', userId: 'usr-student-2', createdAt: '2026-10-07T14:00:00Z' },
  { id: 'like-5', articleId: 'art-2', userId: 'usr-student-3', createdAt: '2026-10-08T15:00:00Z' },
  { id: 'like-6', articleId: 'art-3', userId: 'usr-student-1', createdAt: '2026-10-10T11:00:00Z' },
  { id: 'like-7', articleId: 'art-4', userId: 'usr-student-1', createdAt: '2026-10-13T09:00:00Z' },
  { id: 'like-8', articleId: 'art-4', userId: 'usr-student-2', createdAt: '2026-10-13T10:30:00Z' },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    articleId: 'art-1',
    userId: 'usr-student-2',
    content: 'Brilliant analysis on the acceptance rate formulation! Did you observe any drift in acceptance probability when switching from programming prompts to unstructured creative writing?',
    isHidden: false,
    reportCount: 0,
    createdAt: '2026-10-03T11:15:00Z',
    updatedAt: '2026-10-03T11:15:00Z',
  },
  {
    id: 'comm-2',
    articleId: 'art-1',
    userId: 'usr-student-1',
    content: 'Great question Priya! Yes, for unstructured natural language, the entropy of the probability distribution increases, which caused the draft acceptance rate to drop from ~71% down to around 52%. Still yielded a ~1.6x overall speedup over pure target autoregression.',
    isHidden: false,
    reportCount: 0,
    createdAt: '2026-10-03T11:45:00Z',
    updatedAt: '2026-10-03T11:45:00Z',
  },
  {
    id: 'comm-3',
    articleId: 'art-2',
    userId: 'usr-admin-1',
    content: 'Commendable implementation of the Pre-Vote phase. This will serve as a foundational reference for the upcoming Semester 7 Distributed Computing curriculum.',
    isHidden: false,
    reportCount: 0,
    createdAt: '2026-10-07T16:00:00Z',
    updatedAt: '2026-10-07T16:00:00Z',
  },
  {
    id: 'comm-4',
    articleId: 'art-3',
    userId: 'usr-student-3',
    content: 'Excellent point regarding ephemeral SVIDs. Have you tested certificate rotation overhead on constrained IoT nodes that lack hardware cryptographic acceleration?',
    isHidden: false,
    reportCount: 0,
    createdAt: '2026-10-10T14:20:00Z',
    updatedAt: '2026-10-10T14:20:00Z',
  }
];

export const INITIAL_FOLLOWS: Follow[] = [
  { id: 'fol-1', followerId: 'usr-student-2', followingId: 'usr-student-1', createdAt: '2026-10-01T09:00:00Z' },
  { id: 'fol-2', followerId: 'usr-student-3', followingId: 'usr-student-1', createdAt: '2026-10-02T10:00:00Z' },
  { id: 'fol-3', followerId: 'usr-student-1', followingId: 'usr-student-2', createdAt: '2026-10-05T12:00:00Z' },
  { id: 'fol-4', followerId: 'usr-student-1', followingId: 'usr-student-3', createdAt: '2026-10-08T15:00:00Z' },
];

export const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'ver-1',
    userId: 'usr-student-4',
    personalEmail: 'sneha.patil.personal@gmail.com',
    institutionalEmail: 'sneha.patil@dypatil.edu',
    studentIdNumber: 'DYP2024AI018',
    collegeIdCardUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    department: 'Artificial Intelligence & Data Science',
    batchYear: 2028,
    status: 'pending',
    createdAt: '2026-10-10T14:35:00Z',
    updatedAt: '2026-10-10T14:35:00Z',
  }
];

export const INITIAL_MODERATION_LOGS: ModerationLog[] = [
  {
    id: 'mod-1',
    adminId: 'usr-admin-1',
    adminName: 'Dr. Anjali Deshmukh',
    targetType: 'article',
    targetId: 'art-1',
    targetTitle: 'Demystifying Speculative Decoding for Edge LLMs',
    action: 'approve_and_publish',
    reason: 'Rigorously verified methodology and reproducible benchmarks on student hardware.',
    createdAt: '2026-10-02T08:00:00Z',
  },
  {
    id: 'mod-2',
    adminId: 'usr-admin-1',
    adminName: 'Dr. Anjali Deshmukh',
    targetType: 'article',
    targetId: 'art-2',
    targetTitle: 'Architecting High-Throughput Raft Consensus in Go',
    action: 'approve_and_publish',
    reason: 'Clear architectural schemas and excellent handling of asymmetric network split edge cases.',
    createdAt: '2026-10-06T11:30:00Z',
  },
  {
    id: 'mod-3',
    adminId: 'usr-admin-1',
    adminName: 'Dr. Anjali Deshmukh',
    targetType: 'article',
    targetId: 'art-6',
    targetTitle: 'LoRaWAN Long-Range Mesh Topologies in Smart Agricultural Testbeds',
    action: 'request_changes',
    reason: 'Requested empirical SNR measurements under variable foliage density before publication.',
    createdAt: '2026-10-13T12:00:00Z',
  }
];
