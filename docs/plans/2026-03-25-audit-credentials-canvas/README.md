# Audit Remediation Plan: credentials-canvas

## Overview

This plan addresses findings from three concurrent audits of the credentials-canvas repository: a codebase health audit (21 findings), a 12-pillar evaluation (all pillars below target), and a documentation drift audit (13 findings). The repository is an interactive 3D portfolio built with React, Three.js (via React Three Fiber), Zustand, and Vite.

Remediation follows a strict sequence: subtractive cleanup first (remove dead code, unused dependencies, simplify), then structural code fixes (architecture, error handling, performance, testing), then additive guardrails (lint rules, CI hooks, type safety tooling), and finally documentation corrections. This ordering prevents wasted effort on code that gets deleted and ensures guardrails protect the newly cleaned codebase.

The plan consolidates overlapping findings across all three audit documents into deduplicated tasks. Each phase is tagged with the implementer role responsible for it.

## Prerequisites

- Node.js v24 LTS (managed via nvm)
- Repository cloned with `npm ci` run in both root and `frontend/`
- The 3D model file is not required for any remediation work (tests mock it)

## Phase Summary

| Phase | Tag | Goal | Est. Tokens |
|-------|-----|------|-------------|
| 0 | -- | Foundation: shared patterns, ADRs, testing strategy | ~3,000 |
| 1 | [HYGIENIST] | Dead code removal and simplification | ~12,000 |
| 2 | [IMPLEMENTER] | Error handling, architecture, and performance fixes | ~25,000 |
| 3 | [IMPLEMENTER] | Test coverage gaps and test quality | ~15,000 |
| 4 | [FORTIFIER] | Guardrails: hooks, linting, type safety tooling | ~10,000 |
| 5 | [DOC-ENGINEER] | Documentation fixes and drift prevention | ~10,000 |

## Navigation

- [Phase-0.md](./Phase-0.md) -- Foundation (ADRs, conventions, testing strategy)
- [Phase-1.md](./Phase-1.md) -- [HYGIENIST] Dead code removal and simplification
- [Phase-2.md](./Phase-2.md) -- [IMPLEMENTER] Error handling, architecture, and performance
- [Phase-3.md](./Phase-3.md) -- [IMPLEMENTER] Test coverage and quality
- [Phase-4.md](./Phase-4.md) -- [FORTIFIER] Guardrails and tooling
- [Phase-5.md](./Phase-5.md) -- [DOC-ENGINEER] Documentation fixes
- [feedback.md](./feedback.md) -- Review feedback tracking
