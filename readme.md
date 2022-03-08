### Commit msg linter (optional)

O package [git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter) obriga a manter um padrão de commits o que faz com que seja mais fácil verificar as alterações na aplicação a longo prazo pois os commits vão estar separados por tópicos. `fix, feat, build, chore, ci, docs, style, refactor, perf, test:`

Resources:

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter)

### Typescript

Adicionar Typescript ao projeto juntamente com os NodeJs types. Ao rodar o comando `npx tsc --init` vai ser gerado um ficheiro de configuração do typescript.

`npm i -D typescript @types/node`
`npx tsc --init`

Resources:

- [Typescript](https://www.typescriptlang.org/)
- [@types/node](https://www.npmjs.com/package/@types/node)

### ESlint with standard config

O ESlint juntamente com a config standard vai fazer com que obrigatóriamente o nosso código siga algumas regras estruturais e de escrita deixando sempre tudo coerente.

PS: Para usar a standart-config em projetos typescript é necessário instalar packages extras

    npm install --save-dev \

    typescript@\* \

    eslint@^7.12.1 \

    eslint-plugin-promise@^5.0.0 \

    eslint-plugin-import@^2.22.1 \

    eslint-plugin-node@^11.1.0 \

    @typescript-eslint/eslint-plugin@^4.0.1 \

    eslint-config-standard-with-typescript@latest

Resources:

- [ESlint](https://eslint.org/)
- [StandardJS](https://standardjs.com/)
- [StandardJS for Typescript](https://github.com/standard/eslint-config-standard-with-typescript)
