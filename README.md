# DeepSeek Harness

English | [中文](README.zh.md)

DeepSeek Harness (`dsh`) is an open-source agent harness developed by [DeepSeek AI](https://deepseek.com).

It is built on an **everything-is-a-plugin** architecture and powered by [Cordis](https://github.com/cordiverse/cordis), whose design is described in [_A Programming Paradigm for Spatiotemporal Composability_](https://arxiv.org/abs/2608.25512).

Documentation: [https://deepseek-harness.github.io/deepseek-harness/](https://deepseek-harness.github.io/deepseek-harness/)

## Learning project

This repository contains personal learning exercises based on the [DeepSeek Harness source](https://github.com/deepseek-ai/deepseek-harness). It explores Cordis plugins and agent architecture as preparation for a simplified enterprise agent platform.

The original harness, applications, SDKs, and upstream documentation are the work of DeepSeek AI and upstream contributors. This learning project's added plugin code, experiments, and tests live in [learning/02-cordis/](learning/02-cordis/); its documentation and engineering additions include this learning overview and the local-development ignore rules.

Private learning notes and validation logs in `notes/` stay local. The upstream [MIT license](LICENSE), attribution, and [third-party notices](THIRD_PARTY_NOTICES.md) are retained.

### Technology stack

The current code uses TypeScript, Node.js >=24.9.0, pnpm workspaces, and Cordis. The upstream applications include a React/Vite Web UI, Electron desktop app, and TypeScript/Python SDKs. `package.json` specifies pnpm 11.28.5.

### Implemented exercises

The [Cordis exercises](learning/02-cordis/) demonstrate:

- Loading a minimal plugin from YAML.
- Plugin lifecycle, parent/child disposal, and asynchronous cleanup.
- Typed events and listener cleanup after unloading.
- Service registration and consumer reactivation through `inject`.

The learning exercises use Node.js tests and require no model API key. An enterprise Vue 3 frontend, Spring Boot backend, and PostgreSQL storage are outside the current implementation.

### Run the exercises locally

From the repository root, install dependencies and run the existing tests:

```sh
pnpm install
pnpm exec tsc -b learning/02-cordis
node --import tsx --test learning/02-cordis/*.test.ts
```

All five tests should pass. For the upstream Web UI, follow [Run from source](#run-from-source); authenticated model calls require a separately configured provider. Local credentials, learning notes, session records, dependencies, and build outputs stay outside version control.

The [Learning CI workflow](.github/workflows/learning-ci.yml) runs these type checks and tests on pushes and pull requests to `main` in `LEKKO2310/dsh-learning-lab`, using a GitHub-hosted runner without model credentials. Upstream release, real-API, organization-policy, and enterprise-runner workflows are disabled in this repository's Actions settings; their source files remain intact. Inherited Dependabot version updates are disabled. This CI validates the Cordis learning exercises, not the entire upstream harness.

## Developer preview

DeepSeek Harness is in _developer preview_ and iterating rapidly. **THERE WILL BE COMPATIBILITY-BREAKING CHANGES.**

Review the [safety notice](SAFETY.md) before running the project.

## Run

### Run from `npm`

Install `Node.js`, then run:

```sh
npx @deepseek-ai/dsh web
```

The command starts the Web UI at `http://127.0.0.1:3080` by default and opens it in the default browser for a local launch. An SSH launch only prints the host URL because the SSH client or editor owns the local forwarded address. Pass `--no-open` to run the server without opening a browser. See [Web UI guide](docs/user/guide/index.md).

### Run from source

To run from a repository checkout:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` prepares the repository artifacts. `pnpm dsh web` uses those built artifacts without rebuilding.

## Community and support

- Submit feedback or bug reports through [GitHub Discussions](https://github.com/deepseek-ai/deepseek-harness/discussions).
- Add the [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic to your plugin repository for discoverability.
- Join <a href="https://discord.gg/4MrtZUhpxg">DeepSeek Harness Discord community</a>.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Development

Start with the [development guide](docs/development.md) and [architecture documentation](docs/architecture.md).

`pnpm run dev:web` builds, serves, and rebuilds client bundles on source edits in one terminal, and `make help` lists the matching Make targets for Web and Desktop; the guide's application commands section owns the full table.

For agents, follow [AGENTS.md](AGENTS.md).

## Citation

```bibtex
@misc{deepseek-harness2026,
  title={DeepSeek Harness: Everything is a Plugin},
  author={DeepSeek-AI},
  year={2026},
  publisher={GitHub},
  howpublished={\url{https://github.com/deepseek-ai/deepseek-harness}},
}
```

## License

[MIT](LICENSE)

Third-party dependencies and their licenses are disclosed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
