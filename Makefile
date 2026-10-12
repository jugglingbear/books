.DEFAULT_GOAL := help
SHELL := /bin/bash
PNPM ?= pnpm

.PHONY: help install serve-local build preview lint test check publish

##@ Commands

help: ## Show available commands.
	@printf '\n\033[1mBooks — available commands:\033[0m\n'
	@awk 'BEGIN { FS = ":.*## " } \
		/^##@ / { printf "\n\033[1;38;5;208m%s\033[0m\n", substr($$0, 5); next } \
		/^[a-zA-Z0-9_-]+:.*## / { printf "  \033[97m%-22s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@printf '\n'

install: ## Install the locked dependencies with pnpm.
	@printf '📦 Installing dependencies…\n'
	@$(PNPM) install --frozen-lockfile

serve-local: ## Start the site at http://127.0.0.1:4321/books/.
	@printf '🌐 Serving Books locally…\n'
	@$(PNPM) run dev

build: ## Build the static site into dist/.
	@printf '📦 Building Books…\n'
	@$(PNPM) run build

preview: ## Preview an existing production build.
	@printf '🌐 Previewing Books…\n'
	@$(PNPM) run preview

lint: ## Lint changed Markdown records and documentation.
	@printf '🧹 Checking Markdown…\n'
	@$(PNPM) run lint:markdown

test: ## Verify search, status semantics, and import reconciliation.
	@printf '🧪 Running catalog tests…\n'
	@$(PNPM) run test

check: lint test ## Run all validation and the production build.
	@printf '🔍 Checking Astro and TypeScript…\n'
	@$(PNPM) run check
	@printf '📦 Verifying the production build…\n'
	@$(PNPM) run build
	@printf '✅ All checks passed.\n'

publish: check ## Push a clean main branch to trigger GitHub Pages.
	@if [[ -n "$$(git status --porcelain)" ]]; then \
		printf '❌ Commit the reviewed changes before publishing.\n' >&2; exit 1; fi
	@if [[ "$$(git branch --show-current)" != 'main' ]]; then \
		printf '❌ Publishing requires the main branch.\n' >&2; exit 1; fi
	@printf '🌐 Pushing main to GitHub Pages…\n'
	@git push origin main
