# Reading and viewing guide

The essay links evidence beside the claims it supports. This guide selects starting points for readers who want the original engineering explanations. The company dossiers contain a broader bibliography, locators, verification notes, and uncertainties.

## The core historical record

1. **Google, KDD 2010:** Diane Tang, Ashish Agarwal, Deirdre O'Brien, Mike Meyer, [Overlapping Experiment Infrastructure: More, Better, Faster Experimentation](https://research.google/pubs/overlapping-experiment-infrastructure-more-better-faster-experimentation/). Read §§3–4 for the binary/configuration distinction and feature lifecycle. [Readable copy](https://static1.squarespace.com/static/5facca71a363746603c14e78/t/64e41b8a839d294f4df06e8f/1692670860658/Overlapping%2BExperiment%2BInfrastructure%2B-%2BMore,%2BBetter,%2BFaster%2BExperimentation.pdf).
2. **Facebook, May 2008:** Eugene Letuchy, [Facebook Chat](https://engineering.fb.com/2008/05/13/web/facebook-chat/). Pair with [Erlang at Facebook, 2009](https://www.erlang-factory.com/upload/presentations/31/EugeneLetuchy-ErlangatFacebook.pdf), especially slides 11–12.
3. **Flickr, December 2009:** Ross Harmes, [Flipping Out](https://code.flickr.net/2009/12/02/flipping-out/). A short, unusually direct implementer account.
4. **IMVU, February 2009:** Timothy Fitz, [Continuous Deployment at IMVU](https://timothyfitz.com/2009/02/10/continuous-deployment-at-imvu-doing-the-impossible-fifty-times-a-day/). Read the testing and rollback mechanics alongside the headline cadence.
5. **Etsy, February 2011:** Chad Dickerson, [How does Etsy manage development and operations?](https://www.etsy.com/codeascraft/how-does-etsy-manage-development-and-operations). Especially useful evidence of explicitly acknowledged borrowing.
6. **Facebook, SOSP 2015:** Chunqiang Tang et al., [Holistic Configuration Management at Facebook](https://sigops.org/s/conferences/sosp/2015/current/2015-Monterey/008-tang-online.pdf). Read §4 and the adoption discussion.
7. **Google, 2016:** [Reliable Product Launches at Scale](https://sre.google/sre-book/reliable-product-launches/), *Site Reliability Engineering*, chapter 27. Read alongside chapter 8, [Release Engineering](https://sre.google/sre-book/release-engineering/).

## Particularly useful for a financial-firm audience

1. **Netflix, November 2013:** [Preparing the Netflix API for Deployment](https://netflixtechblog.com/preparing-the-netflix-api-for-deployment-786d8f58090d). Focus on “User Acceptance Tests.”
2. **Dropbox, April 2017:** Amandine Lee, [Accelerating Iteration Velocity on Dropbox's Desktop Client, Part 2](https://dropbox.tech/application/accelerating-iteration-velocity-on-dropboxs-desktop-client-part-2). Focus on “Code gating” and the retained release controls.
3. **Stripe, February 2017:** Jacqueline Xu, [Online migrations at scale](https://stripe.com/blog/online-migrations). A correctness-oriented migration case.
4. **Adyen, January 2018:** Michiel Toneman, [From 0 — $100 billion: Scaling infrastructure and workflow at Adyen](https://www.adyen.com/knowledge-hub/from-0-100-billion-scaling-infrastructure-and-workflow-at-adyen). Focus on deployment versus activation.
5. **DORA, 2018:** [Accelerate State of DevOps Report](https://dora.dev/research/2018/dora-report/2018-dora-accelerate-state-of-devops-report.pdf). Read printed pp. 11–14 and the methodology; distinguish association from causation.
6. **Banking epilogue, May 2022:** Will Sewell, [How we deploy to production over 100 times a day](https://monzo.com/blog/2022/05/16/how-we-deploy-to-production-over-100-times-a-day). Read its qualifications about metrics, as well as its account of guardrails.

## Talks, conference material, and oral history

Inspection status matters: an official program or video description establishes a talk's subject, not every statement made during it. The essay does not silently treat uninspected recordings as verified transcripts.

| Material | Date | How it was used |
| --- | --- | --- |
| John Allspaw and Paul Hammond, [10+ Deploys Per Day: Dev and Ops Cooperation at Flickr](https://www.youtube.com/watch?v=LdOe18KhtT4), Velocity | June 2009 | Recording reference; detailed Flickr claims rest on readable implementer accounts. |
| Eugene Letuchy, [Erlang at Facebook](https://www.erlang-factory.com/upload/presentations/31/EugeneLetuchy-ErlangatFacebook.pdf), Erlang Factory | April 2009 | Slides inspected for chronology. |
| Brett Slatkin, [The Secret to Safe Continuous Deployment](https://www.youtube.com/watch?v=UMnZiTL0tUc), Google for Developers | June 2013 | Official description inspected; transcript not verified. A useful optional viewing lead. |
| Rossi, Tian, Boumans, Schauenberg, [Releasing at Scale](https://www.usenix.org/conference/srecon14/technical-sessions/presentation/releasing-scale), USENIX SREcon | May 2014 | Program and biographies inspected; used for community participation. |
| Daniel V. Klein, [Making “Push on Green” a Reality](https://www.usenix.org/conference/lisa14/conference-program/presentation/klein), USENIX LISA | November 2014 | Read the associated [paper with Betser and Monroe](https://www.usenix.org/system/files/login/articles/login_1410_05_klein.pdf); video not watched. |
| Dinah McNutt, [Release Engineering Best Practices at Google](https://www.usenix.org/conference/lisa15/conference-program/presentation/mcnutt), USENIX LISA | November 2015 | Abstract inspected; detailed support comes from her 2016 SRE chapter. |
| Jan-Joost Bouwman and Ingrid Algra, [ITIL and DevOps Can Be Friends](https://www.slideshare.net/slideshow/jan-joost-bouwman-janjoost-bouwmanitilanddevopscanbefriends-1-55188504/55188504), DevOps Enterprise Summit | October 2015 | Organizer-uploaded slides and speaker notes inspected. |
| Will Larson, [Paying Technical Debt at Scale — Migrations @Stripe](https://www.infoq.com/presentations/stripe-technical-debt/), QCon | Published December 2018 | Practitioner transcript inspected; publication date is not asserted as presentation date. |
| Chuck Rossi, [Facebook Release Engineering](https://softwareengineeringdaily.com/2019/08/27/facebook-release-engineering-with-chuck-rossi/), Software Engineering Daily | August 2019 | [Transcript](https://softwareengineeringdaily.com/wp-content/uploads/2019/08/SEDFB14-Facebook-Release-Engineering.pdf) inspected; retrospective testimony. |

## Useful counterweights

- [How Microsoft Builds Software, 1997](https://www.cs.umd.edu/~atif/Teaching/Spring2003/cusumano.pdf): frequent integration predates the main web-company narrative.
- [Continuous Deployment of Mobile Software at Facebook, 2016](https://www.eecg.toronto.edu/~stumm/Papers/Rossi-FSE-16.pdf): release trains, stabilization, and soak remain visible.
- [Feature Toggles: Practitioner Practices and a Case Study, 2016](https://users.encs.concordia.ca/~pcr/paper/Rahman2016MSR.pdf): original empirical study of benefits and maintenance burdens.
- [Piranha: Reducing Feature Flag Debt at Uber, 2020](https://manu.sridharan.net/files/ICSE20-SEIP-Piranha.pdf): lifecycle and cleanup obligations.

These sources strengthen the argument by defining what the discipline includes and where its mechanisms stop.
