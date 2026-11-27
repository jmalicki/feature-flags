# Security tooling around developer laptops and remote dev machines, with BeyondCorp as the centerpiece (26 Nov 2026)

Scope: what surrounds the machine a developer types on. Part 1 is Google (BeyondCorp papers read in full). Part 2 is the same control categories at other companies. Part 3 is data exfiltration prevention. Then: a sourced walk-through, a comparison table, angles, gaps.

Not repeated from existing notes: SSH-over-WebSocket through the Access Proxy, Chrome Remote Desktop, the google3-not-on-laptops testimony (seven voices), Meta's 2016 SSH post, Zero Touch Prod quotes, agent-era controls at Stripe/Shopify/Uber. See `cloudtop_and_ondemand.md` A5 to A7 and `access_and_agents.md` A3, B2, B3, C.

Read tags: **[PDF]** = PDF downloaded and text read directly. **[raw]** = raw HTML/API/source text read directly. **[fetched]** = read through an extraction tool (short quotes are the tool's verbatim extracts; treat paraphrase as paraphrase). **[snippet]** = search-result summary only, not opened.
Source types: official / named individual / anonymous commenter. HN = Hacker News, pulled from the Algolia API as raw text.

Rule applied: only published material counts.

---

## Part 1. BeyondCorp in depth

### 1.1 Device inventory and device certificates

#### Takeaway

The certificate is an identifier, not a pass. It is issued only to a device that is "present and correct" in inventory, is kept in a TPM or qualified certificate store, and is used as a lookup key into a continuously updated inventory that decides trust separately. Public text says certificates are "renewed periodically" but never gives the interval.

#### Cited Findings

- "BeyondCorp uses the concept of a 'managed device,' which is a device that is procured and actively managed by the enterprise. Only managed devices can access corporate applications." (Ward and Beyer, ;login: Dec 2014) [PDF] official. [BeyondCorp: A New Approach](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf)
- "To receive a certificate, a device must be both present and correct in the Device Inventory Database. The certificate is stored on a hardware or software Trusted Platform Module (TPM) or a qualified certificate store." "These checks are also enforced as certificates are renewed periodically." "While the certificate uniquely identifies the device, it does not single-handedly grant access privileges. Instead, it is used as a key to a set of information regarding the device." [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf)
- Why a certificate at all: "we decided to use an X.509 certificate as a persistent device identifier." "If the certificate changes, the device is considered a different device, even if all other identifiers remain the same." If it is "installed on a different device, the correlation logic notices both the certificate collision and the mismatch in auxiliary identifiers, and degrades the trust tiers in response." (Osborn et al., ;login: Spring 2016) [PDF] official. [Design to Deployment](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- Inventory scale and inputs: "we've ingested billions of deltas from over 15 data sources, at a typical rate of about three million per day, totaling over 80 terabytes." Sources named: "Active Directory, Puppet, and Simian", "vulnerability scanners, certificate authorities, and network infrastructure elements such as ARP tables." Observed data includes "OS version and patch level" and "Any installed software"; prescribed data includes "The assigned owner of the device" and "Users and groups allowed to access the device." [PDF] official. [Design to Deployment](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- How certificates got there: "The security team designed a new Certificate Authority with APIs to enable the various per-OS platform management teams to obtain and install certificates on their platforms." "It took years to fully deploy the 802.1x layer". (Peck et al., ;login: Summer 2017) [PDF] official. [Migrating to BeyondCorp](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf)
- Rotation pain: "Certificate rotations are still painful, as presenting a new certificate requires a browser restart to ensure that existing sockets are closed." (Cittadini et al., ;login: Winter 2016) [PDF] official. [The Access Proxy](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- 2019 restatement: "certificates are simply used to provide the device's identity, instead of acting as proof of trust." The older design issued certificates only to trusted devices, which meant "If you only install a new certificate once a year, this means it might take an entire year before you are able to recertify a device." (Ladenheim and King, 17 Sep 2019) [raw] official. [How Google adopted BeyondCorp, part 3](https://security.googleblog.com/2019/09/how-google-adopted-beyondcorp-part-3.html)
- Inventory hygiene is done at provisioning: "inventory records must be correct before a device can be successfully imaged with an operating system". Fleet size: "several hundred thousand client devices (workstations, laptops, mobile devices)". Data sources cover "physical device types ... as well as virtual desktops". (McDonald and Harl, 20 Aug 2019) [raw] official. [Part 2 (devices)](https://security.googleblog.com/2019/08/how-google-adopted-beyondcorp-part-2.html)
- Loaner Chromebooks show revocation in practice: on return "the system automatically revokes the certificate and demotes the device's trust". (Escobedo et al., ;login: Fall 2017) [PDF] official. [The User Experience](https://www.usenix.org/system/files/login/articles/login_fall17_08_escobedo.pdf)

#### Inferences

- The device certificate does two jobs that are easy to conflate: 802.1x network admission (which VLAN) and TLS client identity at the proxy. Both resolve to the same inventory record.

#### Gaps

- Certificate lifetime, the attestation protocol used at issuance, and whether the private key is always hardware-bound on every platform: not published. One HN commenter (hxtk, 17 Jul 2022) asserts TPM storage but is quoting the paper, not adding testimony. [HN 32128408](https://news.ycombinator.com/item?id=32128408)

### 1.2 Trust tiers and how a device's trust is computed

#### Takeaway

A "Trust Inferer" precomputes a maximum tier per device from dozens of inventory fields; each resource declares a minimum tier. Google started with four tiers and collapsed to three (Untrusted, Basic Access, Highly-Privileged Access) because employees could not tell which tier they needed. Higher trust means shorter-lived credentials and faster patch deadlines.

#### Cited Findings

- "The Trust Inferer is a system that continuously analyzes and annotates device state. The system sets the maximum trust tier accessible by the device and assigns the VLAN to be used by the device on the corporate network." "Reevaluations are triggered either by state changes or by a failure to receive updates from a device." [PDF] official. [Design to Deployment](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- Example criteria for high trust: "Be encrypted", "Successfully execute all management and configuration agents", "Install the most recent OS security patches", "Have a consistent state of data from all input sources". "The Trust Inferer currently references dozens of fields". [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- Cost of high trust is stated plainly: "As a device is allowed to access more sensitive data, we require more frequent tests of user presence on the device, so the more we trust a given device, the shorter-lived its credentials." "We may require installation of the latest operating system update within a few business days to retain a high trust tier". [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- Degradation ladder: missing non-critical patches gives an intermediate tier; "If a device is missing a critical security patch, or its antivirus software reports an infection, it may only be allowed to contact remediation services"; "a known lost or stolen device can be denied access to all corporate resources." [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- Propagation speed and pre-emptive blocks: "Our update latency is typically less than a second." "we denied access for any devices that may have been subject to Stagefright before such devices could even make an access request." [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- Tier names: "we initially supported four distinct tiers ranging from Untrusted to Highly-Privileged Access." "employees were unable to determine what tier they should choose". "In our current model, the vast majority of devices fit in one of three distinct tiers: Untrusted, Basic Access, and Highly-Privileged Access." The user chooses: "If a user needs access to more corporate data, they may have to accept more device configuration restrictions." [raw] official. [Part 3 (tiered access)](https://security.googleblog.com/2019/09/how-google-adopted-beyondcorp-part-3.html)
- Bootstrapping state: "we introduce an Identified state". "These devices can access a subset of our client software repository in order to install remediation software." "When a device fails to meet our trust criteria, we downgrade its trust level to Identified." The detection team is also an input: "This team can remove trust from any machine that's acting maliciously." (King et al., ;login: Fall 2018) [PDF] official. [Building a Healthy Fleet](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf)
- Failure mode they admit: "A tiny fraction of devices with mismatched data can potentially lock hundreds or even thousands of employees out of applications they need". Mitigation: synthetic records in the pipeline, and canarying policy changes. [PDF] official. [Design to Deployment](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- Source control is tier-gated: default rule for the code review tool restricts "to managed devices with the highest trust level, and to fulltime and part-time engineers with the highest trust level." [PDF] official. [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf)

#### Gaps

- Which tier a Cloudtop sits in, and whether an engineer's laptop and Cloudtop must both be Highly-Privileged Access: not published.

### 1.3 The Access Proxy and Access Control Engine

#### Takeaway

Every internal web app has a public DNS name that points at one Internet-facing proxy (an extended Google Front End). The proxy holds the device certificate and the SSO token, asks the Access Control Engine on every request, strips the user credential and forwards to the backend over mutually authenticated LOAS. Coarse company-wide rules live at the proxy; fine-grained rules stay in the app.

#### Cited Findings

- The five-step flow (device cert to proxy, redirect to SSO, primary plus second factor, token, per-request check of group, user trust, managed device, device trust) is in the 2014 paper's worked example for `codereview.corp.google.com`. "This authorization check is made on every request". [PDF] official. [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf)
- "The resulting extended GFE is called the Access Proxy (AP)." "When the AP authenticates the user, it strips the credential before sending the request to the back end." Backend leg: "an internally developed authentication and encryption framework called LOAS (Low Overhead Authentication System) that bi-directionally authenticates and encrypts all communication from the proxy to the back ends." [PDF] official. [The Access Proxy](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- "combining coarse-grained, centralized authorization at the AP with fine-grained authorization at the back end provides the best of both worlds." "the AP can securely pass additional data to the back end to allow it to perform fine-grained access controls." [PDF] official. [same](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- Volume of denials: "the volume of 403 error pages served by our Access Proxy daily (~12M for HTTP/S alone)". A separate portal explains denials; it is not built into the proxy because "we wanted to limit the amount of knowledge an attacker can gain from the 403 error pages." [PDF] official. [The User Experience](https://www.usenix.org/system/files/login/articles/login_fall17_08_escobedo.pdf)
- The public name is real: `buganizer.corp.google.com is an alias for uberproxy.l.google.com` (mjg59, Matthew Garrett, 27 Jan 2022: "you're not getting through the proxy without valid credentials and (in most cases) device identity verification."). [raw] named individual. [HN 30106774](https://news.ycombinator.com/item?id=30106774)
- Emergency design: "The breakglass mechanism for zero trust networking should be available only from specific locations." The book notes the irony that "the fallback mechanism for zero trust networking, a strategy of distrusting network location, is…trusting network location", with "additional physical access controls." (BSRS ch. 5, 2020) [raw] official. [BSRS ch. 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)

### 1.4 SSH, non-HTTP protocols and third-party software

#### Takeaway

The proxy handles HTTP natively and SSH by encapsulation. Everything else got one of four treatments (local authenticating proxy, SSH port-forward via a bastion, an encrypted multi-port service tunnel, or a time-boxed exception). NFS home directories were removed entirely. The long tail took until 2020 to 2021 and ended with a micro-segmented VPN for the residue.

#### Cited Findings

- Stated invariant: workstation-to-server traffic must be "Authenticated", "Authorized", "Encrypted" and "Independently logged". "The Access Proxy achieves all these requirements for HTTP/S traffic and for our HTTP-encapsulated SSH traffic." [PDF] official. [Migrating](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf)
- Table 1 of the paper, as read: browser HTTP/S goes to the Access proxy; naive HTTP command-line tools get "a client-side proxy server that supplies the platform certificate"; single TCP connections use "an SSH connection to a backend bastion, and tunnel the port"; many ports or UDP use an "Encrypted service tunnel". [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf)
- Service tunnel mechanics: "Routing tables on the client direct packets to a TUN device that captures and encrypts traffic to specific backend servers." "The encryption servers only allow traffic to the services and ports for which the application needs access." [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf)
- NFS: "we initiated a major project early on to accomplish two goals: moving NFS home directories to local disk with automatic backup to secure cloud storage, and replacing other NFS usage with Google Drive". Reason: "we couldn't assume that NFS, RDP, SQL, etc. had adequate authentication, authorization, and encryption." [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf)
- Third-party software "has frequently proved troublesome, as sometimes it can't present TLS certificates, and sometimes it assumes direct connectivity." [PDF] official. [The Access Proxy](https://usenix.org/system/files/login/articles/login_winter16_05_cittadini.pdf)
- Migration tooling: a client-side ACL simulator built with Capirca logged traffic that the new VLAN would block, then enforced it. "within a year this process moved over 50% of the fleet to non-privileged network access." Support cost: BeyondCorp "is responsible for only 0.3% of issues handled by our tech support organization." [PDF] official. [Migrating](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf)
- Exceptions carry "a programmatically enforced owner and expiration". [PDF] official. [Design to Deployment](https://www.usenix.org/system/files/login/articles/login_spring16_06_osborn.pdf)
- 2019 taxonomy of what does not fit: "Type 1: 'Non-proxyable protocols'", "Type 2: Low latency requirements or localized high throughput traffic", "Type 3: Administrative and emergency access networks." "some privileged networking will likely always be required to maintain the network itself and also to provide emergency access during outages." Also: "server-to-server traffic in secure production data center environments does not necessarily rely on BeyondCorp". (31 Oct 2019) [raw] official. [Part 4 (services)](https://security.googleblog.com/2019/10/how-google-adopted-beyondcorp-part-4.html)
- Long tail, 2020 to 2021: remaining network "holes" covered printers, SSH and emergency IRC; fixes were a micro-segmented VPN giving "fine-grained network access to only a set of pre-configured backends per user", cloud printing over HTTPS, and "an internally developed BeyondCorp SSH proxy". Exception groups ranged "from dozens to thousands of users." "VPN is not an optimal BeyondCorp-compatible solution as it does not remove network-based trust." (Gonçalves, O'Malley, Beyer, Saltonstall, ;login: online, 5 Jun 2023) [fetched] official. [BeyondCorp and the long tail of Zero Trust](https://www.usenix.org/publications/loginonline/beyondcorp-and-long-tail-zero-trust)
- SSH is checked on both identities: "Even internally at Google, the machine, and user are used to validate SSH sessions, and the remote system has a unique policy on who's allowed to access it. Disc: Googler, not on BeyondCorp" (qmarchi, 12 Feb 2022). [raw] anonymous commenter, 1 voice. [HN 30310266](https://news.ycombinator.com/item?id=30310266)

### 1.5 How managed laptops and Cloudtops fit

#### Takeaway

A Cloudtop is an inventoried device like any other: it gets a client certificate (bootstrapped from a GCE instance identity token instead of from a privileged network) and then reaches corp services through the same proxy. Laptops on four operating systems are managed with Puppet in standalone mode so that management itself does not need a privileged network.

#### Cited Findings

- "Over one-fourth of Googlers use internal, data-center-hosted virtual desktops." (Fata, Arida, Hahn, Beyer, ACM Queue, 1 Aug 2018) [raw, via Wayback copy] official. [Corp to Cloud: Google's Virtual Desktops](https://queue.acm.org/detail.cfm?id=3264508)
- "Device authentication is usually performed using client certificates deployed on the host." On a physical machine the user "can initially log in and request a certificate because the corporate network retains the level of privilege needed"; "Extending this level of network privilege to public cloud IP ranges is undesirable for security reasons." So: "When an instance first boots, one of the JWTs provided by that API can be exchanged for a client certificate used to prove device identity". "Once the client certificate is in place, Google applications can be accessed via the BeyondCorp/identity-aware proxy as if they were any other Internet-facing service." [raw] official. [same](https://queue.acm.org/detail.cfm?id=3264508)
- Purpose of the VM: users need to do their jobs, "developing, testing, building, and releasing code". Migration size: "approximately 20,000 virtual desktop users had to be moved". Operational result: "There was a 95 percent drop in pager load once we migrated virtual desktops to Cloud". Open item listed in 2018: "Extending BeyondCorp semantics to protocols that are hard to proxy." [raw] official. [same](https://queue.acm.org/detail.cfm?id=3264508)
- Fleet: "nearly a quarter-million computers (workstations and laptops) across four operating systems (macOS, Windows, Linux, and Chrome OS)." Puppet standalone was chosen partly because "Not having servers allows us to commit to our BeyondCorp access model". "Our hosts check in with Rapture every 15 minutes for new software updates." Disk encryption on all machines, with key escrow in Cauliflower Vest (FileVault, BitLocker, LUKS). (Mackness and Lucas, Nov 2017) [PDF] official. [Fleet Management at Scale](https://services.google.com/fh/files/misc/fleet_management_at_scale_white_paper.pdf)
- Chrome OS needs least: "Since Chrome OS requires very little enterprise management, we don't cover it here." [PDF] official. [same](https://services.google.com/fh/files/misc/fleet_management_at_scale_white_paper.pdf) Platform gap acknowledged: Chrome OS "provides robust software control, but Linux has no out-of-the-box capabilities that prevent malware." [PDF] official. [Healthy Fleet](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf)
- The visible part for users is a Chrome extension: "The extension automatically manages a user's Proxy Auto-Config (PAC) files"; "as long as they see the green icon in the extension, they know they can access their corporate resources." What breaks: captive portals (detected by fetching a URL that should return HTTP 204), home printers on RFC1918 addresses (custom 502 page tells the user to switch to "Off: Direct"), and competing proxy extensions. [PDF] official. [The User Experience](https://www.usenix.org/system/files/login/articles/login_fall17_08_escobedo.pdf)
- VPN retirement is automated: VPN access expires if "a user hasn't accessed a single corporate service not available within the BeyondCorp model within 45 days". [PDF] official. [same](https://www.usenix.org/system/files/login/articles/login_fall17_08_escobedo.pdf)
- One device does everything, per a Googler: "I have one corporate issued laptop that works great for everything from software development, flashing testing devices, managing production services, and browsing the internal meme boards." "You are pretty restricted in using personal devices for work (phones being an exception)." (danans, 11 Feb 2022) [raw] anonymous commenter, 1 voice. [HN 30308238](https://news.ycombinator.com/item?id=30308238)

### 1.6 Security keys

#### Takeaway

The "no phishing since security keys" claim is a statement by an unnamed Google spokesperson to Brian Krebs in July 2018, covering 85,000+ employees since early 2017. The exact words are narrower than the headline: no "reported or confirmed account takeovers".

#### Cited Findings

- "We have had no reported or confirmed account takeovers since implementing security keys at Google." Attributed to "a Google spokesperson"; article says 85,000+ employees and "since early 2017". On frequency: "Users might be asked to authenticate using their security key for many different apps/reasons", it "all depends on the sensitivity of the app and the risk of the user at that point in time." (Krebs on Security, 23 Jul 2018) [fetched] official statement via journalist. [Krebs](https://krebsonsecurity.com/2018/07/google-security-keys-neutralized-employee-phishing/)
- Current official wording is already in `access_and_agents.md` C ("mandatory use of U2F-compatible security keys").
- Daily cadence, by testimony (2 independent voices on the roughly daily login; 3 on repeated taps):
  - "When I worked at Google, we had BeyondCorp and I was asked for a password and security key touch once a day and could then browse internal apps freely." (jrockway, 4 Mar 2021) [raw] anonymous commenter. [HN 26337648](https://news.ycombinator.com/item?id=26337648)
  - "When I worked there sessions were limited to 20 hours. Beyond that full re-authentication with password + security key would be needed." (kccqzy, 18 Aug 2023) [raw] anonymous commenter. [HN 37180051](https://news.ycombinator.com/item?id=37180051)
  - An SRE's page-response routine: "5 minutes to be logged in and dealing with the problem. Password. gnubby. password. gnubby. gnubby. gnubby." (makerofthings, 26 May 2024) [raw] anonymous commenter. [HN 40482813](https://news.ycombinator.com/item?id=40482813)
  - "You can't just log on to your Googler machine and begin using the internal network with your browser. Gnubby must be satisfied." (seanmcdirmid, 15 Apr 2023) [raw] anonymous commenter. [HN 35583221](https://news.ycombinator.com/item?id=35583221)
- Limits, from a former gLinux security engineer: the two main protections are "requiring multiple signoffs (for landing code) and requiring proof of physical presence (for various things, including any sort of access to prod)"; with code execution on a workstation an attacker can "alias a command that requires gnubby press to something under your control ... user ends up being prompted twice, but how many people would actually flag that as a security concern?" (mjg59, 15 Apr 2023) [raw] named individual. [HN 35585453](https://news.ycombinator.com/item?id=35585453)
- `prodaccess` is the named login step for production credentials, and they expire: "I think after Jeff had been on vacation for a while, his `prodaccess` credentials expired, the job stopped working" (scottlamb, 8 Jan 2026); a frontend developer uses the terminal "for starting the server and running prodaccess" (mkoryak, 26 Mar 2026). [raw] 2 anonymous commenters. [HN 46541516](https://news.ycombinator.com/item?id=46541516), [HN 47529568](https://news.ycombinator.com/item?id=47529568)

#### Gaps

- `gcert`: zero HN comments matched an exact search. No public description of gcert, of certificate lifetime, or of what prodaccess issues was found. The "20 hours" figure rests on one commenter.

### 1.7 From corp to production

#### Takeaway

BeyondCorp gets a person to corp tools; it is explicitly not the production boundary. Production is reached through proxies that take a command, check policy, optionally require a second person, and execute on the engineer's behalf. Google's own text names the weak point: all the approving parties sit on the same kind of workstation.

#### Cited Findings

- "At Google, we use safe proxies to review, approve, and run risky commands without establishing an SSH connection to systems." "Engineers are not able to run arbitrary commands directly on servers; they need to contact the Tool Proxy instead." "The Tool Proxy instances are typically deployed as Borg jobs." The example policy has `allow = [ 'group:admin' ]` and `require_mpa_approval_from = [ 'group:admin-leads' ]`, and the engineer prefixes commands with `tool-proxy-cli --proxy_address`. (BSRS ch. 3, 2020) [raw] official. [BSRS ch. 3](https://google.github.io/building-secure-and-reliable-systems/raw/ch03.html)
- "In a large organization, MPA often has one key weakness that can be exploited by a determined and persistent attacker: all of the 'multiple parties' use the same centrally managed workstations." "The more homogeneous the fleet of workstations, the more likely it is that an attacker who can compromise one workstation can compromise several or even all of them." [raw] official. [BSRS ch. 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)
- Why not two workstations: separate general-use and production workstations are "both expensive and difficult to sustain over time." Instead: "you can only allow RPCs to be originated from fully managed desktop workstations, and then require three-factor authorization from the mobile platform." "MPA protects against unilateral insider risk as well as against compromise of an individual workstation"; "3FA protects against broad compromise of internal workstations, but does not provide any protection against insider threats when used in isolation." [raw] official. [BSRS ch. 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)
- On session logs: "A motivated and knowledgeable insider can trivially bypass many solutions that capture session logs of interactive sessions, such as recording bash command history." [raw] official. [same](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)
- Production side (BeyondProd, page dated September 2026): "Direct human intervention to our infrastructure should be by exception, not routine." "ALTS is a mutual authentication and transport encryption system for services in Google infrastructure." "BAB is a deploy-time enforcement check that helps ensure that code meets internal security requirements." The current page frames it against the product name: "BeyondProd addresses the same concern for production services as Chrome Enterprise Premium does for users." [fetched] official. [BeyondProd](https://docs.cloud.google.com/docs/security/beyondprod)
- LOAS/ALTS relationship by testimony: "LOAS is how Stubby (gRPC) connections on the internal network are secured, looks a bit like mTLS and is partially being open sourced as ALTS" (puzzle, 20 Jul 2018). [raw] anonymous commenter. [HN 17574361](https://news.ycombinator.com/item?id=17574361)

#### Gaps

- No public text says whether a Cloudtop may originate production RPCs directly or must go through the same proxies as a laptop.

### 1.8 Santa, Upvote and fleet patching

#### Takeaway

On Macs, Google blocks unknown binaries at launch (Santa) and lets employees unblock by peer vote. Patching is driven by access: nag, then degrade the trust tier, then force the update. The published effect of Santa is a 78% drop in malware-related Mac reimage requests.

#### Cited Findings

- "we use tools that provide local binary whitelisting systems at the kernel level: Santa on macOS and Carbon Black (formerly Bit9) on Windows." "After rolling out Santa (binary whitelisting for macOS) to our Mac fleet, we observed a 78% decrease in malware-related Mac reimage requests." [PDF] official. [Fleet Management at Scale](https://services.google.com/fh/files/misc/fleet_management_at_scale_white_paper.pdf)
- Social voting: "We do allow users to download software from the internet, but only after it's gone through a social whitelisting process involving peer-based voting." "the user simply has to vote for the software in the tool and get another employee to vote for it." "Banned software can't be whitelisted with votes." [PDF] official. [same](https://services.google.com/fh/files/misc/fleet_management_at_scale_white_paper.pdf)
- Patching by access pressure: "The longer they wait to update, the more frequent the pop-ups become. If they wait too long to update, they will find their level of access degraded until these updates are applied." Then "a tool that forces updates if too much time has passed". [PDF] official. [same](https://services.google.com/fh/files/misc/fleet_management_at_scale_white_paper.pdf)
- Same idea in the papers: "BeyondCorp uses access restriction to help drive user actions such as rebooting or accepting updates." Policy preference: "We generally prefer an allowed list strategy". Root: "removing root privileges by default helps mitigate the damage a rogue process can inflict." Forensics: "Tools like GRR can provide remote accessibility". Telemetry: "Facebook's OS Query is an excellent open source telemetry tool". [PDF] official. [Healthy Fleet](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf)
- Developer escape hatch, by testimony: Santa "is used to whitelist binaries on Macs, but you can fill out a form to instantly opt out. One of the options for why is 'I use a package manager'." (tbodt, 10 Apr 2020) [raw] anonymous commenter, 1 voice. [HN 22830400](https://news.ycombinator.com/item?id=22830400)

#### Gaps

- Whether engineers have root on gLinux laptops and Cloudtops is covered by testimony in `cloudtop_and_ondemand.md` A3 and A6, not by an official source. "Removing root privileges by default" (2018) is a recommendation in the paper, not a statement of what Google's fleet does.

### 1.9 What changed 2020 to 2026

#### Takeaway

The internal system stayed; the product names moved (context-aware access, then BeyondCorp Enterprise, then Chrome Enterprise Premium), and the enforcement point moved into the browser. The 2023 no-internet desktop pilot is the one reported retreat from "the internet is the network".

#### Cited Findings

- By 2017 the lessons were already being productized: "most notably, the new services we've recently added to Google's Cloud Platform (such as the Identity-Aware Proxy)." [PDF] official. [Migrating](https://www.usenix.org/system/files/login/articles/login_summer17_10_peck.pdf) The 2019 posts point readers to "zero trust solutions from Google Cloud (context-aware access)". [raw] official. [Part 2](https://security.googleblog.com/2019/08/how-google-adopted-beyondcorp-part-2.html)
- Google's BeyondCorp page now presents the model as available through Chrome Enterprise Premium; the Chrome Enterprise Premium release notes carry an entry dated 8 April 2024 alongside older BeyondCorp Enterprise entries. [snippet] official. [BeyondCorp Enterprise overview](https://docs.cloud.google.com/beyondcorp-enterprise/docs/overview), [release notes](https://docs.cloud.google.com/chrome-enterprise-premium/docs/release-notes?hl=he) The January 2021 launch date of BeyondCorp Enterprise and the April 2024 rename are from memory and were not confirmed in this pass.
- Chrome Enterprise Premium's data controls (watermark, screenshot blocking, copy/paste limits, URL filtering) are in Part 3.
- 2023 pilot: Google "will disable Internet access on the select desktops, with the exception of internal web-based tools and Google-owned websites like Google Drive and Gmail." This is a quotation of the Ars Technica report inside an HN comment (croes, 22 Jul 2023). [raw, second-hand] [HN 36828415](https://news.ycombinator.com/item?id=36828415) The CNBC original is cited in `cloudtop_and_ondemand.md`: [CNBC, 18 Jul 2023](https://www.cnbc.com/2023/07/18/google-restricting-internet-access-to-some-employees-for-security.html) (not re-read here).
- Pandemic verdict, by testimony: "I think BeyondCorp ended up working fantastically well during the pandemic as basically the entire company has been working via untrusted networks." (danans, 11 Feb 2022) [raw]. [HN 30308238](https://news.ycombinator.com/item?id=30308238) A second voice, ex-Googler: "I loved not having to use a VPN back when I worked at Google" (ndomer, 26 Oct 2020). [raw]. [HN 24902319](https://news.ycombinator.com/item?id=24902319)

#### Gaps

- Whether the 2023 no-internet pilot became policy: not found (also a gap in the earlier notes).

---

## Part 2. The same controls at other companies

Coverage here is uneven. Where nothing was found in this pass, that is stated; nothing is filled in from memory.

### 2.1 Zero-trust access and device trust

#### Takeaway

Netflix (LISA) and Cloudflare (Access) publish the same move as Google: drop trust in the office network or VPN, substitute authenticated users and healthy devices. Slack's Nebula is a server-to-server overlay with certificate identity, not a laptop access system by its own account.

#### Cited Findings

- Netflix: LISA "removes trust of the office network, replaces it with trust of authenticated users and healthy devices." "Many companies treat their buildings as trusted locations". (Bryan Zimmer, Senior Security Engineer, USENIX Enigma, 16 Jan 2018; abstract) [fetched] official talk. [Enigma 2018](https://www.usenix.org/conference/enigma2018/presentation/zimmer)
- Cloudflare: "all of Cloudflare's internally-hosted applications were reached via a hardware-based VPN"; with Access, "every packet is authenticated" and the company can "rely on the strong two-factor authentication mechanisms of our identity provider." (28 Mar 2020) [fetched] official. [Dogfooding from Home](https://blog.cloudflare.com/dogfooding-from-home/) The post does not cover device posture or security keys.
- Slack: "Nebula is a scalable overlay networking tool"; "Hosts should identify themselves via certificates, issued by a certificate authority, that encode user-defined attributes."; "Today Nebula runs on every server at Slack". Laptops appear only as a design goal. (Ryan Huber, 19 Nov 2019) [fetched] official. [Introducing Nebula](https://slack.engineering/introducing-nebula-the-open-source-global-overlay-network-from-slack/)
- Finance, by testimony (2 independent voices): "I work for a bulge bracket bank and have been on a VDI for the past five years ... This is extremely common in finance, most developers are running on VDI's since it's much easier to manage and lock down." "Heavily locked down." "forced weekend reboots". Software only from an approved list; anything else is "next to impossible to get ... approved (tons of paperwork & reviews)." (MrApathy, 9 Jul 2021) [raw] anonymous commenter. [HN 27779392](https://news.ycombinator.com/item?id=27779392) Second voice describing the pattern generally: gavanm, in 2.4 below.
- An outside evaluator's summary of why BeyondCorp is hard to copy: "everyone outside Google has incredibly diverse protocol ecosystems." (metmac, 29 Jun 2025) [raw] anonymous commenter. [HN 44415706](https://news.ycombinator.com/item?id=44415706)

#### Gaps

- No public first-person source read in this pass for Meta, Microsoft, Uber, Airbnb, Dropbox, Stripe, Block, Coinbase, Lyft or Pinterest device-trust systems. The GitLab handbook page fetched ([CorpSec Systems](https://handbook.gitlab.com/handbook/security/corporate/systems/)) returned only navigation in the 200,000 characters read.

### 2.2 SSH and certificates

#### Takeaway

The common pattern is an internal SSH certificate authority issuing expiring user certificates after SSO, so that no long-lived keys sit on laptops or in `authorized_keys`. Published examples: Meta (2016, in earlier notes), Netflix BLESS (now archived), Uber ussh with a PAM module that also gates sudo, a Lyft fork of BLESS.

#### Cited Findings

- Uber: pam-ussh "will authenticate a user based on them having an ssh certificate in their ssh-agent signed by a specified ssh CA." "This is primarily intended as an authentication module for sudo." [raw] official repository. [uber/pam-ussh](https://github.com/uber/pam-ussh)
- Uber's announcement post (Peter Moody, "Introducing the Uber SSH Certificate Authority"): goals were to inventory public keys, enable automatic expiry and improve host authentication; an employee gets a certificate by running `ussh`. [snippet; the Medium page returned 403] official. [Uber Security + Privacy](https://medium.com/uber-security-privacy/introriving-the-uber-ssh-certificate-authority-4f840839c5cc) A reported flaw: pam-ussh at one point did not properly validate the CA. [snippet]
- Netflix: BLESS is an SSH CA running as an AWS Lambda function, called from a bastion, issuing short-lived certificates; the repository is archived, citing other SSH certificate tools and AWS's own access management. Lyft maintains a fork. [snippet] official repositories. [lyft/bless PR](https://github.com/lyft/bless/pull/40)
- Vendor summary (Teleport, 16 Jul 2019): Uber: "Each certificate has a lifespan and can be configured based on the individual employee role."; Netflix: "Netflix's SSH bastion architecture reduces friction by using SSO to authenticate users and issuing short-lived certificates." "BLESS runs on AWS Lambda and uses Amazon's Key Management Service for encryption." [fetched] vendor. [Teleport](https://goteleport.com/blog/how-uber-netflix-facebook-do-ssh/)
- Google's equivalents (LOAS/ALTS for services, SSH certificates plus device certificate for people) are in 1.3, 1.4 and 1.7.

#### Gaps

- Certificate lifetimes for Uber and Netflix: not stated in anything read. Pinterest, Coinbase, Dropbox, Stripe: nothing found. SPIFFE/SPIRE and Smallstep: not researched in this pass.

### 2.3 Egress control from dev machines

#### Takeaway

The best-documented fact is a complaint: TLS-intercepting proxies break developer tooling because each runtime keeps its own trust store. Four independent commenters describe the same failure; one says it is a one-line fix. Named-company egress designs for dev machines remain unpublished.

#### Cited Findings

- Four independent voices on TLS interception (all anonymous commenters, [raw]):
  - "Every runtime of developer tools, python, Node, .NET, Docker, Linux (WSL) flavors, etc have their own way to trust root certificates" (sebazzz, 21 Oct 2024). [HN 41906713](https://news.ycombinator.com/item?id=41906713)
  - "They have manual instructions on how you add the certificate to the Java key store, and NPM key store, and the python key store, and the OS key store" (prettyStandard, 29 Oct 2024). [HN 41989452](https://news.ycombinator.com/item?id=41989452)
  - "The limited trial a few months ago was hell for folks using WSL primarily, with Docker images adding an additional layer of pain. The people in the trial got very little done until it was decided to pause it" (deergomoo, 1 Jan 2025). [HN 42570143](https://news.ycombinator.com/item?id=42570143)
  - "Welcome to the configuration nightmare that is setting up Anaconda, npm, AWS CLI, Python (Requests library), Git, etc. for working with something like Zscaler." (Xcelerate, 12 Jul 2017). [HN 14751639](https://news.ycombinator.com/item?id=14751639)
  - Dissent, 1 voice: "All you really need to do is install the zscaler cert in the appropriate trust store. It's really a 1 step process in your dockerfile" (Atotalnoob, 2 Jan 2025). [HN 42577102](https://news.ycombinator.com/item?id=42577102)
- A corporate proxy blocking a vendor's whole site by category: an ex-Googler at a pharma company "disallows us from visiting the entire tailscale website because you sell a VPN product" (dekhn, 27 Oct 2022). [raw] anonymous commenter. [HN 33362592](https://news.ycombinator.com/item?id=33362592)
- Package proxy as the only egress, agent case: sandboxed agents had "no internet access, and only the ability to install packages via Artifactory", and reportedly got out through a flaw in that proxy (reasonableklout, 19 Aug 2026, describing an incident second-hand and expressing confusion about it). [raw] anonymous commenter; treat as unverified. [HN 49367941](https://news.ycombinator.com/item?id=49367941)
- Google's unprivileged office network "only connects to the Internet, limited infrastructure services (e.g., DNS, DHCP, and NTP), and configuration management systems such as Puppet." [PDF] official. [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf)

#### Gaps

- Meta `fwdproxy`: no public source found (one web search, two HN exact-term searches, zero hits). Do not name it in the essay on this evidence.
- No first-person source on package mirrors, dependency scanning at the proxy, or blocking paste sites and AI tools at any named company.

### 2.4 Endpoint monitoring and its cost

#### Takeaway

Google publishes the principle (telemetry sufficient "to contain a compromise", centralized logs, remote forensics with GRR) and warns that bash-history style session capture is trivially bypassed. Complaints about agent overhead exist but are thin: two voices found, neither with a build-time measurement.

#### Cited Findings

- Google: a healthy device "provides sufficient telemetry to contain a compromise when one occurs"; logging "should include user- and device-attributable audit records for all sensitive data accesses or modifications"; rollout example: "we might push a new USB auditing agent to a subset of a hardware engineering organization". [PDF] official. [Healthy Fleet](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf)
- Agent sprawl: "between CrowdStrike, Tanium, SentinelOne, Defender, AirWatch, New Relic, and OpenTelemetry, I've seen a web of similar-ish feature sets with agents alone consuming upwards of 10% of the machine's CPU power just in the background." (stego-tech, 30 Oct 2024) [raw] anonymous commenter. [HN 41999276](https://news.ycombinator.com/item?id=41999276)
- Linux kernel friction: "CrowdStrike Falcon's eBPF will fail to compile and execute, then fail to fall back to their janky kernel driver, then inform IT that I'm out of compliance." (MrDrMcCoy, 19 Jul 2024) [raw] anonymous commenter. [HN 41008786](https://news.ycombinator.com/item?id=41008786)
- osquery cost: "a simple 'select * from processes' takes a solid 3 seconds of kernel time on my laptop." (formerly_proven, 25 Feb 2024) [raw] anonymous commenter. [HN 39501892](https://news.ycombinator.com/item?id=39501892)

#### Gaps

- No published measurement of EDR cost on compile times was found. auditd/eBPF command logging and bastion session recording at named companies: not found in this pass (Google's breakglass transcript logging is in `access_and_agents.md` C).

### 2.5 Secrets on dev machines and credential-stealing malware

#### Takeaway

The 2025 to 2026 npm/PyPI worms are the clearest argument that whatever is readable on the developer's machine will be read: they scan for tokens, SSH keys and cloud credentials, and by 2026 they read coding-agent configuration files too. All of this is from search summaries of vendor reports; counts vary by vendor.

#### Cited Findings

- Shai-Hulud, first wave September 2025: used stolen npm tokens to publish trojanized versions of a maintainer's other packages. Second wave, late November 2025: ran in a preinstall script, used TruffleHog to scan for SSH keys, GitHub, npm and cloud credentials; Check Point counted 775 GitHub tokens, 373 AWS, 300 GCP and 115 Azure credentials across about 20,000 repositories reviewed; Wiz is cited for more than 25,000. [snippet] vendor reports. [Check Point](https://blog.checkpoint.com/research/shai-hulud-2-0-inside-the-second-coming-the-most-aggressive-npm-supply-chain-attack-of-2025/), [The Hacker News](https://thehackernews.com/2025/11/second-sha1-hulud-wave-affects-25000.html?hl=ru), [Trend Micro](https://www.trendmicro.com/en_gb/research/25/k/shai-hulud-2-0-targets-cloud-and-developer-systems.html)
- 2026: "Mini Shai-Hulud" (May 2026), over 170 npm and PyPI packages, harvesting from over 100 file paths including coding-agent configs and MCP server tokens, described as the first known use of agent configuration files for persistence; CanisterSprawl (April 2026); Miasma and IronWorm (June 2026) "explicitly targeting AI coding tool credentials". [snippet] research-group and trade-press reports; names and counts overlap and may describe the same activity. [CSA note](https://labs.cloudsecurityalliance.org/research-rb/csa-research-note-mini-shai-hulud-ai-supply-chain-20260516-c/), [CSA Miasma/IronWorm](https://labs.cloudsecurityalliance.org/research/csa-research-note-miasma-ironworm-ai-coding-supply-chain-202/), [VentureBeat](https://venturebeat.com/security/shai-hulud-worm-172-npm-pypi-packages-valid-provenance-ci-cd-audit)
- Google's stated principle: "Wherever possible, credentials should be hardware-backed or hardware-isolated on a system." [PDF] official. [Healthy Fleet](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf)

#### Gaps

- No first-person company account of short-lived cloud credentials or a secrets broker for dev machines was read in this pass (aws-vault, SSO, workload identity not researched).

### 2.6 When the developer is an agent

#### Takeaway

Nothing new from primary sources beyond the earlier notes. Vendor writing in 2026 converges on a two-plane picture: a sandbox for files, processes and local credentials, and a gateway for network, tool and MCP traffic, with the caveat that a gateway only works if it is the only path.

#### Cited Findings

- Claude Code's sandbox routes network traffic "through a proxy server running outside the sandbox" that enforces domain restrictions; GitHub's agentic workflows use a Squid forward proxy and document what it does not cover; an NVIDIA post notes hooks and MCP initialization often run outside the sandbox; a July 2026 vendor post splits "host plane" (sandbox) from "network, tool, and MCP plane" (gateway). [snippet] vendor and secondary sources. [WorkOS](https://workos.com/blog/agent-sandbox-egress-defaults), [Zuplo](https://zuplo.com/blog/anthropic-made-the-case-for-mcp-gateways), [Endor Labs](https://www.endorlabs.com/learn/beyond-mcp-the-new-security-playbook-for-coding-agents)
- Primary sources already in `access_and_agents.md` B2/B3 (Stripe, Shopify, Uber MCP gateway, Anthropic) are the citable ones.

---

## Part 3. Data exfiltration prevention

### 3.1 What is public about how Google prevents exfiltration

#### Takeaway

Public Google sources describe four layers: (a) no access without an inventoried device plus user login, so there is no unmanaged endpoint to copy to; (b) the bytes of the main source tree are kept off laptops (testimony only); (c) browser and OS-level data controls that Google sells and whose code is public; (d) logging that reconstructs what an insider did. The court record in the Ding case shows layer (d) working after the fact and the preventive layers failing against copy-into-a-notes-app.

#### Cited Findings

##### Access requires device and user together

- 2014 paper flow: "The laptop provides its device certificate." Then SSO with "primary and second-factor authentication credentials". "The access proxy now has the device certificate, which identifies the device, and the SSO token, which identifies the user." "Only managed devices can access corporate applications." [PDF] official. [2014 paper](https://www.usenix.org/system/files/login/articles/login_dec14_02_ward.pdf)
- "a system grants access based on a combination of user credentials and device credentials" [fetched] official. [BSRS ch. 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)
- Court record: the Ding indictment says Google "required each device to be uniquely identified and authenticated before accessing the Google corporate" network, and used "a system of data loss prevention that monitored and logged certain data transfers to and from" its network. [snippet of the indictment text; the DOJ PDF could not be downloaded] official (court filing). [Indictment PDF](https://www.justice.gov/opa/media/1341356/dl)
- Testimony: one named ex-security engineer (mjg59, in 1.3) and one Googler (qmarchi, in 1.4) say device identity is checked "in most cases" and for SSH.

##### Device-side controls Google describes for itself

- "preventing them from doing harm, like installing malware or exposing Google data"; full-disk encryption on all machines; remote wipe "that destroy any data stored on the system and any long-term credentials"; a "USB auditing agent" as an example rollout. [PDF] official. [Fleet Management at Scale](https://services.google.com/fh/files/misc/fleet_management_at_scale_white_paper.pdf), [Healthy Fleet](https://www.usenix.org/system/files/login/articles/login_fall18_05_king.pdf)
- Insider framing: "Engineers may make mistakes, their accounts may be compromised, or they may be malicious."; "you should always safeguard against unilateral access to user data."; "Patterns of generic justifications should set off alarm signals in the auditing system." [fetched/raw] official. [BSRS ch. 5](https://google.github.io/building-secure-and-reliable-systems/raw/ch05.html)

##### Source code specifically

- The no-google3-on-laptops rule is attested by seven independent commenters and no official source; see `cloudtop_and_ondemand.md` A7. The nearest official text is tier-gating of code review and submission (1.2).
- Not found in any public source: restrictions on `git push` to external remotes, USB mass-storage blocking policy, external email or Drive sharing controls for employees.

##### Browser and OS data controls (public as product and as source code)

- ChromeOS data controls: admin rules can restrict copy and paste, printing, "screen capture, including screenshots and video", screen sharing, file transfers, and can force the electronic privacy screen; rules name sources and destinations by URL pattern, app, or removable storage; levels are Block ("Users cannot perform the action. That action is reported."), Warn, Report, Allow. Requires ChromeOS 103 or later. [fetched] official product documentation. [Set ChromeOS data controls](https://support.google.com/chrome/a/answer/11587610)
- Chromium source, copyright 2020: `enum class DlpContentRestriction` with `kScreenshot` ("Do not allow any screenshots or video capture of the corresponding content."), `kPrivacyScreen`, `kPrint`, `kScreenShare`; `DlpContentManagerAsh` is a "System-wide class that tracks the set of currently known confidential WebContents and whether any of them are currently visible. If any confidential WebContents is visible, the corresponding restrictions will be enforced according to the current enterprise policy." Restrictions are keyed by URL (`RestrictionLevelAndUrl`). [raw] official open source. [dlp_content_restriction_set.h](https://github.com/chromium/chromium/blob/main/chrome/browser/chromeos/policy/dlp/dlp_content_restriction_set.h), [dlp_content_manager_ash.h](https://github.com/chromium/chromium/blob/main/chrome/browser/ash/policy/dlp/dlp_content_manager_ash.h)
- Google patent US12182297B2, "Data protection for computing device", priority 24 Sep 2021, assignee Google LLC: controls applied "at an operating system level"; content identified by source URL, keywords via "a text scanner configured to identify the terms of the content", or a machine-learning model; restricted functions include screenshots, screencasts, printing, privacy screen, clipboard and file transfer. No mention of HTTP headers in the first 100,000 characters read (the page is longer). [fetched] official (patent). [Google Patents](https://patents.google.com/patent/US12182297)
- Chrome Enterprise Premium on other operating systems: on a "URL visited" trigger an admin can add a watermark, restrict screenshots or mask text; "Content is blacked out in screenshots (Windows, Android, and iOS) or disappears (Mac)." Pages are identified by URL, URL category, page title, content detectors or signed-in account. No headers or site-provided labels. [fetched] official product documentation. [Use Chrome Enterprise Premium to integrate DLP with Chrome](https://knowledge.workspace.google.com/admin/security/use-chrome-enterprise-premium-to-integrate-dlp-with-chrome)
- Product announcement, 19 Nov 2024: "Chrome Enterprise Premium allows you to apply visible watermarks to sensitive company documents viewed in the browser, displaying information like the user's email address, date, or a custom message." "Chrome Enterprise Premium's screenshot protection allows you to prevent users from taking screenshots of sensitive content within the browser." [fetched] official. [Google Cloud blog](https://cloud.google.com/blog/products/chrome-enterprise/new-ways-to-protect-your-sensitive-data-with-chrome-enterprise)
- None of these pages says Google applies the controls to its own employees.

##### Insider cases: what the record shows

- Levandowski (Waymo/Google, 2015 to 2016): DOJ materials say that on 11 December 2015 he "downloaded approximately 14,000 files from an internal, password-protected Google server known as 'SVN'" and about three days later transferred them from his Google-issued laptop to a personal laptop; Waymo's lawyers cited logs from Google's network and a forensic investigation; a card reader was attached for eight hours. Waymo's own post says the trigger was an inadvertently forwarded supplier email, after which "We found that six weeks before his resignation this former employee ... downloaded over 14,000 highly confidential and proprietary design files". [snippet for DOJ and press; raw for the Waymo quote as reproduced by geofft on HN, 25 Feb 2017] [DOJ indictment](https://www.justice.gov/usao-ndca/press-release/file/1197991/download), [HN 13732038](https://news.ycombinator.com/item?id=13732038) Reading: the download was logged, nobody looked until an outside tip, and the copy went laptop to removable media. Note the repository was a hardware-design SVN that synced files to the laptop, not the main source tree.
- Ding (Google, 2022 to 2023): per the indictment as reported, he "copied the content from Google source files directly into an Apple Notes document on his company-issued MacBook, saved the document as a PDF, and transferred that PDF to his personal account"; "Google's data-loss prevention systems did not immediately detect that method". More than 500 files in the first indictment, more than 1,000 in the superseding one, over about a year (May 2022 to May 2023). He allegedly had a colleague badge in for him in December 2023. Google noticed in December 2023 when he uploaded more files to a personal Drive account while in China; he signed an affidavit that he had deleted them; on 4 January 2024 Google froze his laptop and revoked access. Google's statement: "We have strict safeguards to prevent the theft of our confidential commercial information and trade secrets." [fetched] trade press reporting the indictment. [The Register, 7 Mar 2024](https://www.theregister.com/2024/03/07/doj_google_ai_theft_indictment/) Conviction on seven counts of economic espionage and seven of trade-secret theft, press release dated 30 Jan 2026, which says "more than two thousand pages" were uploaded "to his personal Google Cloud account". [fetched] official. [DOJ](https://www.justice.gov/opa/pr/former-google-engineer-found-guilty-economic-espionage-and-theft-confidential-ai-technology)

#### Inferences

- The Ding method (render source in an approved viewer, copy text into a local app, export, upload to a personal account of the employer's own cloud) defeats URL-keyed and file-keyed DLP because the content changes container and the destination is an allowed domain. Screenshot and clipboard restrictions keyed to the source page are the published countermeasure to exactly this move; whether Google had them enabled on his MacBook in 2022 is not public.
- Both cases were caught by something other than the preventive controls: an outside tip in one, a later and clumsier upload in the other. In both, logs let investigators reconstruct volume and dates. Logging is the layer that demonstrably worked.

### 3.3 Other companies

#### Takeaway

Little is published. The clearest public record is again a court case (Apple), plus practitioner descriptions of the VDI pattern in finance.

#### Cited Findings

- Apple (Xiaolang Zhang, 2018): after a supervisor found him evasive, Apple's product security team reviewed his network activity and found it had "increased exponentially" compared with the prior two years, mostly downloads from project databases; arrested at the airport; later pleaded guilty. [snippet] court complaint via press. [DOJ](https://justice.gov/usao-ndca/pr/former-apple-employee-indicted-theft-trade-secrets), [SecurityWeek](https://www.securityweek.com/departing-apple-engineer-stole-autonomous-car-tech-fbi) Same shape as the Google cases: detection by retrospective log review after a human trigger.
- The VDI pattern, by a practitioner: "All code, and dev boxes live 'inside' the corporate network, and only keypresses, mouse movement, and screen diffs are sent back and forth. Most remote access packages can prevent clipboard, USB device, file transfer etc." Dedicated hardware lets you "prevent some things like screen capturing". (gavanm, 28 Feb 2023) [raw] anonymous commenter. [HN 34966192](https://news.ycombinator.com/item?id=34966192) Bank developer confirming VDI is standard and "heavily locked down": MrApathy in 2.1. 2 independent voices on the pattern; neither names clipboard policy at a specific bank.
- Uber's Devpod post states monitoring as a capability of remote environments (in `access_and_agents.md` C).

#### Gaps

- Meta, Microsoft, Amazon, Netflix, Stripe: no public source on dev-machine exfiltration controls found in this pass (one combined search; it returned only the Apple case). Watermarking at trading firms: nothing found.

### 3.4 What a remote dev machine changes about exfiltration

#### Takeaway

It moves the bytes at rest, not the bytes in view. Bulk copy gets harder and more visible; anything a person can see or pull through an allowed channel still leaves.

#### Inferences (reasoned from the cited findings above; no source states this list as a whole)

- **Where the bytes are.** Laptop model: the working tree, build outputs and credentials sit on a disk the person carries; protection is disk encryption, remote wipe and agent-based DLP. Remote model: they sit in a data center; the laptop holds a session. Levandowski's 14,000 files were on his laptop three days before they left it; under the google3 rule there is nothing equivalent to carry.
- **What crosses the wire.** Pixels (remote desktop, browser IDE): exfiltration is screenshots or a camera; rate-limited by human reading speed unless automated. Keystrokes in, text out over ssh: terminal scrollback is plain text on the laptop, so `cat` of any file is a copy at terminal speed. Editor remoting (VS Code Remote, per the Cloudtop testimony): the editor on the laptop receives file contents by design. Port forwards and tunnels: arbitrary bytes if permitted. `scp`/`rsync`/`git clone` to the laptop: bulk copy unless the proxy or policy blocks them; Google's papers say SSH is authorized per user and device but say nothing public about restricting file transfer inside the session.
- **What the remote machine itself can reach.** If the dev machine has internet egress it can push to an external git remote or upload directly; the laptop is then irrelevant. This is why the 2023 no-internet pilot and Stripe's "no arbitrary egress" matter more for exfiltration than the laptop controls do.
- **Channels that stay open in every model.** Reading and retyping; a phone camera; copying text from an allowed viewer into a local app (Ding); uploading to a personal account on an allowed domain (Ding again: the destination was Google's own cloud).
- **What improves.** One place to log (every file read and every outbound connection happens on a machine the company runs), and bulk transfer has to cross a proxy that can count bytes. The three court cases suggest logs are what actually catches people, late.
- **What gets worse.** The session becomes the asset: a compromised laptop with a live authenticated session can drive the remote machine (mjg59's doubled security-key prompt in 1.6), and all approvers share one workstation fleet (BSRS in 1.7).

---

## Walk-through: a Google engineer opens a laptop, reaches a Cloudtop shell, then touches production

1. **The laptop is already known.** It was entered in inventory at receiving and imaging, encrypted, and given a device certificate held in a TPM or certificate store. Sourced: 2014 paper; Healthy Fleet ("we add every machine in our fleet to our corporate inventory during the receiving and imaging process"); Fleet Management at Scale.
2. **It joins a network that grants nothing.** In an office, 802.1x presents the certificate and RADIUS assigns the unprivileged VLAN, which reaches only the internet and a few infrastructure services. At home or in a café there is no VPN step. Sourced: 2014 paper; Migrating.
3. **In the background its trust tier is already computed.** Patch level, encryption, agent health and inventory consistency feed the Trust Inferer; a stale laptop is nagged, then downgraded, then force-updated. Sourced: Design to Deployment; Fleet Management at Scale; Part 3 blog.
4. **The engineer opens Chrome.** The BeyondCorp extension fetches a PAC file and shows a green icon; corp hostnames resolve publicly to the Access Proxy. Sourced: The User Experience; 2014 paper.
5. **First request of the day: login.** The proxy sees the device certificate, redirects to SSO; password plus a security-key touch; a short-lived token comes back. Sourced: 2014 paper (flow); infrastructure overview in earlier notes (security keys mandatory). Roughly once a day or every 20 hours: testimony only, 2 voices.
6. **Every request is then checked** for group, user trust, managed device and device tier, and forwarded to the backend with the user credential stripped. Sourced: 2014 paper; Access Proxy paper.
7. **The engineer starts an SSH session to the Cloudtop.** A local ProxyCommand helper wraps SSH in WebSockets over TLS to the Access Proxy; the device is identified by the TLS client certificate, the user by an SSH certificate. Sourced: Access Proxy paper (in earlier notes). How the user's SSH certificate is obtained (the `gcert` step): **unsourced**; no public description found.
8. **The Cloudtop is itself an inventoried device.** At first boot it exchanged a GCE instance identity token for a client certificate, and it reaches corp services through the same proxy. Sourced: ACM Queue 2018.
9. **The engineer works in the shell or a remote editor.** The source tree lives on the Cloudtop side, not the laptop. Sourced by testimony only (seven voices, earlier notes). Which trust tier the Cloudtop holds and what it can reach on the internet: **unsourced**.
10. **To touch production the engineer obtains production credentials.** `prodaccess` is named by two commenters and the credentials expire. What it issues, and whether it needs a key touch: **unsourced** beyond mjg59's "proof of physical presence ... for ... any sort of access to prod".
11. **The command goes to a proxy, not to a server.** `tool-proxy-cli` sends the command line to a Tool Proxy running as a Borg job; policy checks the caller's group and may require a second person's approval; the proxy executes and logs. Sourced: BSRS ch. 3.
12. **Sensitive calls may need more.** Multi-party authorization, optionally approval from the engineer's phone ("3FA"), temporary grants and a business justification. Sourced: BSRS ch. 5. How widely 3FA is deployed: **unsourced**.
13. **Inside production, services talk to each other under their own identities** (ALTS), and only reviewed, provenance-checked binaries run (Binary Authorization for Borg). Sourced: BeyondProd.
14. **If all else fails, breakglass**: restricted to the SRE team, available "only from specific locations", monitored, reviewed by the team afterward. Sourced: BSRS ch. 5.

---

## Comparison table of controls by company

"n/f" = no public source found in this pass (not "does not exist"). Entries for Meta, Stripe and Uber marked † are from the earlier notes files.

| Control | Google | Netflix | Meta | Uber | Slack | Cloudflare | Banks (testimony) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Network trust removed | Yes, BeyondCorp, papers 2014 to 2023 | Yes, LISA (2018 talk abstract) | n/f | n/f | Server overlay (Nebula), not laptops | Access replaced VPN (2020) | VDI inside the network |
| Device identity | X.509 cert, TPM or cert store, inventory-keyed | "healthy devices" (abstract only) | n/f | n/f | Host certs with attributes (servers) | n/f in post read | Dedicated or managed endpoints (1 voice) |
| Trust tiers / posture | 3 tiers; Trust Inferer | n/f | n/f | n/f | n/f | n/f | n/f |
| Phishing-resistant 2FA | Security keys, mandatory; 2018 Krebs claim | n/f | 2FA at bastion † | n/f | n/f | IdP 2FA (post read) | MFA into VDI (1 voice) |
| SSH | Via Access Proxy; device + user checked | BLESS short-lived certs via bastion (archived) | Internal CA, no keys on laptops † | ussh CA; pam-ussh for sudo | n/f | n/f | From VDI onward |
| Production access | Tool Proxy, MPA, 3FA, breakglass | n/f | n/f | n/f | n/f | n/f | n/f |
| Binary allowlisting | Santa (Mac), Carbon Black (Windows), peer voting | n/f | n/f | n/f | n/f | n/f | Approved-software list (1 voice) |
| Patching | Access degraded until patched; forced update | n/f | n/f | Nightly devpod updates † | Short-lived instances † | n/f | Forced weekend reboots (1 voice) |
| Egress from dev machine | Unprivileged net reaches internet; 2023 no-internet pilot reported | n/f | n/f (fwdproxy not found publicly) | n/f | n/f | n/f | n/f |
| DLP / exfiltration | DLP logging (indictment); Chrome/ChromeOS data controls as product; source off laptops (testimony) | n/f | n/f | "trivial to monitor" † | n/f | n/f | Clipboard/USB/file-transfer blocking available in VDI (1 voice, generic) |
| Endpoint telemetry | Central logging, GRR, osquery named | n/f | Fleet syslog † | n/f | n/f | n/f | n/f |

Stripe: devboxes without arbitrary egress, client-certificate frontend (†). Apple: retrospective network-log review in the Zhang case.

---

## Angles for an essay

1. **The certificate is a name tag; the inventory is the judge.** Google's most reusable idea is separating device identity (slow, cryptographic) from device trust (fast, recomputed in under a second). A remote dev machine fits without special handling: the Cloudtop is one more row in the inventory, with a certificate bootstrapped from the cloud's instance identity. Versus a laptop: the laptop's trust decays in a backpack; the Cloudtop is patched where it sits.
2. **Security by withholding access is also how patching gets done.** "BeyondCorp uses access restriction to help drive user actions such as rebooting or accepting updates." The access system doubles as the compliance system. Remote machines remove the user from that loop for the dev box but not for the laptop.
3. **Corp is not prod.** BeyondCorp ends at corp tools. The production path is a separate stack (Tool Proxy, multi-party approval, phone approval) whose stated weakness is that every approver uses the same workstation fleet. A remote dev machine does not fix this; it concentrates it, since the fleet becomes even more uniform.
4. **The long tail is the real cost.** HTTP was easy; NFS, thick clients, license servers, printers and SSH took nine years (2014 paper to the 2023 long-tail article) and ended with a micro-segmented VPN. Other companies' pain with TLS-intercepting proxies (four voices) is the same problem met from the other side: developer tools are the least proxy-friendly software there is.
5. **Exfiltration: a remote dev machine relocates bytes at rest and leaves bytes in view.** The court cases show the pattern: preventive controls missed copy-via-notes-app and laptop-to-card-reader; logs reconstructed everything afterward; a human or outside trigger started the review. What the remote machine buys is fewer places to log and no working tree to carry, not a closed channel. The dev machine's own internet egress then becomes the main hole, which is where the 2023 pilot and agent-era egress allowlists point.
6. **Agents inherit the session.** The 2025 to 2026 worms read every credential and agent config file reachable on the developer's machine. The design Google described in 2018 (credentials hardware-bound, user presence required, more often for higher trust) presumes a human hand on a key; an agent on the dev machine cannot tap. Each control then splits: presence checks stay with the human at the laptop, egress and credential brokering move to the remote machine.

---

## Gaps

- **Google, unpublished:** certificate lifetime and issuance protocol; `gcert` and what `prodaccess` issues; the Cloudtop's trust tier and its reach to production and the internet; whether the 2023 no-internet pilot became policy; deployment extent of 3FA; root on gLinux; any restriction on scp, port forwards or external `git push`; USB storage policy.
- **Not confirmed in this pass:** BeyondCorp Enterprise launch date (January 2021) and the rename to Chrome Enterprise Premium (April 2024); only a release-note date of 8 April 2024 was seen in a snippet.
- **Read only as snippets:** the Ding indictment text itself (DOJ PDF download failed; quotes are from search summaries and The Register), Levandowski DOJ documents, Uber's ussh announcement (403), BLESS, all supply-chain incident reports, all agent-era vendor posts.
- **Other companies, nothing found:** device trust at Meta, Microsoft, Uber, Airbnb, Dropbox, Stripe, Block, Coinbase, Lyft, Pinterest; GitLab handbook tooling (page returned navigation only); Meta fwdproxy; package mirrors and proxy-side dependency scanning; bastion session recording and eBPF command logging; EDR build-time measurements; short-lived cloud credentials and secrets brokers on dev machines; exfiltration controls at Meta, Microsoft, Amazon, Netflix, Stripe; watermarking in trading firms.
- **Not researched:** SPIFFE/SPIRE, Smallstep, Teleport as products; aws-vault and workload identity; CASB/SSE products beyond the Zscaler complaints.
- **Evidence quality notes:** the "no phishing" claim is an unnamed spokesperson, 2018, and says "no reported or confirmed account takeovers". The "20 hours" session figure is one commenter. Santa's opt-out form is one commenter. EDR overhead has two voices and no measurement. 2026 worm names and counts come from overlapping secondary reports.
