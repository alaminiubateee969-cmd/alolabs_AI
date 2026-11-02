# Requested links: availability and integration audit

Checked 2026-11-02 via GitHub repository API. Availability is not an integration test. GitHub 404 can also mean inaccessible/private; it does not prove deletion. License identifiers are GitHub detections, not legal conclusions; inspect all upstream files, model weights and dependencies before use.

## Repository inventory

The table records upstream metadata, **not installation or functional equivalence**. We searched tracked application code, package.json and compose files for project names, inspected existing link-coverage records, and checked submodules. A name match alone is not proof of an integration; lack of an exact name match does not rule out similar functionality. No upstream repositories were added, installed, forked, or runtime-tested as part of this audit.

| Requested repository | GitHub result | Detected license |
| --- | --- | --- |
| [daslearning-org/OpenSMS](https://github.com/daslearning-org/OpenSMS) | OK | Apache-2.0 |
| [meta-models/meta-model-cookbook](https://github.com/meta-models/meta-model-cookbook) | OK | MIT |
| [ArnasDon/wacrm](https://github.com/ArnasDon/wacrm) | OK | MIT |
| [melgarafael/DeskcommCRM](https://github.com/melgarafael/DeskcommCRM) | OK | MIT |
| [domovinatv/sms.domovina.ai](https://github.com/domovinatv/sms.domovina.ai) | OK | unspecified |
| [NdoleStudio/httpsms](https://github.com/NdoleStudio/httpsms) | OK | AGPL-3.0 |
| [NdoleStudio/httpsms-node](https://github.com/NdoleStudio/httpsms-node) | OK | MIT |
| [engralaminn-collab/Ai-Markting-crm](https://github.com/engralaminn-collab/Ai-Markting-crm) | HTTP 404 | unknown |
| [HM-RunningHub/ComfyUI_RH_APICall](https://github.com/HM-RunningHub/ComfyUI_RH_APICall) | OK | unspecified |
| [BelledonneCommunications/linphone-iphone](https://github.com/BelledonneCommunications/linphone-iphone) | OK | GPL-3.0 |
| [0perationPrivacy/VoIP](https://github.com/0perationPrivacy/VoIP) | OK | GPL-3.0 |
| [YutaroHayakawa/ipftrace2](https://github.com/YutaroHayakawa/ipftrace2) | OK | NOASSERTION |
| [developerspace-samples/VoIP-Call-Sample](https://github.com/developerspace-samples/VoIP-Call-Sample) | OK | Apache-2.0 |
| [sibnerian/electron-promise-ipc](https://github.com/sibnerian/electron-promise-ipc) | OK | MIT |
| [WEIFENG2333/VideoCaptioner](https://github.com/WEIFENG2333/VideoCaptioner) | OK | GPL-3.0 |
| [ATH-MaaS/Pixelle-Video](https://github.com/ATH-MaaS/Pixelle-Video) | OK | Apache-2.0 |
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | OK | NOASSERTION |
| [MarkTechStation/VideoCode](https://github.com/MarkTechStation/VideoCode) | OK | unspecified |
| [3b1b/videos](https://github.com/3b1b/videos) | OK | NOASSERTION |
| [ytdl-org/youtube-dl](https://github.com/ytdl-org/youtube-dl) | OK | Unlicense |
| [bradautomates/claude-video](https://github.com/bradautomates/claude-video) | OK | MIT |
| [MeiGen-AI/InfiniteTalk](https://github.com/MeiGen-AI/InfiniteTalk) | OK | Apache-2.0 |
| [qdrzwd/VideoRecorder](https://github.com/qdrzwd/VideoRecorder) | OK | Apache-2.0 |
| [zai-org/CogVideo](https://github.com/zai-org/CogVideo) | OK | Apache-2.0 |
| [Tencent-Hunyuan/HunyuanVideo](https://github.com/Tencent-Hunyuan/HunyuanVideo) | OK | NOASSERTION |
| [elebumm/RedditVideoMakerBot](https://github.com/elebumm/RedditVideoMakerBot) | OK | GPL-3.0 |
| [gitroomhq/postiz-app](https://github.com/gitroomhq/postiz-app) | OK | AGPL-3.0 |
| [jamiepine/voicebox](https://github.com/jamiepine/voicebox) | OK | MIT |
| [KDE/kdenlive](https://github.com/KDE/kdenlive) | OK | GPL-3.0 |
| [mutonby/openshorts](https://github.com/mutonby/openshorts) | OK | MIT |
| [harry0703/MoneyPri](https://github.com/harry0703/MoneyPri) | HTTP 404 | unknown |
| [obsproject/obs-studio](https://github.com/obsproject/obs-studio) | OK | GPL-2.0 |
| [wassgha/rescript](https://github.com/wassgha/rescript) | OK | NOASSERTION |
| [D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) | OK | BSD-3-Clause |
| [langgenius/dify](https://github.com/langgenius/dify) | OK | NOASSERTION |
| [every-app/open-seo](https://github.com/every-app/open-seo) | OK | MIT |
| [presenton/presenton](https://github.com/presenton/presenton) | OK | Apache-2.0 |
| [marclou/mailcheap](https://github.com/marclou/mailcheap) | OK | AGPL-3.0 |
| [aerovato/container](https://github.com/aerovato/container) | OK | BSD-3-Clause |
| [YouBTech01/WiFi-Password-Cracker-Pro](https://github.com/YouBTech01/WiFi-Password-Cracker-Pro) | OK | MIT |

Duplicate requests: `ArnasDon/wacrm`, `qdrzwd/VideoRecorder`, and `mutonby/openshorts` each occur twice and are listed once. The supplied `harry0703/MoneyPri` link returns 404; [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) exists (GitHub reports MIT), but is not silently substituted. `engralaminn-collab/Ai-Markting-crm` also returned 404.

## Existing local evidence (not feature parity)

- `src/lib/link-coverage/registry.ts` already documents linphone-iphone and sms.domovina.ai; documentation is not deployment.
- `src/app/api/sms/`, `src/app/api/whatsapp/`, `src/lib/whatsapp/`, and video routes under `src/app/api/video-hub/` and `src/app/api/video-studio/` provide related code, not evidence of upstream integration or complete feature parity.
- `src/lib/agent-runtime/tool-loop.ts`, `src/lib/ai-router/tool-calls.ts`, `src/lib/ai-router/openrouter-provider.ts`, and `src/lib/ai-router/llama-provider.ts` provide agent/model-related code; live operation and tutorial parity were not tested. See `ALO_LABS_AI_ECOSYSTEM_MATRIX.md` for prior provider verification limitations.
- Some project names appear in generated skill/reference content (including Remotion, Kdenlive and OBS); this is not evidence that those applications are installed or callable.
- `git submodule status` produced no entries. No upstream service was started or tested; feature completeness, security, self-hosting and compatibility remain unverified.

## Other supplied links

- OpenRouter tutorial: https://openrouter.ai/blog/tutorials/build-tool-calling-agent-loop
- Meta AI: https://developer.meta.com/ai
- wacrm setup documentation: https://wacrm.tech/docs/getting-started
- Meta for Developers apps: supplied only as `/ apps`; no complete URL was provided.
- ngrok https://ngrok.com; Vercel https://vercel.com; Node.js https://nodejs.org; Git https://git-scm.com/downloads; https://buildonaut-yt.netlify.app; https://treg.to/.

The execution environment permits outbound access to GitHub and package registries only; the above non-GitHub pages were not fetched or verified. ngrok, Vercel, OpenRouter, Meta/WhatsApp and other hosted APIs are external services and cannot by themselves guarantee independence. Telecommunications, social platforms, model weights and infrastructure can have separate account, network, hardware and licensing requirements.

## Remaining work and decisions

1. Select a first integration and its specific user workflows and acceptance tests. These repositories include unrelated applications, platform-specific clients, libraries, samples and model projects; importing all of them does not implement or safely integrate their functionality.
2. Review licenses and dependency/model terms, security and deployment architecture before selecting versions. AGPL/GPL and custom/undetected licenses require particular care; do not assume GitHub metadata covers all components.
3. For the requested wacrm fork, identify the destination GitHub account/organization and intended ownership before creating a remote fork. No fork was created.
4. Implement and test each selected adapter or self-hosted service, with authentication, tenant isolation, operational controls, deployment instructions, and real end-to-end verification. Do not represent references or stubs as functioning integrations.
5. The Wi-Fi password tool requires a specific authorized security-testing use case and isolation review before any deployment.
