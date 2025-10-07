# Branch Protection Rules Setup

Este arquivo documenta as regras de proteção que devem ser configuradas no GitHub.

## Configurações Recomendadas para a Branch `main`

### 1. Require pull request reviews before merging
- [x] Require approvals: 1
- [x] Dismiss stale PR approvals when new commits are pushed
- [x] Require review from code owners (se houver CODEOWNERS)

### 2. Require status checks to pass before merging
- [x] Require branches to be up to date before merging
- [x] Status checks required:
  - `test / Run Tests and Coverage`
  - `build / Build Application`
  - `sonarcloud / SonarCloud Analysis`

### 3. Require conversation resolution before merging
- [x] Require conversation resolution before merging

### 4. Require signed commits (opcional)
- [ ] Require signed commits

### 5. Require linear history
- [x] Require linear history

### 6. Include administrators
- [ ] Include administrators (para permitir merges de emergência)

## Como Configurar no GitHub

1. Vá para: Settings → Branches
2. Clique em "Add rule"
3. Branch name pattern: `main`
4. Configure as opções acima
5. Salve a regra